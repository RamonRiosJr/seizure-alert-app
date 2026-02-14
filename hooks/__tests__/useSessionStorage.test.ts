import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSessionStorage } from '../useSessionStorage';

describe('useSessionStorage', () => {
  beforeEach(() => {
    // Clear session storage before each test
    window.sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('should return initial value if no value exists in storage', () => {
    const { result } = renderHook(() => useSessionStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('initial');
  });

  it('should return stored value if it exists', () => {
    window.sessionStorage.setItem('test-key', JSON.stringify('stored'));
    const { result } = renderHook(() => useSessionStorage('test-key', 'initial'));
    expect(result.current[0]).toBe('stored');
  });

  it('should update session storage when state changes', () => {
    const { result } = renderHook(() => useSessionStorage('test-key', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');
    expect(window.sessionStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
  });

  it('should handle functional updates', () => {
    const { result } = renderHook(() => useSessionStorage('count', 1));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(2);
    expect(window.sessionStorage.getItem('count')).toBe(JSON.stringify(2));
  });

  it('should handle complex objects', () => {
    const initial = { foo: 'bar' };
    const { result } = renderHook(() => useSessionStorage('complex', initial));

    expect(result.current[0]).toEqual(initial);

    const updated = { foo: 'baz' };
    act(() => {
      result.current[1](updated);
    });

    expect(result.current[0]).toEqual(updated);
    expect(JSON.parse(window.sessionStorage.getItem('complex')!)).toEqual(updated);
  });

  it('should handle JSON parse errors gracefully', () => {
    // Set invalid JSON
    window.sessionStorage.setItem('broken', 'not-valid-json');

    // Mock console.error to avoid noise
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useSessionStorage('broken', 'fallback'));

    expect(result.current[0]).toBe('fallback');
    // It catches the error and returns initialValue

    consoleSpy.mockRestore();
  });
});
