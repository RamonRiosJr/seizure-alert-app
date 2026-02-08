import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
    beforeEach(() => {
        // Clear local storage before each test
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('should return initial value if no value exists in storage', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
        expect(result.current[0]).toBe('initial');
    });

    it('should return stored value if it exists', () => {
        window.localStorage.setItem('test-key', JSON.stringify('stored'));
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
        expect(result.current[0]).toBe('stored');
    });

    it('should update local storage when state changes', () => {
        const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));

        act(() => {
            result.current[1]('updated');
        });

        expect(result.current[0]).toBe('updated');
        expect(window.localStorage.getItem('test-key')).toBe(JSON.stringify('updated'));
    });

    it('should handle functional updates', () => {
        const { result } = renderHook(() => useLocalStorage('count', 1));

        act(() => {
            result.current[1]((prev) => prev + 1);
        });

        expect(result.current[0]).toBe(2);
        expect(window.localStorage.getItem('count')).toBe(JSON.stringify(2));
    });

    it('should handle complex objects', () => {
        const initial = { foo: 'bar' };
        const { result } = renderHook(() => useLocalStorage('complex', initial));

        expect(result.current[0]).toEqual(initial);

        const updated = { foo: 'baz' };
        act(() => {
            result.current[1](updated);
        });

        expect(result.current[0]).toEqual(updated);
        expect(JSON.parse(window.localStorage.getItem('complex')!)).toEqual(updated);
    });

    it('should handle JSON parse errors gracefully', () => {
        // Set invalid JSON
        window.localStorage.setItem('broken', 'not-valid-json');

        // Mock console.error to avoid noise
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

        const { result } = renderHook(() => useLocalStorage('broken', 'fallback'));

        expect(result.current[0]).toBe('fallback');
        // It catches the error and returns initialValue

        consoleSpy.mockRestore();
    });
});
