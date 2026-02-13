import { render, screen } from '@testing-library/react';
import { AIHubTab } from '../AIHubTab';
import { vi, describe, it, expect } from 'vitest';

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

// Mock icons
vi.mock('lucide-react', () => ({
  Brain: () => <div data-testid="icon-brain" />,
  Mic: () => <div data-testid="icon-mic" />,
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string, def?: string) => def || key }),
}));

describe('AIHubTab', () => {
  it('renders AI info and beta warnings', () => {
    render(<AIHubTab />);
    expect(screen.getByRole('heading', { name: /Aura Intelligence/i })).toBeDefined();
    expect(
      screen.getByText((content) => content.includes('Requires a Gemini API Key'))
    ).toBeDefined();
    expect(screen.getByTestId('ui-button')).toBeDefined();
  });

  it('renders coming soon features as disabled', () => {
    render(<AIHubTab />);
    expect(screen.getByText(/Voice Activation/i)).toBeDefined();
    const voiceSwitch = screen.getByTestId('ui-switch');
    expect(voiceSwitch).toBeDisabled();
  });
});
