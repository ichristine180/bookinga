import React, { useEffect, useState } from 'react';

function isIos() {
    return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isInStandaloneMode() {
    return ('standalone' in window.navigator) && (window.navigator.standalone);
}

const IOSPWABanner: React.FC = () => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (isIos() && !isInStandaloneMode()) {
            setShow(true);
        }
    }, []);

    if (!show) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-blue-600 text-white p-4 flex items-center justify-between shadow-lg">
            <div>
                <strong>Install this app:</strong> Tap the <span style={{ fontSize: 20 }}>Share</span> icon <span role="img" aria-label="share">⬆️</span> and select <strong>Add to Home Screen</strong>.
            </div>
            <button onClick={() => setShow(false)} className="ml-4 text-white font-bold">&times;</button>
        </div>
    );
};

export default IOSPWABanner; 