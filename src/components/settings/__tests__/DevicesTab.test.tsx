import { render, screen, fireEvent } from '@testing-library/react';
import { DevicesTab } from '../DevicesTab';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock Setting components
vi.mock('../SettingHeartRate', () => ({
  SettingHeartRate: () => <div data-testid="setting-heart-rate">Heart Rate Settings</div>,
}));

vi.mock('../SettingNFC', () => ({
  SettingNFC: () => <div data-testid="setting-nfc">NFC Settings</div>,
}));

// Mock icons
vi.mock('lucide-react', () => ({
  Watch: () => <div data-testid="icon-watch" />,
  Nfc: () => <div data-testid="icon-nfc-header" />,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('DevicesTab', () => {
  const mockOnOpenDeviceManager = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all hardware sections', () => {
    render(<DevicesTab onOpenDeviceManager={mockOnOpenDeviceManager} />);
    expect(screen.getByText('heartRateSafetyTitle')).toBeDefined();
    expect(screen.getByText('nfcTitle')).toBeDefined();
    expect(screen.getByTestId('setting-heart-rate')).toBeDefined();
    expect(screen.getByTestId('setting-nfc')).toBeDefined();
  });

  it('calls onOpenDeviceManager when button clicked', () => {
    render(<DevicesTab onOpenDeviceManager={mockOnOpenDeviceManager} />);
    const scanBtn = screen.getByText('scanForDevices');

    fireEvent.click(scanBtn);
    expect(mockOnOpenDeviceManager).toHaveBeenCalled();
  });
});
