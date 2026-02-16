import { useState, useEffect, useCallback, useMemo } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface NavigatorStandalone extends Navigator {
  standalone?: boolean;
}

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Platform Detection
  const isIOS = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice =
      /iphone|ipad|ipod/.test(userAgent) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);
    return isIosDevice;
  }, []);

  // Installation Status Check
  const checkIsInstalled = useCallback(() => {
    if (typeof window === 'undefined') return false;
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as NavigatorStandalone).standalone === true;
    return isStandalone;
  }, []);

  const [isAppInstalled, setIsAppInstalled] = useState(checkIsInstalled);

  // Prompt Visibility Logic
  const [showPrompt, setShowPrompt] = useState(() => {
    if (typeof window === 'undefined') return false;
    const installed = checkIsInstalled();
    const hasDismissed = sessionStorage.getItem('pwa-prompt-dismissed');

    // If installed, never show prompt
    if (installed) return false;

    // If dismissed, don't show prompt
    if (hasDismissed) return false;

    // For iOS, show if not installed (since there's no event)
    // For Android, we wait for the event (handled in useEffect)
    return isIOS;
  });

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);

      const installed = checkIsInstalled();
      const hasDismissed = sessionStorage.getItem('pwa-prompt-dismissed');

      if (!installed && !hasDismissed) {
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

    // Check installation status on mount/visibility change (in case installed via browser menu)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setIsAppInstalled(checkIsInstalled());
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [checkIsInstalled]);

  const installApp = useCallback(async () => {
    if (!deferredPrompt) {
      if (isIOS) {
        // iOS doesn't support programmatic install, UI should handle instructions
        console.log('iOS installation instructions required');
      } else {
        console.warn('No installation prompt available');
      }
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
  }, [deferredPrompt, isIOS]);

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
    showPrompt,
  };
};
