import { render, screen } from '@testing-library/react';
import { AIHubTab } from '../AIHubTab';
import { vi, describe, it, expect } from 'vitest';
import React from 'react';

// Mock UI components
vi.mock('../../ui/Card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="ui-card">{children}</div>
  ),
}));

vi.mock('../../ui/Badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="ui-badge">{children}</div>
  ),
}));

vi.mock('../../ui/Button', () => ({
  Button: ({ children }: { children: React.ReactNode }) => (
    <button data-testid="ui-button">{children}</button>
  ),
}));

vi.mock('../../ui/Switch', () => ({
  Switch: ({ checked, disabled }: { checked: boolean; disabled?: boolean }) => (
    <input type="checkbox" data-testid="ui-switch" checked={checked} disabled={disabled} readOnly />
  ),
}));

// Mock ApiKeyWizard
vi.mock('../ApiKeyWizard', () => ({
  ApiKeyWizard: () => <div data-testid="api-key-wizard" />,
}));

// Mock icons
vi.mock('lucide-react', () => ({
  Brain: () => <div data-testid="icon-brain" />,
  Mic: () => <div data-testid="icon-mic" />,
  Sparkles: () => <div data-testid="icon-sparkles" />,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, def?: string) => def || key }),
}));

vi.mock('../../../contexts/SettingsContext', () => ({
  useSettings: vi.fn(() => {
    const mockSettings: SettingsContextType = {
      voiceActivationEnabled: false,
      setVoiceActivationEnabled: vi.fn(),
      picovoiceAccessKey: '',
      setPicovoiceAccessKey: vi.fn(),
      lowPowerMode: false,
      setLowPowerMode: vi.fn(),
      preventSleep: false,
      setPreventSleep: vi.fn(),
      activeTab: 'ai',
      setActiveTab: vi.fn(),
      geminiApiKey: '',
      setGeminiApiKey: vi.fn(),
    };
    return mockSettings;
  }),
}));

import { SettingsContextType } from '../../../contexts/SettingsContext';

describe('AIHubTab', () => {
  it('renders Gemini AI connection and Voice Activation info', () => {
    render(<AIHubTab />);
    // Check for Gemini card
    expect(screen.getByRole('heading', { name: /Gemini AI Connection/i })).toBeDefined();
    // Check for Picovoice card
    expect(screen.getByRole('heading', { name: /Voice Activation/i })).toBeDefined();
    expect(screen.getByLabelText(/Picovoice Access Key/i)).toBeDefined();
  });

  it('renders voice activation features as disabled when no key', () => {
    render(<AIHubTab />);
    expect(screen.getByText(/Hands-Free Trigger/i)).toBeDefined();
    // Use getAllByTestId because there might be multiple switches if Gemini added one (it didn't, but just in case)
    // Actually Switch is mocked with data-testid="ui-switch"
    const voiceSwitch = screen.getByTestId('ui-switch');
    expect(voiceSwitch).toBeDisabled();
  });
});
