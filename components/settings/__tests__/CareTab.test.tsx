import { render, screen, fireEvent } from '@testing-library/react';
import { CareTab } from '../CareTab';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock UI components
vi.mock('../../ui/Switch', () => ({
  Switch: ({
    checked,
    onCheckedChange,
  }: {
    checked: boolean;
    onCheckedChange: (v: boolean) => void;
  }) => (
    <input
      type="checkbox"
      data-testid="ui-switch"
      checked={checked}
      onChange={(e) => onCheckedChange(e.target.checked)}
    />
  ),
}));

vi.mock('../../ui/Badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="ui-badge">{children}</div>
  ),
}));

// Mock icons
vi.mock('lucide-react', () => ({
  Battery: () => <div data-testid="icon-battery" />,
  Globe: () => <div data-testid="icon-globe" />,
}));

// Mock hooks
vi.mock('../../../contexts/SettingsContext', () => ({
  useSettings: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, def?: string) => def || key,
    i18n: {
      language: 'en',
      changeLanguage: vi.fn(),
    },
  }),
}));

import { useSettings } from '../../../contexts/SettingsContext';

describe('CareTab', () => {
  const mockSetLowPowerMode = vi.fn();
  const mockSetPreventSleep = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSettings).mockReturnValue({
      lowPowerMode: false,
      setLowPowerMode: mockSetLowPowerMode,
      preventSleep: false,
      setPreventSleep: mockSetPreventSleep,
      activeTab: 'care',
      setActiveTab: vi.fn(),
    });
  });

  it('renders phone care sections', () => {
    render(<CareTab />);
    expect(screen.getByRole('heading', { name: /Phone Care/i })).toBeDefined();
    expect(screen.getByText((c) => c.includes('Battery Saver'))).toBeDefined();
    expect(screen.getByText((c) => c.includes('Stay Awake'))).toBeDefined();
    // Use a more specific matcher for the language section
    expect(screen.getByText(/Language \/ Idioma/i)).toBeDefined();
  });

  it('toggles power settings', () => {
    render(<CareTab />);
    const switches = screen.getAllByTestId('ui-switch');

    // Toggle Stay Awake (first switch)
    if (switches[0]) fireEvent.click(switches[0]);
    expect(mockSetPreventSleep).toHaveBeenCalled();

    // Toggle Battery Saver (second switch)
    if (switches[1]) fireEvent.click(switches[1]);
    expect(mockSetLowPowerMode).toHaveBeenCalled();
  });

  it('toggles language', () => {
    render(<CareTab />);
    const langBtn = screen.getByText(/English/i);
    fireEvent.click(langBtn);
  });
});
