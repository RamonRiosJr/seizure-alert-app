import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';

type ModalType = 'settings' | 'reports' | 'chat' | 'disclaimer' | 'about' | null;
type ScreenType = 'ready' | 'alert';

interface UIContextType {
  activeModal: ModalType;
  screen: ScreenType;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  setScreen: (screen: ScreenType) => void;
  isAnyModalOpen: boolean;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [screen, setScreen] = useState<ScreenType>('ready');

  // Handle browser back button to close modals
  useEffect(() => {
    const handlePopState = (_event: PopStateEvent) => {
      if (activeModal) {
        // If a modal is open, hitting back should close it
        setActiveModal(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeModal]);

  const openModal = useCallback((modal: ModalType) => {
    if (modal) {
      // Push state so back button works
      window.history.pushState({ modal }, '', window.location.pathname);
      setActiveModal(modal);
    }
  }, []);

  const closeModal = useCallback(() => {
    if (activeModal) {
      // If we have history state, go back to remove it?
      // Or just clear state. Ideally we should probably sync fully with history but for now:
      setActiveModal(null);
      // Optional: window.history.back() if we pushed?
      // This can gets tricky. Let's keep it simple: State drives UI.
      // If we pushed state on open, we should pop on close ideally, but user might click 'X'.
      // If user clicks 'X', we effectively want to "consume" that history state or just ignore it.
      // For simplicity in this PWA:
      // We won't strictly bind to history length to avoid "stuck" navigation.
      // We just listen to popstate to CLOSE.
    }
  }, [activeModal]);

  const value = {
    activeModal,
    screen,
    openModal,
    closeModal,
    setScreen,
    isAnyModalOpen: activeModal !== null,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
