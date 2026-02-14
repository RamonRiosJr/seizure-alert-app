import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import DisclaimerModal from '../DisclaimerModal';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

// Mock lucide-react icons - including those mentioned in the issue description
vi.mock('lucide-react', () => ({
  X: () => <div data-testid="icon-x" />,
  AlertTriangle: () => <div data-testid="icon-alert-triangle" />,
  Check: () => <div data-testid="icon-check" />,
  Shield: () => <div data-testid="icon-shield" />,
}));

describe('DisclaimerModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when isOpen is true', () => {
    render(<DisclaimerModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('disclaimerTitle')).toBeInTheDocument();
    expect(screen.getByText('disclaimerImportant')).toBeInTheDocument();
    expect(screen.getByText('disclaimerButton')).toBeInTheDocument();
    expect(screen.getByTestId('icon-alert-triangle')).toBeInTheDocument();
    expect(screen.getByTestId('icon-x')).toBeInTheDocument();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<DisclaimerModal isOpen={false} onClose={mockOnClose} />);
    expect(container.firstChild).toBeNull();
  });

  it('calls onClose when the close button is clicked', () => {
    render(<DisclaimerModal isOpen={true} onClose={mockOnClose} />);

    const closeButton = screen.getByLabelText('Close');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the footer button is clicked', () => {
    render(<DisclaimerModal isOpen={true} onClose={mockOnClose} />);

    const footerButton = screen.getByText('disclaimerButton');
    fireEvent.click(footerButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the backdrop is clicked', () => {
    render(<DisclaimerModal isOpen={true} onClose={mockOnClose} />);

    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when the modal content is clicked', () => {
    render(<DisclaimerModal isOpen={true} onClose={mockOnClose} />);

    const modalContent = screen.getByRole('dialog');
    fireEvent.click(modalContent);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when the Escape key is pressed', () => {
    render(<DisclaimerModal isOpen={true} onClose={mockOnClose} />);

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
