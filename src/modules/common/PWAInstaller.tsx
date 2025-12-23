import React, { useEffect, useState, useRef } from 'react';

function isAndroid() {
    return /android/i.test(window.navigator.userAgent);
}

const REMIND_DELAY = 2 * 60 * 1000;

const PWAInstaller: React.FC = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const remindTimeout = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const handler = (e: any) => {
            console.log('beforeinstallprompt event fired', e);
            e.preventDefault();
            setDeferredPrompt(e);
            if (isAndroid()) {
                setShowModal(true);
                setShowButton(false);
            }
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setShowModal(false);
            setShowButton(false);
            if (remindTimeout.current) clearTimeout(remindTimeout.current);
        } else {

            setShowModal(false);
            setShowButton(true);

            if (remindTimeout.current) clearTimeout(remindTimeout.current);
            remindTimeout.current = setTimeout(() => {
                setShowModal(true);
                setShowButton(false);
            }, REMIND_DELAY);
        }
        setDeferredPrompt(null);
    };

    const handleDismiss = () => {
        setShowModal(false);
        setShowButton(true);

        if (remindTimeout.current) clearTimeout(remindTimeout.current);
        remindTimeout.current = setTimeout(() => {
            setShowModal(true);
            setShowButton(false);
        }, REMIND_DELAY);
    };

    useEffect(() => {
        return () => {
            if (remindTimeout.current) clearTimeout(remindTimeout.current);
        };
    }, []);

    if (!isAndroid()) return null;

    return (
        <>
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-t-2xl shadow-lg w-full max-w-md mx-auto p-6 animate-fade-in-up">
                        <div className="flex items-center mb-4">
                            <img src="/android/android-launchericon-192-192.png" alt="App Icon" className="w-10 h-10 rounded mr-3" />
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Install Bookinga</h2>
                                <p className="text-gray-600 text-sm">Get the full app experience on your device.</p>
                            </div>
                        </div>
                        <ul className="mb-4 text-gray-700 text-sm list-disc pl-5">
                            <li>Faster access & offline use</li>
                            <li>Push notifications</li>
                            <li>Native-like experience</li>
                        </ul>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleDismiss}
                                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-medium hover:bg-gray-300"
                            >
                                Maybe Later
                            </button>
                            <button
                                onClick={handleInstallClick}
                                className="px-4 py-2 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700"
                            >
                                Install App
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showButton && (
                <div className="fixed bottom-6 right-6 z-50">
                    <button
                        onClick={handleInstallClick}
                        className="px-5 py-3 bg-primary-600 text-white rounded-lg shadow-lg font-semibold hover:bg-primary-700 transition-colors"
                    >
                        Install App
                    </button>
                </div>
            )}
        </>
    );
};

export default PWAInstaller;