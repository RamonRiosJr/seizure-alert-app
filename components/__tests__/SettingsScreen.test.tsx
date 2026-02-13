import { render, screen, fireEvent } from '@testing-library/react';
import SettingsScreen from '../SettingsScreen';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock child components to avoid context dependency issues
vi.mock('../settings/SettingHeartRate', () => ({
    SettingHeartRate: () => <div data-testid="setting-heart-rate">Heart Rate Settings</div>,
}));

vi.mock('../settings/SettingFallDetection', () => ({
    SettingFallDetection: () => <div data-testid="setting-fall-detection">Fall Detection Settings</div>,
}));

vi.mock('../DeviceManager', () => ({
    DeviceManager: () => <div data-testid="device-manager">Device Manager</div>,
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

// Mock LocalStorage hook
vi.mock('../../hooks/useLocalStorage', () => ({
    useLocalStorage: (key: string, init: any) => [init, vi.fn()],
}));

import { useSettings } from '../../contexts/SettingsContext';
import { useBattery } from '../../hooks/useBattery';

describe('SettingsScreen - Battery & Power', () => {
    const mockSetPreventSleep = vi.fn();
    const mockSetLowPowerMode = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useSettings as any).mockReturnValue({
            lowPowerMode: false,
            setLowPowerMode: mockSetLowPowerMode,
            preventSleep: false,
            setPreventSleep: mockSetPreventSleep,
        });
        (useBattery as any).mockReturnValue({
            level: 0.8,
            dischargeRate: -0.1, // 10% per hour
            isSupported: true,
        });
    });

    it('renders battery health section', () => {
        render(<SettingsScreen isOpen={true} onClose={() => { }} />);

        expect(screen.getByText('Battery Health')).toBeDefined();
        expect(screen.getByText('80%')).toBeDefined();
        expect(screen.getByText(/Discharging: 10.0% \/ hour/)).toBeDefined();
    });

    it('toggles prevent sleep setting', () => {
        render(<SettingsScreen isOpen={true} onClose={() => { }} />);

        const preventSleepToggle = screen.getByText('Prevent Sleep').closest('div')?.nextElementSibling;
        expect(preventSleepToggle).toBeDefined();

        if (preventSleepToggle) fireEvent.click(preventSleepToggle);
        expect(mockSetPreventSleep).toHaveBeenCalledWith(true);
    });
});
