import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { User, UserRole, Service, Salon } from '@/types';
import { emailService } from '@/services/emailService';

export interface SalonRegistrationData {
    salonName: string;
    description: string;
    businessType: string;
    tinNumber?: string;
    capacity: number;

    province: string;
    city: string;
    country: string;

    phone: string;
    website?: string;

    workingHours: {
        [key: string]: {
            open: string;
            close: string;
            closed: boolean;
        };
    };

    services: Omit<Service, 'id' | 'salonId' | 'createdAt' | 'updatedAt'>[];
}

interface AuthContextType {
    currentUser: FirebaseUser | null;
    userProfile: User | null;
    loading: boolean;
    isApproved: boolean;
    needsApproval: boolean;
    login: (emailOrPhone: string, password: string) => Promise<void>;
    register: (phoneOrEmail: string, password: string, displayName: string, role: UserRole) => Promise<void>;
    registerSalonAdmin: (email: string, password: string, displayName: string, salonData: SalonRegistrationData) => Promise<void>;
    logout: () => Promise<void>;
    updateUserProfile: (updates: Partial<User>) => Promise<void>;
    resendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
    const [userProfile, setUserProfile] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const isApproved = userProfile?.approvalStatus === 'approved';
    const needsApproval = userProfile?.approvalStatus === 'pending' && userProfile?.role !== 'customer';

    const fetchUserProfile = async (uid: string): Promise<User | null> => {

        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                const data = userDoc.data();
                const salonId = data?.salonId;
                const salonData = salonId ? (await getDoc(doc(db, 'salons', salonId))).data() : null;

                return {
                    ...data,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt,
                    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : data.updatedAt,
                    approvedAt: data.approvedAt?.toDate ? data.approvedAt.toDate() : data.approvedAt,
                    salon: salonData,
                } as User;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    };

    const login = async (emailOrPhone: string, password: string) => {
        try {
            const isPhoneNumber = /^\+[\d\s\-\(\)]{7,}$/.test(emailOrPhone);

            let userCredential;

            if (isPhoneNumber) {
                const usersRef = collection(db, 'users');
                const q = query(usersRef, where('phone', '==', emailOrPhone));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    throw new Error('No account found with this phone number.');
                }

                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();

                if (!userData.email) {
                    throw new Error('Account found but no email associated. Please contact support.');
                }

                userCredential = await signInWithEmailAndPassword(auth, userData.email, password);
            } else {
                userCredential = await signInWithEmailAndPassword(auth, emailOrPhone, password);
            }

            const profile = await fetchUserProfile(userCredential.user.uid);
            if (profile && profile.role !== 'customer' && profile.approvalStatus !== 'approved') {
                if (profile.approvalStatus === 'rejected') {
                    await signOut(auth);
                    throw new Error(`Account rejected: ${profile.rejectionReason || 'Please contact support'}`);
                } else if (profile.approvalStatus === 'pending') {
                    console.log('User logged in with pending approval');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (phoneOrEmail: string, password: string, displayName: string, role: UserRole) => {
        try {
            console.log('Starting registration for:', phoneOrEmail, role);

            let email: string;
            let phone: string;

            if (role === 'customer') {
                phone = phoneOrEmail;

                email = `${phone.replace(/[^0-9]/g, '')}@bookinga.local`;

                const usersRef = collection(db, 'users');
                const phoneQuery = query(usersRef, where('phone', '==', phone));
                const phoneSnapshot = await getDocs(phoneQuery);

                if (!phoneSnapshot.empty) {
                    throw new Error('An account with this phone number already exists');
                }
            } else {
                email = phoneOrEmail;
                phone = '';
            }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log('Firebase Auth user created:', user.uid);

            await updateProfile(user, { displayName });

            const userProfile = {
                uid: user.uid,
                email: role === 'customer' ? email : email,
                displayName,
                role,
                phone: phone !== '' ? phone : null,
                approvalStatus: role === 'customer' ? 'approved' : 'pending',
                profileCompleted: role === 'customer',
                emailVerified: false,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            };

            console.log('Creating user document with data:', userProfile);

            await setDoc(doc(db, 'users', user.uid), userProfile);

            console.log('User document created successfully');

            try {
                await sendEmailVerification(user);
                console.log('Verification email sent');
            } catch (emailError) {
                console.warn('Failed to send verification email:', emailError);
            }

            if (role !== 'customer') {
                try {
                    await addDoc(collection(db, 'approval-requests'), {
                        type: 'user_registration',
                        entityId: user.uid,
                        requestedBy: user.uid,
                        status: 'pending',
                        createdAt: Timestamp.now(),
                        updatedAt: Timestamp.now(),
                    });

                    console.log('Approval request created');

                    try {
                        await notifySuperAdmins('New User Registration', `${displayName} has registered as ${role} and needs approval.`);
                    } catch (notifyError) {
                        console.warn('Failed to notify super admins:', notifyError);
                    }
                } catch (approvalError) {
                    console.warn('Failed to create approval request:', approvalError);
                }
            }

            console.log('Registration completed successfully');
        } catch (error: any) {
            console.error('Registration error:', error);

            if (error.message.includes('phone number already exists')) {
                throw new Error('An account with this phone number already exists');
            } else if (error.code === 'auth/email-already-in-use') {
                throw new Error('This email is already registered. Please use a different email or try logging in.');
            } else if (error.code === 'auth/weak-password') {
                throw new Error('Password is too weak. Please use at least 6 characters.');
            } else if (error.code === 'auth/invalid-email') {
                throw new Error('Invalid email address format.');
            } else if (error.code === 'permission-denied') {
                throw new Error('Permission denied. Please check your account permissions.');
            } else {
                throw new Error(`Registration failed: ${error.message || 'Unknown error'}`);
            }
        }
    };

    const registerSalonAdmin = async (email: string, password: string, displayName: string, salonData: SalonRegistrationData) => {
        try {
            console.log('Starting salon admin registration for:', email);

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            console.log('Firebase Auth user created:', user.uid);

            await updateProfile(user, { displayName });

            const salonDocData = {
                name: salonData.salonName,
                description: salonData.description,
                businessType: salonData.businessType,
                tinNumber: salonData.tinNumber || '',
                capacity: salonData.capacity,
                address: {
                    province: salonData.province,
                    city: salonData.city,
                    country: salonData.country,
                },
                contact: {
                    phone: salonData.phone,
                    email: user.email!,
                    website: salonData.website || '',
                },
                workingHours: salonData.workingHours,
                images: [],
                ownerId: user.uid,
                isActive: false,
                approvalStatus: 'pending',
                subscription: {
                    plan: 'basic',
                    expiresAt: Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)),
                },
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            };

            console.log('Creating salon document...');
            const salonDoc = await addDoc(collection(db, 'salons'), salonDocData);
            console.log('Salon document created with ID:', salonDoc.id);

            if (salonData.services && salonData.services.length > 0) {
                console.log('Creating initial services...');
                const servicePromises = salonData.services.map((service) =>
                    addDoc(collection(db, 'services'), {
                        ...service,
                        salonId: salonDoc.id,
                        isActive: false,
                        createdAt: Timestamp.now(),
                        updatedAt: Timestamp.now(),
                    })
                );
                await Promise.all(servicePromises);
                console.log('Services created successfully');
            }

            const userProfile = {
                uid: user.uid,
                email: user.email!,
                displayName,
                role: 'salon_admin' as UserRole,
                phone: salonData.phone,
                salonId: salonDoc.id,
                approvalStatus: 'pending',
                profileCompleted: true,
                emailVerified: false,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            };

            console.log('Creating user profile...');
            await setDoc(doc(db, 'users', user.uid), userProfile);
            console.log('User profile created successfully');

            try {
                await sendEmailVerification(user);
                console.log('Verification email sent');
            } catch (emailError) {
                console.warn('Failed to send verification email:', emailError);
            }

            try {
                await addDoc(collection(db, 'approval-requests'), {
                    type: 'salon_registration',
                    entityId: salonDoc.id,
                    requestedBy: user.uid,
                    status: 'pending',
                    createdAt: Timestamp.now(),
                    updatedAt: Timestamp.now(),
                });

                console.log('Approval request created');

                try {
                    await notifySuperAdmins('New Salon Registration', `${displayName} has registered salon "${salonData.salonName}" and needs approval.`);
                } catch (notifyError) {
                    console.warn('Failed to notify super admins:', notifyError);
                }
            } catch (approvalError) {
                console.warn('Failed to create approval request:', approvalError);
            }

            console.log('Salon admin registration completed successfully');
        } catch (error: any) {
            console.error('Salon registration error:', error);

            if (error.code === 'auth/email-already-in-use') {
                throw new Error('This email is already registered. Please use a different email or try logging in.');
            } else if (error.code === 'auth/weak-password') {
                throw new Error('Password is too weak. Please use at least 6 characters.');
            } else if (error.code === 'auth/invalid-email') {
                throw new Error('Invalid email address format.');
            } else if (error.code === 'permission-denied') {
                throw new Error('Permission denied. Please check your account permissions.');
            } else {
                throw new Error(`Salon registration failed: ${error.message || 'Unknown error'}`);
            }
        }
    };

    const notifySuperAdmins = async (title: string, message: string) => {
        try {
            const superAdminEmails = ['admin@salonbook.com', 'he.kwizera@gmail.com'];

            await Promise.all(
                superAdminEmails.map((email) =>
                    emailService.sendNotification({
                        to_email: email,
                        to_name: 'Super Admin',
                        subject: title,
                        message: message,
                    })
                )
            );
        } catch (error) {
            console.error('Error notifying super admins:', error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUserProfile(null);
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    };

    const updateUserProfile = async (updates: Partial<User>) => {
        if (!currentUser || !userProfile) return;

        try {
            const filteredUpdates = Object.fromEntries(Object.entries(updates).filter(([_, value]) => value !== undefined));

            const updatedProfile = {
                ...filteredUpdates,
                updatedAt: Timestamp.now(),
            };

            await updateDoc(doc(db, 'users', currentUser.uid), updatedProfile);
            setUserProfile((prev: any) => (prev ? { ...prev, ...updatedProfile } : null));
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    };

    const resendVerificationEmail = async () => {
        if (!currentUser) throw new Error('No user logged in');
        await sendEmailVerification(currentUser);
    };

    const getLoggedInSalonInfo = async () => {
        if (!currentUser) return null;
        const salonId = (await fetchUserProfile(currentUser.uid))?.salonId;
        if (!salonId) return null;
        const salonDoc = await getDoc(doc(db, 'salons', salonId));
        return salonDoc.data() as Salon;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            console.log('Auth state changed:', user?.uid || 'No user');
            setCurrentUser(user);

            if (user) {
                const profile = await fetchUserProfile(user.uid);
                setUserProfile(profile);
                console.log('User profile loaded:', profile?.role, profile?.approvalStatus);
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userProfile,
        loading,
        isApproved,
        needsApproval,
        login,
        register,
        registerSalonAdmin,
        logout,
        updateUserProfile,
        resendVerificationEmail,
        getLoggedInSalonInfo,
    };

    return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
