
import React, { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { User } from '../../../types';
import {
    UsersIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    TrashIcon,
    CheckIcon,
    XMarkIcon,
    ShieldCheckIcon
} from '@heroicons/react/16/solid';
import { format } from 'date-fns';

const SuperAdminUsersManagementPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'salon_admin' | 'super_admin'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [searchQuery, roleFilter, statusFilter, users]);

    const fetchUsers = async () => {
        try {
            const usersSnapshot = await getDocs(collection(db, 'users'));
            const usersData = usersSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
                approvedAt: doc.data().approvedAt?.toDate(),
            })) as unknown as User[];

            setUsers(usersData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setLoading(false);
        }
    };

    const filterUsers = () => {
        let filtered = users;


        if (searchQuery.trim()) {
            filtered = filtered.filter(user =>
                user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (user.phone && user.phone.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }


        if (roleFilter !== 'all') {
            filtered = filtered.filter(user => user.role === roleFilter);
        }


        if (statusFilter !== 'all') {
            filtered = filtered.filter(user => user.approvalStatus === statusFilter);
        }

        setFilteredUsers(filtered);
    };

    const handleStatusToggle = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'approved' ? 'rejected' : 'approved';

        try {
            await updateDoc(doc(db, 'users', userId), {
                approvalStatus: newStatus,
                updatedAt: new Date(),
            });

            setUsers(prev =>
                prev.map(user =>
                    user.uid === userId
                        ? { ...user, approvalStatus: newStatus as any }
                        : user
                )
            );
        } catch (error) {
            console.error('Error updating user status:', error);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            return;
        }

        try {
            await deleteDoc(doc(db, 'users', userId));
            setUsers(prev => prev.filter(user => user.uid !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'super_admin':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'salon_admin':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'customer':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            { }
            <div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text">Users Management</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Manage all users on the platform
                </p>
            </div>

            { }
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-gray-800 dark:text-dark-text">{users.length}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{users.filter(u => u.role === 'customer').length}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Customers</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'salon_admin').length}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Salon Admins</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{users.filter(u => u.role === 'super_admin').length}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Super Admins</p>
                    </div>
                </div>
            </div>

            { }
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search users by name, email, or phone..."
                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-dark-card rounded-lg border border-gray-200 dark:border-dark-border focus:outline-none  focus:ring-primary-500 text-gray-800 dark:text-dark-text"
                    />
                </div>

                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value as any)}
                    className="px-4 py-3 border border-gray-200 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500"
                >
                    <option value="all">All Roles</option>
                    <option value="customer">Customers</option>
                    <option value="salon_admin">Salon Admins</option>
                    <option value="super_admin">Super Admins</option>
                </select>

                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="px-4 py-3 border border-gray-200 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500"
                >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            { }
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-dark-bg">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Joined
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                            {filteredUsers.map((user) => (
                                <tr key={user.uid} className="hover:bg-gray-50 dark:hover:bg-dark-bg">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-4">
                                                {user.role === 'super_admin' ? (
                                                    <ShieldCheckIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                ) : (
                                                    <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                                                        {user.displayName?.charAt(0)?.toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-dark-text">
                                                    {user.displayName}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {user.email}
                                                </p>
                                                {user.phone && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {user.phone}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                                            {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(user.approvalStatus)} w-fit`}>
                                                {user.approvalStatus?.charAt(0)?.toUpperCase() + user.approvalStatus?.slice(1)}
                                            </span>
                                            { }
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-800 dark:text-dark-text">
                                            {user.createdAt ? format(user.createdAt, 'MMM dd, yyyy') : 'Unknown'}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {user.createdAt ? format(user.createdAt, 'HH:mm') : ''}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setShowModal(true);
                                                }}
                                                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>

                                            {user.role !== 'super_admin' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusToggle(user.uid, user.approvalStatus)}
                                                        className={`p-2 rounded-lg transition-colors ${user.approvalStatus === 'approved'
                                                            ? 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30'
                                                            : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30'
                                                            }`}
                                                        title={user.approvalStatus === 'approved' ? 'Reject' : 'Approve'}
                                                    >
                                                        {user.approvalStatus === 'approved' ? (
                                                            <XMarkIcon className="w-4 h-4" />
                                                        ) : (
                                                            <CheckIcon className="w-4 h-4" />
                                                        )}
                                                    </button>

                                                    <button
                                                        onClick={() => handleDeleteUser(user.uid)}
                                                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                        title="Delete User"
                                                    >
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredUsers.length === 0 && (
                        <div className="text-center py-12">
                            <UsersIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-2">
                                No users found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {searchQuery || roleFilter !== 'all' || statusFilter !== 'all'
                                    ? 'Try adjusting your filters.'
                                    : 'No users have been registered yet.'
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>

            { }
            {showModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-dark-card rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text">
                                User Details
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg"
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            { }
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-4">
                                    Profile Information
                                </h3>
                                <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 space-y-3">
                                    <div className="flex items-center">
                                        <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-4">
                                            {selectedUser.role === 'super_admin' ? (
                                                <ShieldCheckIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
                                            ) : (
                                                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                                                    {selectedUser.displayName?.charAt(0)?.toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-medium text-gray-800 dark:text-dark-text">
                                                {selectedUser.displayName}
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-400">{selectedUser.email}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(selectedUser.role)}`}>
                                                {selectedUser.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedUser.approvalStatus)}`}>
                                                {selectedUser.approvalStatus?.charAt(0)?.toUpperCase() + selectedUser.approvalStatus?.slice(1)}
                                            </span>
                                        </div>
                                        {selectedUser.phone && (
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                                                <p className="text-sm text-gray-800 dark:text-dark-text">{selectedUser.phone}</p>
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Email Verified</p>
                                            <p className={`text-sm ${selectedUser.emailVerified ? 'text-green-600' : 'text-red-600'}`}>
                                                {selectedUser.emailVerified ? 'Yes' : 'No'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            { }
                            <div>
                                <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-4">
                                    Account Information
                                </h3>
                                <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">User ID</p>
                                        <p className="text-sm font-mono text-gray-800 dark:text-dark-text">{selectedUser.uid}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Created</p>
                                        <p className="text-sm text-gray-800 dark:text-dark-text">
                                            {selectedUser.createdAt
                                                ? format(selectedUser.createdAt, 'MMM dd, yyyy HH:mm')
                                                : 'Unknown'
                                            }
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Last Updated</p>
                                        <p className="text-sm text-gray-800 dark:text-dark-text">
                                            {selectedUser.updatedAt
                                                ? format(selectedUser.updatedAt, 'MMM dd, yyyy HH:mm')
                                                : 'Unknown'
                                            }
                                        </p>
                                    </div>
                                    {selectedUser.approvedAt && (
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Approved</p>
                                            <p className="text-sm text-gray-800 dark:text-dark-text">
                                                {format(selectedUser.approvedAt, 'MMM dd, yyyy HH:mm')}
                                            </p>
                                        </div>
                                    )}
                                    {selectedUser.salonId && (
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Salon ID</p>
                                            <p className="text-sm font-mono text-gray-800 dark:text-dark-text">{selectedUser.salonId}</p>
                                        </div>
                                    )}
                                    {selectedUser.rejectionReason && (
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Rejection Reason</p>
                                            <p className="text-sm text-gray-800 dark:text-dark-text">{selectedUser.rejectionReason}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            { }
                            {selectedUser.role !== 'super_admin' && (
                                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-dark-border">
                                    <button
                                        onClick={() => handleStatusToggle(selectedUser.uid, selectedUser.approvalStatus)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedUser.approvalStatus === 'approved'
                                            ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400'
                                            : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                                            }`}
                                    >
                                        {selectedUser.approvalStatus === 'approved' ? 'Reject User' : 'Approve User'}
                                    </button>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminUsersManagementPage;