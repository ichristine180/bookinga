declare module 'virtual:pwa-register/react' {
    export interface UseRegisterSWOptions {
        immediate?: boolean;
        onNeedRefresh?: () => void;
        onOfflineReady?: () => void;
        onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void;
        onRegisterError?: (error: any) => void;
    }

    export function useRegisterSW(options?: UseRegisterSWOptions): {
        offlineReady: [boolean, (val: boolean) => void];
        needRefresh: [boolean, (val: boolean) => void];
        updateServiceWorker: (reloadPage?: boolean) => void;
    };
}
