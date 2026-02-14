import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ApiKeyWizard } from '../ApiKeyWizard';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Define mocks hoisted variable
const generateContentMock = vi.fn();
const getGenerativeModelMock = vi.fn(() => ({
  generateContent: generateContentMock,
}));

// Mock the module using a class
vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel = getGenerativeModelMock;
    },
  };
});

describe('ApiKeyWizard', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    // Default success
    generateContentMock.mockResolvedValue({});
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <ApiKeyWizard isOpen={false} onClose={mockOnClose} onSuccess={mockOnSuccess} />
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders step 1 when open', () => {
    render(<ApiKeyWizard isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);
    expect(screen.getByText('Connect Aura AI')).toBeInTheDocument();
    expect(screen.getByText('1. Get your Key')).toBeInTheDocument();
  });

  it('navigates to step 2 and handles valid key input', async () => {
    render(<ApiKeyWizard isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    // Go to step 2
    fireEvent.click(screen.getByText(/I have the Key/i));

    // Check we are on step 2
    expect(screen.getByText('Paste Key Here')).toBeInTheDocument();

    // Enter key
    const input = screen.getByLabelText('Paste Key Here');
    fireEvent.change(input, { target: { value: 'AIzaTestKey123' } });

    // Click verify
    const connectButton = screen.getByText('Connect & Save');
    fireEvent.click(connectButton);

    // Expect loading state
    expect(screen.getByText('Verifying...')).toBeInTheDocument();

    // Wait for success
    await waitFor(() => {
      expect(generateContentMock).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });

    // Check sessionStorage (moved for security)
    expect(sessionStorage.getItem('gemini_api_key')).toBe(JSON.stringify('AIzaTestKey123'));
    expect(localStorage.getItem('gemini_api_key')).toBeNull();
  });

  it('handles invalid key input', async () => {
    // Override mock to reject
    generateContentMock.mockRejectedValue(new Error('Invalid API Key'));

    render(<ApiKeyWizard isOpen={true} onClose={mockOnClose} onSuccess={mockOnSuccess} />);

    // Go to step 2
    fireEvent.click(screen.getByText(/I have the Key/i));

    // Enter key
    const input = screen.getByLabelText('Paste Key Here');
    fireEvent.change(input, { target: { value: 'InvalidKey' } });

    // Click verify
    const connectButton = screen.getByText('Connect & Save');
    fireEvent.click(connectButton);

    // Wait for error
    await waitFor(() => {
      expect(screen.getByText('Invalid API Key. Please check and try again.')).toBeInTheDocument();
    });

    // Ensure success was NOT called
    expect(mockOnSuccess).not.toHaveBeenCalled();
    expect(sessionStorage.getItem('gemini_api_key')).toBeNull();
    expect(localStorage.getItem('gemini_api_key')).toBeNull();
  });
});
