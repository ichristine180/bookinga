import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from './useNotifications';
import { emailService } from '../services/emailService';
import { db } from '../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { ApprovalRequest, User, Salon } from '../types';
import { useState } from 'react';

interface ApprovalWithDetails extends ApprovalRequest {
    user?: User;
    salon?: Salon;
}

export const useApprovalActions = () => {
    const { userProfile } = useAuth();
    const { createNotification } = useNotifications();
    const [actionLoading, setActionLoading] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');

    const handleApproval = async (
        approval: ApprovalWithDetails,
        action: 'approve' | 'reject',
        fetchApprovals: () => Promise<void>,
        setShowModal: (show: boolean) => void,
        setSelectedApproval: (approval: ApprovalWithDetails | null) => void,
        setRejectionReason: (reason: string) => void
    ) => {
        if (!userProfile) return;
        setActionLoading(true);
        try {
            const now = new Date();
            const updateData = {
                status: action === 'approve' ? 'approved' : 'rejected',
                reviewedBy: userProfile.uid,
                reviewedAt: now,
                updatedAt: now,
                ...(action === 'reject' && rejectionReason && { comments: rejectionReason }),
            };
            await updateDoc(doc(db, 'approval-requests', approval.id), updateData);
            if (approval.type === 'salon_registration' && approval.salon) {
                await updateDoc(doc(db, 'salons', approval.entityId), {
                    approvalStatus: action === 'approve' ? 'approved' : 'rejected',
                    isActive: action === 'approve',
                    approvedBy: userProfile.uid,
                    approvedAt: now,
                    ...(action === 'reject' && rejectionReason && { rejectionReason }),
                    updatedAt: now,
                });
                if (approval.user) {
                    await updateDoc(doc(db, 'users', approval.user.uid), {
                        approvalStatus: action === 'approve' ? 'approved' : 'rejected',
                        approvedBy: userProfile.uid,
                        approvedAt: now,
                        ...(action === 'reject' && rejectionReason && { rejectionReason }),
                        updatedAt: now,
                    });
                }
                if (approval.user && approval.salon) {
                    if (action === 'approve') {
                        await emailService.sendSalonApprovalNotification({
                            to_email: approval.user.email,
                            to_name: approval.user.displayName,
                            salon_name: approval.salon.name,
                            approval_url: `${window.location.origin}/salon/login`,
                        });
                    } else {
                        await emailService.sendSalonRejectionNotification({
                            to_email: approval.user.email,
                            to_name: approval.user.displayName,
                            salon_name: approval.salon.name,
                            approval_url: '',
                            rejection_reason: rejectionReason,
                        });
                    }
                }
                if (approval.user) {
                    await createNotification(
                        approval.user.uid,
                        action === 'approve' ? 'salon_approved' : 'salon_rejected',
                        action === 'approve' ? 'Salon Approved!' : 'Salon Application Update',
                        action === 'approve'
                            ? `Your salon "${approval.salon.name}" has been approved and is now live!`
                            : `Your salon application has been declined. ${rejectionReason ? `Reason: ${rejectionReason}` : 'Please contact support for more information.'}`
                    );
                }
            } else if (approval.type === 'user_registration' && approval.user) {
                await updateDoc(doc(db, 'users', approval.entityId), {
                    approvalStatus: action === 'approve' ? 'approved' : 'rejected',
                    approvedBy: userProfile.uid,
                    approvedAt: now,
                    ...(action === 'reject' && rejectionReason && { rejectionReason }),
                    updatedAt: now,
                });
                if (action === 'approve') {
                    await emailService.sendAccountApprovalNotification({
                        to_email: approval.user.email,
                        to_name: approval.user.displayName,
                        approval_url: `${window.location.origin}/login`,
                    });
                } else {
                    await emailService.sendAccountRejectionNotification({
                        to_email: approval.user.email,
                        to_name: approval.user.displayName,
                        approval_url: '',
                        rejection_reason: rejectionReason,
                    });
                }
                await createNotification(
                    approval.user.uid,
                    action === 'approve' ? 'account_approved' : 'account_rejected',
                    action === 'approve' ? 'Account Approved!' : 'Account Application Update',
                    action === 'approve'
                        ? 'Your account has been approved. You can now access all features!'
                        : `Your account application has been declined. ${rejectionReason ? `Reason: ${rejectionReason}` : 'Please contact support for more information.'}`
                );
            }
            await fetchApprovals();
            setShowModal(false);
            setSelectedApproval(null);
            setRejectionReason('');
        } catch (error) {
            console.error('Error processing approval:', error);
            alert('Failed to process approval. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    return { handleApproval, actionLoading, rejectionReason, setRejectionReason };
};