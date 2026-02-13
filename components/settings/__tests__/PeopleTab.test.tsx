import { render, screen, fireEvent } from '@testing-library/react';
import { PeopleTab } from '../PeopleTab';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock Setting components
vi.mock('../SettingContacts', () => ({
  SettingContacts: () => <div data-testid="setting-contacts">Contact Settings</div>,
}));

// Mock icons
vi.mock('lucide-react', () => ({
  User: () => <div data-testid="icon-user" />,
  ShieldAlert: () => <div data-testid="icon-shield-alert" />,
  Users: () => <div data-testid="icon-users" />,
}));

// Mock hooks
vi.mock('../../../hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn((key, initial) => [initial, vi.fn()]),
}));

vi.mock('../../../contexts/ConfigContext', () => ({
  useConfigContext: vi.fn(() => ({
    activeProfile: {
      id: 'default',
      name: 'Standard',
      colors: { primary: '', secondary: '', alert: '' },
      terminology: { event: '', history: '', actionPrompt: '' },
      features: { seizureTypes: true, triggers: true, medications: true, audiogram: true },
    },
    setProfileId: vi.fn(),
    availableProfiles: [
      {
        id: 'default',
        name: 'Standard',
        colors: { primary: '', secondary: '', alert: '' },
        terminology: { event: '', history: '', actionPrompt: '' },
        features: { seizureTypes: true, triggers: true, medications: true, audiogram: true },
      },
    ],
  })),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { useConfigContext } from '../../../contexts/ConfigContext';
import { useLocalStorage } from '../../../hooks/useLocalStorage';

describe('PeopleTab', () => {
  const mockSetProfileId = vi.fn();
  const mockSetPatientInfo = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useConfigContext).mockReturnValue({
      activeProfile: {
        id: 'senior',
        name: 'Senior Mode',
        colors: { primary: '', secondary: '', alert: '' },
        terminology: { event: 'Seizure', history: 'Log', actionPrompt: 'Help' },
        features: { seizureTypes: true, triggers: true, medications: true, audiogram: true },
      },
      setProfileId: mockSetProfileId,
      availableProfiles: [
        {
          id: 'standard',
          name: 'Standard',
          colors: { primary: '', secondary: '', alert: '' },
          terminology: { event: '', history: '', actionPrompt: '' },
          features: { seizureTypes: true, triggers: true, medications: true, audiogram: false },
        },
        {
          id: 'senior',
          name: 'Senior Mode',
          colors: { primary: '', secondary: '', alert: '' },
          terminology: { event: '', history: '', actionPrompt: '' },
          features: { seizureTypes: true, triggers: true, medications: true, audiogram: true },
        },
      ],
    });
    vi.mocked(useLocalStorage).mockReturnValue([
      { name: 'John Doe', bloodType: 'O+', medicalConditions: 'None' },
      mockSetPatientInfo,
    ]);
  });

  it('renders profile information correctly', () => {
    render(<PeopleTab />);
    expect(screen.getByText(/settingsPatientInfo/i)).toBeDefined();
    expect(screen.getByDisplayValue('John Doe')).toBeDefined();
    expect(screen.getByDisplayValue('O+')).toBeDefined();
    expect(screen.getByDisplayValue('None')).toBeDefined();
  });

  it('updates profile fields', () => {
    render(<PeopleTab />);
    const nameInput = screen.getByPlaceholderText(/settingsPatientNamePlaceholder/i);

    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    expect(mockSetPatientInfo).toHaveBeenCalled();
  });

  it('changes safety mode profile', () => {
    render(<PeopleTab />);
    const select = screen.getByLabelText(/settingsAppMode/i);

    fireEvent.change(select, { target: { value: 'standard' } });
    expect(mockSetProfileId).toHaveBeenCalledWith('standard');
  });

  it('renders contact settings section', () => {
    render(<PeopleTab />);
    expect(screen.getByTestId('setting-contacts')).toBeDefined();
  });
});
