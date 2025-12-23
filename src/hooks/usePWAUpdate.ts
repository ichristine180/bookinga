import { useState } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

export function usePWAUpdate() {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r: ServiceWorkerRegistration | undefined) {
      console.log('SW Registered:', r);

      if (r) {
        setInterval(() => {
          r.update();
        }, 60000);
      }
    },
    onRegisterError(error: any) {
      console.error('SW registration error', error);
    },
    onNeedRefresh() {
      setShowUpdatePrompt(true);
    },
    onOfflineReady() {
      console.log('App ready to work offline');
    },
  });

  const updateApp = () => {
    updateServiceWorker(true);
    setShowUpdatePrompt(false);
  };

  const dismissUpdate = () => {
    setShowUpdatePrompt(false);
  };

  const closeOfflineReady = () => {
    setOfflineReady(false);
  };

  return {
    showUpdatePrompt,
    offlineReady,
    needRefresh,
    updateApp,
    dismissUpdate,
    closeOfflineReady,
  };
}
