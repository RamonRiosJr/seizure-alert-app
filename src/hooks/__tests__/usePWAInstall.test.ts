import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { usePWAInstall } from '../usePWAInstall';

describe('usePWAInstall', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');

    // Reset matchMedia mock to default (not standalone)
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Reset navigator properties
    Object.defineProperty(window.navigator, 'standalone', {
      value: undefined,
      configurable: true,
    });

    // Reset userAgent
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      configurable: true,
    });

    // Clear session storage
    sessionStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with default states', () => {
    const { result } = renderHook(() => usePWAInstall());
    expect(result.current.isInstallable).toBe(false);
    expect(result.current.isAppInstalled).toBe(false);
    expect(result.current.isIOS).toBe(false);
  });

  it('should detect iOS platform', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X)',
      configurable: true,
    });

    const { result } = renderHook(() => usePWAInstall());
    expect(result.current.isIOS).toBe(true);
    // On iOS, showPrompt should be true if not installed
    expect(result.current.showPrompt).toBe(true);
  });

  it('should detect standalone mode (app installed)', () => {
    // Mock matchMedia to return true for standalone
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: query === '(display-mode: standalone)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    const { result } = renderHook(() => usePWAInstall());
    expect(result.current.isAppInstalled).toBe(true);
    expect(result.current.showPrompt).toBe(false);
  });

  it('should capture beforeinstallprompt event', () => {
    const { result } = renderHook(() => usePWAInstall());

    const preventDefault = vi.fn();
    const event = new Event('beforeinstallprompt');
    Object.assign(event, {
      preventDefault,
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    });

    act(() => {
      window.dispatchEvent(event);
    });

    expect(addEventListenerSpy).toHaveBeenCalledWith('beforeinstallprompt', expect.any(Function));
    expect(preventDefault).toHaveBeenCalled();
    expect(result.current.isInstallable).toBe(true);
    // Should show prompt when event fires
    expect(result.current.showPrompt).toBe(true);
  });

  it('should detect appinstalled event', () => {
    const { result } = renderHook(() => usePWAInstall());

    // First make it installable
    const event = new Event('beforeinstallprompt');
    Object.assign(event, { preventDefault: vi.fn() });
    act(() => {
      window.dispatchEvent(event);
    });
    expect(result.current.isInstallable).toBe(true);

    // Then simulate install
    act(() => {
      window.dispatchEvent(new Event('appinstalled'));
    });

    expect(result.current.isAppInstalled).toBe(true);
    expect(result.current.isInstallable).toBe(false);
    expect(result.current.showPrompt).toBe(false);
  });
});
