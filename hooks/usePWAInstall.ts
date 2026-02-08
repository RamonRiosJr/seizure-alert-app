import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const usePWAInstall = () => {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isAppInstalled, setIsAppInstalled] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Check if running in standalone mode (already installed)
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;
        setIsAppInstalled(isStandalone);

        // Detect iOS (including iPadOS which often reports as Mac)
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent) ||
            (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

        // Only consider it "iOS" if it's NOT already in standalone mode
        const isIOSBrowser = isIosDevice && !isStandalone;
        setIsIOS(isIOSBrowser);

        // Check if user has previously dismissed the prompt in this session
        const hasDismissed = sessionStorage.getItem('pwa-prompt-dismissed');

        if (isStandalone) {
            setShowPrompt(false);
        } else if (!hasDismissed) {
            // For iOS, we show the prompt immediately if not installed
            if (isIOSBrowser) {
                setShowPrompt(true);
            }
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsInstallable(true);

            if (!isStandalone && !hasDismissed) {
                setShowPrompt(true);
            }
            console.log('👋 PWA Install Prompt captured!');
        };

        const handleAppInstalled = () => {
            setIsAppInstalled(true);
            setIsInstallable(false);
            setDeferredPrompt(null);
            setShowPrompt(false);
            console.log('✅ PWA Installed successfully');
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.addEventListener('appinstalled', handleAppInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            window.removeEventListener('appinstalled', handleAppInstalled);
        };
    }, []);

    const installApp = useCallback(async () => {
        if (!deferredPrompt) {
            // If on iOS, we can't programmatically install. 
            // The UI should handle showing instructions instead.
            console.warn('No installation prompt available (or on iOS)');
            return;
        }

        // Show the install prompt
        await deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to install prompt: ${outcome}`);

        // We've used the prompt, and can't use it again, throw it away
        setDeferredPrompt(null);
        setIsInstallable(false);
        setShowPrompt(false);
    }, [deferredPrompt]);

    const dismissPrompt = useCallback(() => {
        setShowPrompt(false);
        sessionStorage.setItem('pwa-prompt-dismissed', 'true');
    }, []);

    return {
        isInstallable,
        isAppInstalled,
        installApp,
        dismissPrompt,
        isIOS,
        showPrompt
    };
};
