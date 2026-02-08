import React, { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Wifi, WifiOff, RefreshCw, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const OfflineIndicator: React.FC = () => {
    const { t } = useTranslation();
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r);
        },
        onRegisterError(error) {
            console.log('SW registration error', error);
        },
    });

    const close = () => {
        setOfflineReady(false);
        setNeedRefresh(false);
    };

    if (needRefresh) {
        return (
            <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full text-blue-600 dark:text-blue-300">
                            <RefreshCw className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                Update Available
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                A new version of Aura Speaks is available.
                            </p>
                        </div>
                        <button
                            onClick={close}
                            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                    <button
                        onClick={() => updateServiceWorker(true)}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium text-sm transition-colors"
                    >
                        Update Now
                    </button>
                </div>
            </div>
        );
    }

    // Optional: Briefly show "Offline Ready" via a Toast, then hide
    useEffect(() => {
        if (offlineReady) {
            const timer = setTimeout(() => setOfflineReady(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [offlineReady, setOfflineReady]);

    if (offlineReady) {
        return (
            <div className="fixed bottom-4 right-4 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg shadow-lg p-3 flex items-center gap-3">
                    <Wifi className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                        Ready to work offline
                    </span>
                    <button
                        onClick={close}
                        className="ml-auto text-green-600 dark:text-green-400 hover:text-green-800"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    }

    return null;
};
