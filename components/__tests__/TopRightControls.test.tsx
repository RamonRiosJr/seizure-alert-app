import { render, screen, fireEvent } from '@testing-library/react';
import TopRightControls from '../TopRightControls';
import { vi, describe, it, expect, beforeEach, Mock } from 'vitest';
import React from 'react';

// Mocks
vi.mock('../../contexts/UIContext', () => ({
  useUI: vi.fn(),
}));

vi.mock('../../contexts/SettingsContext', () => ({
  useSettings: vi.fn(),
}));

vi.mock('../../hooks/useBattery', () => ({
  useBattery: vi.fn(),
}));

vi.mock('../../contexts/BLEContext', () => ({
  useBLEContext: vi.fn(),
}));

// Mock useTranslation
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, options?: Record<string, string | number>) => {
      // Handle keys with options manually
      if (key === 'ariaBatteryStatus' && options) {
        return `Battery ${options.percentage}%, ${options.status}, ${options.action}`;
      }

      const translations: Record<string, string> = {
        aboutTitle: 'About Aura',
        openReports: 'View Reports',
        settings: 'Settings',
        bluetoothDisconnected: 'Bluetooth Disconnected',
        bluetoothReconnecting: 'Bluetooth Reconnecting...',
        bluetoothConnected: 'Connected',
        batteryCharging: 'Charging',
        batteryDischarging: 'Discharging',
        batteryTapSettings: 'Tap for settings',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Settings: (props: Record<string, unknown>) => <div data-testid="icon-settings" {...props} />,
  ClipboardList: (props: Record<string, unknown>) => (
    <div data-testid="icon-clipboard" {...props} />
  ),
  AlertTriangle: (props: Record<string, unknown>) => <div data-testid="icon-alert" {...props} />,
  Heart: (props: Record<string, unknown>) => <div data-testid="icon-heart" {...props} />,
  Coffee: (props: Record<string, unknown>) => <div data-testid="icon-coffee" {...props} />,
  Battery: (props: Record<string, unknown>) => <div data-testid="icon-battery" {...props} />,
  Zap: (props: Record<string, unknown>) => <div data-testid="icon-zap" {...props} />,
  Bluetooth: (props: Record<string, unknown>) => <div data-testid="icon-bluetooth" {...props} />,
  BluetoothSearching: (props: Record<string, unknown>) => (
    <div data-testid="icon-bluetooth-searching" {...props} />
  ),
}));

import { useUI } from '../../contexts/UIContext';
import { useSettings } from '../../contexts/SettingsContext';
import { useBattery } from '../../hooks/useBattery';
import { useBLEContext } from '../../contexts/BLEContext';

describe('TopRightControls', () => {
  const mockOpenModal = vi.fn();
  const mockSetActiveTab = vi.fn();
  const mockScan = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useUI as unknown as Mock).mockReturnValue({
      openModal: mockOpenModal,
    });

    (useSettings as unknown as Mock).mockReturnValue({
      activeTab: 'people',
      setActiveTab: mockSetActiveTab,
      lowPowerMode: false,
    });

    (useBattery as unknown as Mock).mockReturnValue({
      level: 0.8,
      charging: false,
      isSupported: true,
    });

    (useBLEContext as unknown as Mock).mockReturnValue({
      scan: mockScan,
      connectedDevice: null,
      isReconnecting: false,
    });
  });

  it('renders standard buttons with accessible labels', () => {
    render(<TopRightControls theme="dark" toggleTheme={() => {}} />);

    expect(screen.getByRole('button', { name: 'About Aura' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Buy me a coffee' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Medical Disclaimer' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View Reports' })).toBeInTheDocument();
    // Use exact match to differentiate from "Tap for settings"
    expect(screen.getByRole('button', { name: /^Settings$/ })).toBeInTheDocument();
  });

  it('renders Bluetooth indicator as a button and triggers scan', () => {
    render(<TopRightControls theme="dark" toggleTheme={() => {}} />);

    // With updated mock, label should be 'Bluetooth Disconnected'
    const bleBtn = screen.getByRole('button', { name: /Bluetooth Disconnected/i });
    expect(bleBtn).toBeInTheDocument();

    fireEvent.click(bleBtn);
    expect(mockScan).toHaveBeenCalled();
  });

  it('renders Battery indicator as a button and opens settings > care', () => {
    render(<TopRightControls theme="dark" toggleTheme={() => {}} />);

    // With updated mock, label should be 'Battery 80%, Discharging, Tap for settings'
    const batteryBtn = screen.getByRole('button', {
      name: /Battery 80%, Discharging, Tap for settings/i,
    });
    expect(batteryBtn).toBeInTheDocument();

    fireEvent.click(batteryBtn);
    expect(mockSetActiveTab).toHaveBeenCalledWith('care');
    expect(mockOpenModal).toHaveBeenCalledWith('settings');
  });
});
