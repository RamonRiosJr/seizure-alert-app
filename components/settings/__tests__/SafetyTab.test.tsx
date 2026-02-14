import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock UI components
vi.mock('../SettingShake', () => ({
  SettingShake: () => <div data-testid="setting-shake">Shake Settings</div>,
}));

vi.mock('../SettingFallDetection', () => ({
  SettingFallDetection: () => (
    <div data-testid="setting-fall-detection">Fall Detection Settings</div>
  ),
}));

// Mock icons
vi.mock('lucide-react', () => ({
  Bell: () => <div data-testid="icon-bell" />,
  Pencil: () => <div data-testid="icon-pencil" />,
  Save: () => <div data-testid="icon-save" />,
  Volume2: () => <div data-testid="icon-volume2" />,
  VolumeX: () => <div data-testid="icon-volumex" />,
  Mic: () => <div data-testid="icon-mic" />,
}));

// Mock hooks
vi.mock('../../../hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn((key, initial) => [initial, vi.fn()]),
}));

vi.mock('../../../contexts/LanguageContext', () => ({
  useLanguage: () => ({ language: 'en' }),
}));

vi.mock('../../../hooks/useEmergencyAlert', () => ({
  useEmergencyAlert: vi.fn(),
}));

vi.mock('../../../contexts/SettingsContext', () => ({
  useSettings: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { render, screen, fireEvent } from '@testing-library/react';
import { SafetyTab } from '../SafetyTab';
import { useSettings, SettingsContextType } from '../../../contexts/SettingsContext';
import { useEmergencyAlert } from '../../../hooks/useEmergencyAlert';

describe('SafetyTab', () => {
  const mockStartAlert = vi.fn();
  const mockStopAlert = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useEmergencyAlert).mockReturnValue({
      startAlert: mockStartAlert,
      stopAlert: mockStopAlert,
      isMuted: false,
      toggleSound: vi.fn(),
      hasAudioPermission: true,
      attemptResume: vi.fn(),
    });
    const mockSettings: SettingsContextType = {
      voiceActivationEnabled: false,
      setVoiceActivationEnabled: vi.fn(),
      picovoiceAccessKey: '',
      setPicovoiceAccessKey: vi.fn(),
      lowPowerMode: false,
      setLowPowerMode: vi.fn(),
      preventSleep: false,
      setPreventSleep: vi.fn(),
      activeTab: 'safety',
      setActiveTab: vi.fn(),
    };
    vi.mocked(useSettings).mockReturnValue(mockSettings);
  });

  it('renders all safety sections', () => {
    render(<SafetyTab />);
    expect(screen.getByText(/sirenTitle/i)).toBeDefined();
    expect(screen.getByTestId('setting-shake')).toBeDefined();
    expect(screen.getByTestId('setting-fall-detection')).toBeDefined();
    expect(screen.getByText(/customAlertMsgTitle/i)).toBeDefined();
  });

  it('toggles siren preview on button click', () => {
    render(<SafetyTab />);
    const testBtn = screen.getByText(/testSiren/i);

    // Start preview
    fireEvent.click(testBtn);
    expect(mockStartAlert).toHaveBeenCalled();
    expect(screen.getByText(/stopTest/i)).toBeDefined();

    // Stop preview
    fireEvent.click(screen.getByText(/stopTest/i));
    expect(mockStopAlert).toHaveBeenCalled();
    expect(screen.getByText(/testSiren/i)).toBeDefined();
  });

  it('saves custom alert message', () => {
    const mockSetItem = vi.spyOn(Storage.prototype, 'setItem');
    const mockAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(<SafetyTab />);
    const textarea = screen.getByPlaceholderText(/customAlertPlaceholder/i);
    const saveBtn = screen.getByText(/settingsSave/i);

    fireEvent.change(textarea, { target: { value: 'New Emergency Message' } });
    fireEvent.click(saveBtn);

    expect(mockSetItem).toHaveBeenCalled();
    expect(mockAlert).toHaveBeenCalledWith('settingsSaveSuccess');
  });

  it('stops alert on unmount', () => {
    const { unmount } = render(<SafetyTab />);
    unmount();
    expect(mockStopAlert).toHaveBeenCalled();
  });
});
