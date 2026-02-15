import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GlobalErrorBoundary } from '../GlobalErrorBoundary';

// A component that throws an error to trigger the Error Boundary
const ProblemChild = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Everything is fine</div>;
};

describe('GlobalErrorBoundary', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    // Silence console.error as Error Boundaries intentionally log errors to the console
    vi.spyOn(console, 'error').mockImplementation(() => {});

    // Mock window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        reload: vi.fn(),
        href: 'http://localhost/',
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Restore window.location
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: originalLocation,
    });
    vi.unstubAllEnvs();
  });

  it('renders children when there is no error', () => {
    render(
      <GlobalErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </GlobalErrorBoundary>
    );

    expect(screen.getByText('Everything is fine')).toBeInTheDocument();
  });

  it('renders default fallback UI when an error occurs', () => {
    render(
      <GlobalErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </GlobalErrorBoundary>
    );

    expect(screen.getByText('System Hiccup Detected')).toBeInTheDocument();
    expect(screen.getByText(/Aura encountered an unexpected issue/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Restart Engine Now/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Back to Dashboard/i })).toBeInTheDocument();
  });

  it('renders custom fallback UI when fallback prop is provided', () => {
    const CustomFallback = <div>Custom Error UI</div>;

    render(
      <GlobalErrorBoundary fallback={CustomFallback}>
        <ProblemChild shouldThrow={true} />
      </GlobalErrorBoundary>
    );

    expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
    expect(screen.queryByText('System Hiccup Detected')).not.toBeInTheDocument();
  });

  it('reloads the page when "Restart Engine Now" is clicked', () => {
    render(
      <GlobalErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </GlobalErrorBoundary>
    );

    const reloadButton = screen.getByRole('button', { name: /Restart Engine Now/i });
    fireEvent.click(reloadButton);

    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  it('redirects to home when "Back to Dashboard" is clicked', () => {
    render(
      <GlobalErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </GlobalErrorBoundary>
    );

    const homeButton = screen.getByRole('button', { name: /Back to Dashboard/i });
    fireEvent.click(homeButton);

    expect(window.location.href).toBe('/');
  });

  it('shows technical details in development mode', () => {
    vi.stubEnv('NODE_ENV', 'development');

    render(
      <GlobalErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </GlobalErrorBoundary>
    );

    expect(screen.getByText('Technical Insight (Dev Only)')).toBeInTheDocument();
    expect(screen.getByText(/Test error/i)).toBeInTheDocument();
  });

  it('does not show technical details in production mode', () => {
    vi.stubEnv('NODE_ENV', 'production');

    render(
      <GlobalErrorBoundary>
        <ProblemChild shouldThrow={true} />
      </GlobalErrorBoundary>
    );

    expect(screen.queryByText('Technical Insight (Dev Only)')).not.toBeInTheDocument();
  });
});
