import React, { useEffect, useState } from 'react';
import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    orderBy
} from 'firebase/firestore';
import { db } from '../../../config/firebase';
import { useApprovalActions } from '@/hooks/useApprovalActions';
import { User, Salon, ApprovalRequest } from '../../../types';
import {
    CheckCircleIcon,
    XCircleIcon,
    ClockIcon,
    UserIcon,
    BuildingStorefrontIcon,
    EyeIcon
} from '@heroicons/react/16/solid';
import { format } from 'date-fns';

interface ApprovalWithDetails extends ApprovalRequest {
    user?: User;
    salon?: Salon;
}

const SuperAdminApprovalsManagementPage: React.FC = () => {
    const { handleApproval } = useApprovalActions();
    const [approvals, setApprovals] = useState<ApprovalWithDetails[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
    const [selectedApproval, setSelectedApproval] = useState<ApprovalWithDetails | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const actionLoading = false;

    useEffect(() => {
        fetchApprovals();
    }, []);

    const fetchApprovals = async () => {
        try {

            const approvalsQuery = query(
                collection(db, 'approval-requests'),
                orderBy('createdAt', 'desc')
            );
            const approvalsSnapshot = await getDocs(approvalsQuery);
            const approvalsData = approvalsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
                reviewedAt: doc.data().reviewedAt?.toDate(),
            })) as ApprovalRequest[];


            const approvalsWithDetails: ApprovalWithDetails[] = [];

            for (const approval of approvalsData) {
                try {
                    let user: User | undefined;
                    let salon: Salon | undefined;


                    const userQuery = query(
                        collection(db, 'users'),
                        where('uid', '==', approval.requestedBy)
                    );
                    const userSnapshot = await getDocs(userQuery);
                    if (!userSnapshot.empty) {
                        const userData = userSnapshot.docs[0].data();
                        user = {
                            ...userData,
                            createdAt: userData.createdAt?.toDate(),
                            updatedAt: userData.updatedAt?.toDate(),
                            approvedAt: userData.approvedAt?.toDate(),
                        } as User;
                    }


                    if (approval.type === 'salon_registration') {
                        const salonDoc = await getDoc(doc(db, 'salons', approval.entityId));
                        if (salonDoc.exists()) {
                            const salonData = salonDoc.data();
                            salon = {
                                id: salonDoc.id,
                                ...salonData,
                                createdAt: salonData.createdAt?.toDate(),
                                updatedAt: salonData.updatedAt?.toDate(),
                                subscription: {
                                    ...salonData.subscription,
                                    expiresAt: salonData.subscription?.expiresAt?.toDate(),
                                },
                            } as Salon;
                        }
                    }

                    approvalsWithDetails.push({
                        ...approval,
                        user,
                        salon,
                    });
                } catch (error) {
                    console.error('Error fetching approval details:', error);
                    approvalsWithDetails.push(approval);
                }
            }

            setApprovals(approvalsWithDetails);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching approvals:', error);
            setLoading(false);
        }
    };

    const filteredApprovals = approvals.filter(approval =>
        filter === 'all' || approval.status === filter
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
            case 'approved':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            case 'rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"></div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            { }
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-dark-text">Approvals Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Review and approve user and salon registrations
                    </p>
                </div>

                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500"
                >
                    <option value="all">All Requests</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            { }
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total', count: approvals.length, color: 'bg-blue-500' },
                    { label: 'Pending', count: approvals.filter(a => a.status === 'pending').length, color: 'bg-yellow-500' },
                    { label: 'Approved', count: approvals.filter(a => a.status === 'approved').length, color: 'bg-green-500' },
                    { label: 'Rejected', count: approvals.filter(a => a.status === 'rejected').length, color: 'bg-red-500' },
                ].map((stat, index) => (
                    <div key={index} className="bg-white dark:bg-dark-card rounded-lg p-6 shadow-sm border border-gray-200 dark:border-dark-border">
                        <div className="flex items-center">
                            <div className={`w-4 h-4 rounded-full ${stat.color} mr-3`}></div>
                            <div>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-800 dark:text-dark-text">{stat.count}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            { }
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-sm border border-gray-200 dark:border-dark-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-dark-bg">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Applicant
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Submitted
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-dark-border">
                            {filteredApprovals.map((approval) => (
                                <tr key={approval.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mr-3">
                                                {approval.type === 'salon_registration' ? (
                                                    <BuildingStorefrontIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                                ) : (
                                                    <UserIcon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-dark-text">
                                                    {approval.type === 'salon_registration'
                                                        ? approval.salon?.name || 'Salon Registration'
                                                        : 'User Registration'
                                                    }
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    ID: {approval.id.slice(-8)}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-dark-text">
                                                {approval.user?.displayName || 'Unknown User'}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {approval.user?.email || 'No email'}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                                            {approval.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-800 dark:text-dark-text">
                                            {approval.createdAt ? format(approval.createdAt, 'MMM dd, yyyy') : 'Unknown'}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {approval.createdAt ? format(approval.createdAt, 'HH:mm') : ''}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(approval.status)}`}>
                                            {approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedApproval(approval);
                                                    setShowModal(true);
                                                }}
                                                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <EyeIcon className="w-4 h-4" />
                                            </button>

                                            {approval.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => handleApproval(approval, 'approve', fetchApprovals, setShowModal, setSelectedApproval, setRejectionReason)}
                                                        disabled={actionLoading}
                                                        className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Approve"
                                                    >
                                                        <CheckCircleIcon className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedApproval(approval);
                                                            setShowModal(true);
                                                        }}
                                                        disabled={actionLoading}
                                                        className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                                                        title="Reject"
                                                    >
                                                        <XCircleIcon className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredApprovals.length === 0 && (
                        <div className="text-center py-12">
                            <ClockIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-2">
                                No approval requests found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                {filter === 'pending'
                                    ? 'All caught up! No pending approvals at the moment.'
                                    : `No ${filter} approval requests found.`
                                }
                            </p>
                        </div>
                    )}
                </div>
            </div>

            { }
            {showModal && selectedApproval && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white dark:bg-dark-card rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-dark-text">
                                {selectedApproval.type === 'salon_registration' ? 'Salon' : 'User'} Approval Request
                            </h2>
                            <button
                                onClick={() => {
                                    setShowModal(false);
                                    setSelectedApproval(null);
                                    setRejectionReason('');
                                }}
                                className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg"
                            >
                                <XCircleIcon className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            { }
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-4">
                                        Applicant Information
                                    </h3>
                                    {selectedApproval.user && (
                                        <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Name</p>
                                                <p className="font-medium text-gray-800 dark:text-dark-text">
                                                    {selectedApproval.user.displayName}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
                                                <p className="text-gray-800 dark:text-dark-text">
                                                    {selectedApproval.user.email}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Phone</p>
                                                <p className="text-gray-800 dark:text-dark-text">
                                                    {selectedApproval.user.phone || 'Not provided'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
                                                <p className="text-gray-800 dark:text-dark-text capitalize">
                                                    {selectedApproval.user.role.replace('_', ' ')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Registered</p>
                                                <p className="text-gray-800 dark:text-dark-text">
                                                    {selectedApproval.user.createdAt
                                                        ? format(selectedApproval.user.createdAt, 'MMM dd, yyyy HH:mm')
                                                        : 'Unknown'
                                                    }
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                { }
                                <div>
                                    <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-4">
                                        Request Details
                                    </h3>
                                    <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 space-y-3">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Request Type</p>
                                            <p className="font-medium text-gray-800 dark:text-dark-text">
                                                {selectedApproval.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Status</p>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(selectedApproval.status)}`}>
                                                {selectedApproval.status.charAt(0).toUpperCase() + selectedApproval.status.slice(1)}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Submitted</p>
                                            <p className="text-gray-800 dark:text-dark-text">
                                                {selectedApproval.createdAt
                                                    ? format(selectedApproval.createdAt, 'MMM dd, yyyy HH:mm')
                                                    : 'Unknown'
                                                }
                                            </p>
                                        </div>
                                        {selectedApproval.reviewedAt && (
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Reviewed</p>
                                                <p className="text-gray-800 dark:text-dark-text">
                                                    {format(selectedApproval.reviewedAt, 'MMM dd, yyyy HH:mm')}
                                                </p>
                                            </div>
                                        )}
                                        {selectedApproval.comments && (
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Comments</p>
                                                <p className="text-gray-800 dark:text-dark-text">
                                                    {selectedApproval.comments}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            { }
                            {selectedApproval.type === 'salon_registration' && selectedApproval.salon && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-4">
                                            Salon Information
                                        </h3>
                                        <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-4 space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Salon Name</p>
                                                <p className="font-medium text-gray-800 dark:text-dark-text">
                                                    {selectedApproval.salon.name}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Business Type</p>
                                                <p className="text-gray-800 dark:text-dark-text">
                                                    {selectedApproval.salon.businessType?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not specified'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                                                <p className="text-gray-800 dark:text-dark-text">
                                                    {selectedApproval.salon.description}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Address</p>
                                                <p className="text-gray-800 dark:text-dark-text">
                                                    {selectedApproval.salon.address.street}, {selectedApproval.salon.address.city}, {selectedApproval.salon.address.state}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Contact</p>
                                                <p className="text-gray-800 dark:text-dark-text">
                                                    {selectedApproval.salon.contact.phone}
                                                </p>
                                                <p className="text-gray-800 dark:text-dark-text">
                                                    {selectedApproval.salon.contact.email}
                                                </p>
                                            </div>
                                            {selectedApproval.salon.businessLicense && (
                                                <div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">Business License</p>
                                                    <p className="text-gray-800 dark:text-dark-text">
                                                        {selectedApproval.salon.businessLicense}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        { }
                        {selectedApproval.status === 'pending' && (
                            <div className="mt-6 border-t border-gray-200 dark:border-dark-border pt-6">
                                <h4 className="text-lg font-medium text-gray-800 dark:text-dark-text mb-4">
                                    Review Decision
                                </h4>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Rejection Reason (optional for rejection)
                                    </label>
                                    <textarea
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-white dark:bg-dark-card text-gray-800 dark:text-dark-text focus:outline-none  focus:ring-primary-500"
                                        placeholder="Provide a reason if rejecting this application..."
                                    />
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={() => handleApproval(selectedApproval, 'reject', fetchApprovals, setShowModal, setSelectedApproval, setRejectionReason)}
                                        disabled={actionLoading}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                                    >
                                        {actionLoading ? 'Processing...' : 'Reject'}
                                    </button>
                                    <button
                                        onClick={() => handleApproval(selectedApproval, 'approve', fetchApprovals, setShowModal, setSelectedApproval, setRejectionReason)}
                                        disabled={actionLoading}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                                    >
                                        {actionLoading ? 'Processing...' : 'Approve'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {selectedApproval.status !== 'pending' && (
                            <div className="mt-6 border-t border-gray-200 dark:border-dark-border pt-6">
                                <div className={`p-4 rounded-lg ${selectedApproval.status === 'approved'
                                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                                    }`}>
                                    <p className={`font-medium ${selectedApproval.status === 'approved'
                                        ? 'text-green-800 dark:text-green-400'
                                        : 'text-red-800 dark:text-red-400'
                                        }`}>
                                        This request has been {selectedApproval.status}
                                    </p>
                                    {selectedApproval.reviewedAt && (
                                        <p className={`text-sm mt-1 ${selectedApproval.status === 'approved'
                                            ? 'text-green-700 dark:text-green-300'
                                            : 'text-red-700 dark:text-red-300'
                                            }`}>
                                            Reviewed on {format(selectedApproval.reviewedAt, 'MMM dd, yyyy HH:mm')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminApprovalsManagementPage;