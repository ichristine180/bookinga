import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { usePWAUpdate } from '@/hooks/usePWAUpdate';
import SplashScreen from '@/modules/common/SplashScreen';
import { UpdateNotification } from '@/components/UpdateNotification';


import RoleBasedRouter from '@/modules/common/RoleBasedRouter';


import AuthCustomerLoginPage from '@/modules/auth/pages/CustomerLoginPage';
import AuthSuperAdminLoginPage from '@/modules/auth/pages/SuperAdminLoginPage';
import AuthRegisterPage from '@/modules/auth/pages/RegisterPage';
import SalonRegistrationPage from '@/modules/auth/pages/SalonRegistrationPage';
import AuthRegistrationSuccessPage from '@/modules/auth/pages/RegistrationSuccessPage';
import AuthPendingApprovalPage from '@/modules/auth/pages/PendingApprovalPage';
import AuthAccountRejectedPage from '@/modules/auth/pages/AccountRejectedPage';


const AppContent: React.FC = () => {
  const { requestNotificationPermission } = useNotifications();
  const { showUpdatePrompt, updateApp, dismissUpdate } = usePWAUpdate();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const requestPermission = async () => {
      if ('Notification' in window && Notification.permission === 'default') {
        setTimeout(() => {
          requestNotificationPermission();
        }, 3000);
      }
    };

    requestPermission();
  }, [requestNotificationPermission]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  return (
    <Router>
      <Routes>
        { }
        <Route path="/login" element={<AuthCustomerLoginPage />} />
        <Route path="/register" element={<AuthRegisterPage userType="customer" />} />
        <Route path="/registration-success" element={<AuthRegistrationSuccessPage />} />

        { }
        <Route path="/salon/register" element={<SalonRegistrationPage />} />
        <Route path="/salon/login" element={<AuthCustomerLoginPage />} />

        { }
        <Route path="/super-admin/login" element={<AuthSuperAdminLoginPage />} />

        { }
        <Route path="/pending-approval" element={<AuthPendingApprovalPage />} />
        <Route path="/account-rejected" element={<AuthAccountRejectedPage />} />

        { }
        <Route path="/*" element={<RoleBasedRouter />} />
      </Routes>
      
      {showUpdatePrompt && (
        <UpdateNotification
          onUpdate={updateApp}
          onDismiss={dismissUpdate}
        />
      )}
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;