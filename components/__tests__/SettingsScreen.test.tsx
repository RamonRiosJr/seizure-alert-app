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

// Mock lucide-react with a Proxy to handle ALL icons automatically
vi.mock('lucide-react', () => {
  return new Proxy(
    {},
    {
      get: (target, name: string) => {
        if (name === '__esModule') return true;
        return (props: Record<string, unknown>) => (
          <div data-testid={`icon-${name.toLowerCase()}`} {...props} />
        );
      },
    }
  );
});

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

import { useSettings } from '../../contexts/SettingsContext';

describe('SettingsScreen', () => {
  const mockSetActiveTab = vi.fn();
  const mockSetPreventSleep = vi.fn();
  const mockSetLowPowerMode = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSettings).mockReturnValue({
      lowPowerMode: false,
      setLowPowerMode: mockSetLowPowerMode,
      preventSleep: false,
      setPreventSleep: mockSetPreventSleep,
      activeTab: 'profile',
      setActiveTab: mockSetActiveTab,
    });
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
