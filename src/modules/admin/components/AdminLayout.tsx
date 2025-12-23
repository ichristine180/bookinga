import React, { useState, useEffect, useRef } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import Toast from '@/modules/common/Toast';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, onSnapshot, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

interface AdminLayoutProps {
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type?: 'success' | 'info' | 'error' } | null>(null);
    const { userProfile } = useAuth();
    const lastSeen = useRef<number>(Date.now());

    useEffect(() => {
        if (!userProfile?.salonId) return;

        const appointmentsRef = collection(db, 'appointments');
        const q = query(appointmentsRef, where('salonId', '==', userProfile.salonId), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const data = change.doc.data();

                    const createdAt = data.createdAt instanceof Timestamp ? data.createdAt.toDate().getTime() : Date.now();
                    if (createdAt > lastSeen.current) {
                        setToast({
                            message: `New appointment from customer!`,
                            type: 'info',
                        });
                    }
                }
            });
        });
        return () => unsubscribe();
    }, [userProfile?.salonId]);

    useEffect(() => {
        lastSeen.current = Date.now();
    }, []);

    return (
        <div className="flex h-screen bg-gray-50 dark:bg-dark-bg">
            <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col overflow-hidden">
                <AdminHeader onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 overflow-y-auto ">{children}</main>
            </div>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
};

export default AdminLayout;
