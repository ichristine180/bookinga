import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../contexts/AuthContext';
import { useCloudinaryUpload } from '../../../hooks/useCloudinaryUpload';
import { Staff } from '../../../types';
import { PlusIcon, PencilIcon, TrashIcon, UserIcon } from '@heroicons/react/16/solid';

interface StaffFormData {
    name: string;
    email: string;
    phone: string;
    avatar: string;
    specialties: string[];
    workingHours: {
        [key: string]: {
            open: string;
            close: string;
            available: boolean;
        };
    };
}

const AdminStaffPage: React.FC = () => {
    const { userProfile } = useAuth();
    const { uploadImage, uploading } = useCloudinaryUpload();
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
    const [formData, setFormData] = useState<StaffFormData>({
        name: '',
        email: '',
        phone: '',
        avatar: '',
        specialties: [],
        workingHours: {
            monday: { open: '09:00', close: '17:00', available: true },
            tuesday: { open: '09:00', close: '17:00', available: true },
            wednesday: { open: '09:00', close: '17:00', available: true },
            thursday: { open: '09:00', close: '17:00', available: true },
            friday: { open: '09:00', close: '17:00', available: true },
            saturday: { open: '09:00', close: '17:00', available: true },
            sunday: { open: '09:00', close: '17:00', available: false },
        },
    });

    const availableSpecialties = [
        'Hair Styling',
        'Hair Coloring',
        'Hair Treatment',
        'Nail Care',
        'Manicure',
        'Pedicure',
        'Facial',
        'Massage',
        'Eyebrow & Lashes',
        'Makeup',
        'Skin Care',
    ];

    const daysOfWeek = [
        { key: 'monday', label: 'Monday' },
        { key: 'tuesday', label: 'Tuesday' },
        { key: 'wednesday', label: 'Wednesday' },
        { key: 'thursday', label: 'Thursday' },
        { key: 'friday', label: 'Friday' },
        { key: 'saturday', label: 'Saturday' },
        { key: 'sunday', label: 'Sunday' },
    ];

    useEffect(() => {
        fetchStaff();
    }, [userProfile?.salonId]);

    const fetchStaff = async () => {
        if (!userProfile?.salonId) return;

        try {
            const staffQuery = query(
                collection(db, 'staff'),
                where('salonId', '==', userProfile.salonId)
            );
            const snapshot = await getDocs(staffQuery);
            const staffData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
            })) as Staff[];

            setStaff(staffData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching staff:', error);
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSpecialtyToggle = (specialty: string) => {
        setFormData(prev => ({
            ...prev,
            specialties: prev.specialties.includes(specialty)
                ? prev.specialties.filter(s => s !== specialty)
                : [...prev.specialties, specialty],
        }));
    };

    const handleWorkingHourChange = (day: string, field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            workingHours: {
                ...prev.workingHours,
                [day]: {
                    ...prev.workingHours[day],
                    [field]: value,
                },
            },
        }));
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const imageUrl = await uploadImage(file, 'staff-avatars');
            if (imageUrl) {
                setFormData(prev => ({
                    ...prev,
                    avatar: imageUrl,
                }));
            }
        } catch (error) {
            console.error('Error uploading avatar:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userProfile?.salonId) return;

        try {
            const staffData = {
                ...formData,
                salonId: userProfile.salonId,
                isActive: true,
            };

            if (editingStaff) {
                await updateDoc(doc(db, 'staff', editingStaff.id), staffData);
                setStaff(prev =>
                    prev.map(member =>
                        member.id === editingStaff.id
                            ? { ...member, ...staffData }
                            : member
                    )
                );
            } else {
                const docRef = await addDoc(collection(db, 'staff'), {
                    ...staffData,
                    createdAt: new Date(),
                });
                setStaff(prev => [...prev, {
                    id: docRef.id,
                    ...staffData,
                    createdAt: new Date(),
                } as Staff]);
            }

            resetForm();
            setShowModal(false);
        } catch (error) {
            console.error('Error saving staff member:', error);
        }
    };

    const handleEdit = (staffMember: Staff) => {
        setEditingStaff(staffMember);
        setFormData({
            name: staffMember.name,
            email: staffMember.email,
            phone: staffMember.phone,
            avatar: staffMember.avatar || '',
            specialties: staffMember.specialties,
            workingHours: staffMember.workingHours,
        });
        setShowModal(true);
    };

    const handleDelete = async (staffId: string) => {
        if (!confirm('Are you sure you want to remove this staff member?')) return;

        try {
            await deleteDoc(doc(db, 'staff', staffId));
            setStaff(prev => prev.filter(member => member.id !== staffId));
        } catch (error) {
            console.error('Error deleting staff member:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            avatar: '',
            specialties: [],
            workingHours: {
                monday: { open: '09:00', close: '17:00', available: true },
                tuesday: { open: '09:00', close: '17:00', available: true },
                wednesday: { open: '09:00', close: '17:00', available: true },
                thursday: { open: '09:00', close: '17:00', available: true },
                friday: { open: '09:00', close: '17:00', available: true },
                saturday: { open: '09:00', close: '17:00', available: true },
                sunday: { open: '09:00', close: '17:00', available: false },
            },
        });
        setEditingStaff(null);
    };

    const closeModal = () => {
        setShowModal(false);
        resetForm();
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text">Staff</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your salon team and their schedules
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Add Staff Member
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {staff.map((member) => (
                    <div
                        key={member.id}
                        className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden"
                    >
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center mr-4">
                                        {member.avatar ? (
                                            <img
                                                src={member.avatar}
                                                alt={member.name}
                                                className="w-full h-full object-cover rounded-full"
                                            />
                                        ) : (
                                            <UserIcon className="w-8 h-8 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-800 dark:text-dark-text">{member.name}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{member.email}</p>
                                    </div>
                                </div>

                                <div className="flex space-x-1">
                                    <button
                                        onClick={() => handleEdit(member)}
                                        className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-dark-bg rounded"
                                    >
                                        <PencilIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member.id)}
                                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                                    >
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Specialties:</p>
                                <div className="flex flex-wrap gap-2">
                                    {member.specialties.map((specialty) => (
                                        <span
                                            key={specialty}
                                            className="px-2 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs rounded-full"
                                        >
                                            {specialty}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Contact:</p>
                                <p className="text-sm text-gray-800 dark:text-dark-text">{member.phone}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {staff.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <UserIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-2">
                            No staff members yet
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Add your first team member to start managing appointments.
                        </p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                        >
                            <PlusIcon className="w-5 h-5 mr-2" />
                            Add Staff Member
                        </button>
                    </div>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-dark-card rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text mb-6">
                            {editingStaff ? 'Edit Staff Member' : 'Add New Staff Member'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Phone
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Profile Photo
                                    </label>
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-gray-200 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                            {formData.avatar ? (
                                                <img
                                                    src={formData.avatar}
                                                    alt="Avatar"
                                                    className="w-full h-full object-cover rounded-full"
                                                />
                                            ) : (
                                                <UserIcon className="w-8 h-8 text-gray-400" />
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleAvatarUpload}
                                            disabled={uploading}
                                            className="block text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 dark:file:bg-primary-900/30 dark:file:text-primary-400"
                                        />
                                    </div>
                                    {uploading && (
                                        <p className="text-sm text-primary-600 dark:text-primary-400 mt-2">
                                            Uploading...
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Specialties
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                    {availableSpecialties.map((specialty) => (
                                        <label key={specialty} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={formData.specialties.includes(specialty)}
                                                onChange={() => handleSpecialtyToggle(specialty)}
                                                className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">{specialty}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                                    Working Hours
                                </label>
                                <div className="space-y-3">
                                    {daysOfWeek.map((day) => (
                                        <div key={day.key} className="flex items-center space-x-4">
                                            <div className="w-24">
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{day.label}</span>
                                            </div>

                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.workingHours[day.key].available}
                                                    onChange={(e) => handleWorkingHourChange(day.key, 'available', e.target.checked)}
                                                    className="mr-2 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">Available</span>
                                            </label>

                                            {formData.workingHours[day.key].available && (
                                                <>
                                                    <input
                                                        type="time"
                                                        value={formData.workingHours[day.key].open}
                                                        onChange={(e) => handleWorkingHourChange(day.key, 'open', e.target.value)}
                                                        className="px-3 py-1 border border-gray-300 dark:border-dark-border rounded bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500"
                                                    />
                                                    <span className="text-gray-500">to</span>
                                                    <input
                                                        type="time"
                                                        value={formData.workingHours[day.key].close}
                                                        onChange={(e) => handleWorkingHourChange(day.key, 'close', e.target.value)}
                                                        className="px-3 py-1 border border-gray-300 dark:border-dark-border rounded bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500"
                                                    />
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {editingStaff ? 'Update Staff Member' : 'Add Staff Member'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStaffPage;