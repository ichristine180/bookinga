import React, { useEffect } from 'react';

interface ToastProps {
    message: string;
    type?: 'success' | 'info' | 'error';
    onClose: () => void;
    duration?: number;
}

const typeStyles = {
    success: 'bg-green-500 text-white',
    info: 'bg-blue-500 text-white',
    error: 'bg-red-500 text-white',
};

const Toast: React.FC<ToastProps> = ({ message, type = 'info', onClose, duration = 4000 }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <div className={`fixed top-6 right-6 z-50 px-4 py-3 rounded shadow-lg ${typeStyles[type]} animate-fade-in`}
            role="alert">
            <div className="flex items-center justify-between">
                <span>{message}</span>
                <button onClick={onClose} className="ml-4 text-white font-bold">&times;</button>
            </div>
        </div>
    );
};

export default Toast; 