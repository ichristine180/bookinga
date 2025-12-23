import React, { useState, useMemo } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import {
    QrCodeIcon,
    ShareIcon,
    LinkIcon,
    ClipboardDocumentIcon,
    CheckIcon,
} from '@heroicons/react/16/solid';
import { motion, AnimatePresence } from 'framer-motion';
import copy from 'copy-to-clipboard';
import {
    WhatsappShareButton,
    FacebookShareButton,
    TelegramShareButton,
    EmailShareButton,
    WhatsappIcon,
    FacebookIcon,
    TelegramIcon,
    EmailIcon,
} from 'react-share';

const ShareLinkComponent: React.FC = () => {
    const { userProfile } = useAuth();
    const [showQR, setShowQR] = useState(false);
    const [copied, setCopied] = useState(false);

    const salonLink = useMemo(() => {
        return `${window.location.origin}/salon/${userProfile?.salonId}`;
    }, [userProfile?.salonId]);

    const qrCodeUrl = useMemo(() => {
        return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(salonLink)}`;
    }, [salonLink]);

    const handleCopy = () => {
        const success = copy(salonLink);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <div className="bg-white dark:bg-dark-card rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-border">

            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-semibold text-gray-800 dark:text-dark-text flex items-center">
                    <ShareIcon className="w-4 h-4 mr-2 text-primary-500" />
                    Share Salon
                </h3>
                <button
                    onClick={() => setShowQR(!showQR)}
                    aria-label="Show QR Code"
                    className="p-1.5 text-gray-500 hover:bg-gray-100 dark:hover:bg-dark-bg rounded-lg transition-colors"
                >
                    <QrCodeIcon className="w-4 h-4" />
                </button>
            </div>


            <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Share this link with customers to let them book directly.
            </p>


            <div className="bg-gray-50 dark:bg-dark-bg rounded-lg p-2.5 mb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center flex-1 min-w-0">
                        <LinkIcon className="w-3 h-3 text-gray-400 mr-2 flex-shrink-0" />
                        <span className="text-xs text-gray-800 dark:text-dark-text truncate">
                            {salonLink}
                        </span>
                    </div>
                    <button
                        onClick={handleCopy}
                        aria-label="Copy Link"
                        className="ml-2 p-1.5 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors flex-shrink-0"
                    >
                        {copied ? (
                            <CheckIcon className="w-3 h-3 text-green-500" />
                        ) : (
                            <ClipboardDocumentIcon className="w-3 h-3" />
                        )}
                    </button>
                </div>
            </div>


            <div className="flex space-x-2 mb-3">
                <button
                    onClick={handleCopy}
                    className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all duration-200 text-sm ${copied
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50'
                        }`}
                >
                    {copied ? (
                        <span className="flex items-center justify-center space-x-1">
                            <CheckIcon className="w-4 h-4" />
                            <span>Copied</span>
                        </span>
                    ) : (
                        'Copy'
                    )}
                </button>
            </div>


            <div className="flex justify-between space-x-2 mb-4">
                <WhatsappShareButton url={salonLink}>
                    <WhatsappIcon size={32} round />
                </WhatsappShareButton>
                <FacebookShareButton url={salonLink}>
                    <FacebookIcon size={32} round />
                </FacebookShareButton>
                <TelegramShareButton url={salonLink}>
                    <TelegramIcon size={32} round />
                </TelegramShareButton>
                <EmailShareButton url={salonLink}>
                    <EmailIcon size={32} round />
                </EmailShareButton>
            </div>


            <AnimatePresence>
                {showQR && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
                        onClick={() => setShowQR(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            className="bg-white dark:bg-dark-card rounded-xl p-4 max-w-xs mx-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-center">
                                <h3 className="text-base font-semibold text-gray-800 dark:text-dark-text mb-3">
                                    QR Code
                                </h3>
                                <div className="bg-white p-3 rounded-lg mb-3 inline-block">
                                    <img
                                        src={qrCodeUrl}
                                        alt="QR Code"
                                        className="w-32 h-32"
                                    />
                                </div>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                                    Customers can scan this code to visit your salon page
                                </p>
                                <button
                                    onClick={() => setShowQR(false)}
                                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>


            <div className="mt-3 p-2.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="text-xs font-medium text-blue-800 dark:text-blue-400 mb-1">
                    Marketing Tips
                </h4>
                <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-0.5">
                    <li>• Add to social media bio</li>
                    <li>• Print QR on business cards</li>
                    <li>• Share on WhatsApp & Instagram</li>
                </ul>
            </div>
        </div>
    );
};

export default ShareLinkComponent;
