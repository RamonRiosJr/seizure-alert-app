import { render, screen, fireEvent } from '@testing-library/react';
import SettingsScreen from '../SettingsScreen';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock child components
vi.mock('../settings/SettingHeartRate', () => ({
  SettingHeartRate: () => <div data-testid="setting-heart-rate">Heart Rate Settings</div>,
}));

vi.mock('../settings/SettingFallDetection', () => ({
  SettingFallDetection: () => (
    <div data-testid="setting-fall-detection">Fall Detection Settings</div>
  ),
}));

vi.mock('../DeviceManager', () => ({
  DeviceManager: () => <div data-testid="device-manager">Device Manager</div>,
}));

// Mock lucide-react icons explicitly to avoid Proxy-related hangs in some environments
vi.mock('lucide-react', () => ({
  X: (props: Record<string, unknown>) => <div data-testid="icon-x" {...props} />,
  User: (props: Record<string, unknown>) => <div data-testid="icon-user" {...props} />,
  Bell: (props: Record<string, unknown>) => <div data-testid="icon-bell" {...props} />,
  Cpu: (props: Record<string, unknown>) => <div data-testid="icon-cpu" {...props} />,
  Brain: (props: Record<string, unknown>) => <div data-testid="icon-brain" {...props} />,
  ShieldAlert: (props: Record<string, unknown>) => (
    <div data-testid="icon-shield-alert" {...props} />
  ),
  Pencil: (props: Record<string, unknown>) => <div data-testid="icon-pencil" {...props} />,
  Save: (props: Record<string, unknown>) => <div data-testid="icon-save" {...props} />,
  Battery: (props: Record<string, unknown>) => <div data-testid="icon-battery" {...props} />,
  Globe: (props: Record<string, unknown>) => <div data-testid="icon-globe" {...props} />,
  Watch: (props: Record<string, unknown>) => <div data-testid="icon-watch" {...props} />,
  Key: (props: Record<string, unknown>) => <div data-testid="icon-key" {...props} />,
  MessageSquare: (props: Record<string, unknown>) => (
    <div data-testid="icon-message-square" {...props} />
  ),
  Users: (props: Record<string, unknown>) => <div data-testid="icon-users" {...props} />,
  Phone: (props: Record<string, unknown>) => <div data-testid="icon-phone" {...props} />,
  Trash2: (props: Record<string, unknown>) => <div data-testid="icon-trash2" {...props} />,
  Plus: (props: Record<string, unknown>) => <div data-testid="icon-plus" {...props} />,
  Nfc: (props: Record<string, unknown>) => <div data-testid="icon-nfc" {...props} />,
  Heart: (props: Record<string, unknown>) => <div data-testid="icon-heart" {...props} />,
  Activity: (props: Record<string, unknown>) => <div data-testid="icon-activity" {...props} />,
  Smartphone: (props: Record<string, unknown>) => <div data-testid="icon-smartphone" {...props} />,
  Zap: (props: Record<string, unknown>) => <div data-testid="icon-zap" {...props} />,
  ShieldCheck: (props: Record<string, unknown>) => (
    <div data-testid="icon-shield-check" {...props} />
  ),
}));

// Mock dependencies
vi.mock('../../contexts/SettingsContext', () => ({
  useSettings: vi.fn(),
}));

vi.mock('../../hooks/useBattery', () => ({
  useBattery: vi.fn(),
}));

vi.mock('../../contexts/ConfigContext', () => ({
  useConfigContext: vi.fn(() => ({
    activeProfile: { id: 'default', name: 'Standard' },
    setProfileId: vi.fn(),
    availableProfiles: [{ id: 'default', name: 'Standard' }],
  })),
}));

vi.mock('../../contexts/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en' }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('../../hooks/usePWAInstall', () => ({
  usePWAInstall: () => ({ isInstallable: false, isAppInstalled: true }),
}));

vi.mock('../../hooks/useShake', () => ({
  useShake: () => ({ isSupported: false, setIsEnabled: vi.fn(), requestPermission: vi.fn() }),
}));

vi.mock('../../hooks/useLocalStorage', () => ({
  useLocalStorage: (key: string, init: unknown) => [init, vi.fn()],
}));

import { useSettings, SettingsContextType } from '../../contexts/SettingsContext';

describe('SettingsScreen', () => {
  const mockSetActiveTab = vi.fn();
  const mockSetPreventSleep = vi.fn();
  const mockSetLowPowerMode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    const mockSettings: SettingsContextType = {
      lowPowerMode: false,
      setLowPowerMode: mockSetLowPowerMode,
      preventSleep: false,
      setPreventSleep: mockSetPreventSleep,
      activeTab: 'profile',
      setActiveTab: mockSetActiveTab,
      voiceActivationEnabled: false,
      setVoiceActivationEnabled: vi.fn(),
      picovoiceAccessKey: '',
      setPicovoiceAccessKey: vi.fn(),
      geminiApiKey: '',
      setGeminiApiKey: vi.fn(),
    };
    vi.mocked(useSettings).mockReturnValue(mockSettings);
  });

  it('renders correctly when open', () => {
    render(<SettingsScreen isOpen={true} onClose={() => {}} />);
    expect(screen.getByText('settingsTitle')).toBeDefined();
    expect(screen.getByTestId('icon-x')).toBeDefined();
  });

  it('renders nothing when closed', () => {
    const { container } = render(<SettingsScreen isOpen={false} onClose={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(<SettingsScreen isOpen={true} onClose={onClose} />);

    const closeBtn = screen.getByLabelText('Close Settings');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
