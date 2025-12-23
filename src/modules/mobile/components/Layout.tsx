import React from 'react';
import BottomNav from './BottomNav';
import Header from './Header';

interface MobileLayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<MobileLayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-dark-bg">
            <Header />

            <main className="flex-1 px-4 py-3 mt-14 mb-14 overflow-y-auto">
                {children}
            </main>

            <BottomNav />
        </div>
    );
};

export default Layout;