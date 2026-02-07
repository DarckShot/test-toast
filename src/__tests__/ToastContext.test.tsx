import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ToastProvider } from '@/context/ToastContext';
import { useToast } from '@/hooks/useToast';

const renderedToasts: Array<{ id: string; duration?: number; resetTimer?: number }> = [];

jest.mock('@/components/ToastItem', () => ({
    ToastItem: ({ toast }: { toast: { id: string; duration?: number; resetTimer?: number } }) => {
        renderedToasts.push({
            id: toast.id,
            duration: toast.duration,
            resetTimer: toast.resetTimer,
        });
        return <div data-testid={`toast-${toast.id}`} />;
    },
}));

const getLatestToastMap = () => {
    const map = new Map<string, { duration?: number; resetTimer?: number }>();
    renderedToasts.forEach((toast) => {
        map.set(toast.id, { duration: toast.duration, resetTimer: toast.resetTimer });
    });
    return map;
};

describe('ToastContext business logic', () => {
    beforeEach(() => {
        renderedToasts.length = 0;
        jest.spyOn(Date, 'now').mockImplementation(() => 1000);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    const wrapper = ({ children }: { children: ReactNode }) => (
        <ToastProvider>{children}</ToastProvider>
    );

    it('deduplicates by message/type and refreshes duration/resetTimer', () => {
        const { result } = renderHook(() => useToast(), { wrapper });

        act(() => {
            result.current.addToast({ message: 'Same', type: 'success', duration: 2000 });
        });

        const firstMap = getLatestToastMap();
        const [firstId] = Array.from(firstMap.keys());

        act(() => {
            (Date.now as jest.Mock).mockReturnValue(2000);
            result.current.addToast({ message: 'Same', type: 'success', duration: 3000 });
        });

        const latestMap = getLatestToastMap();
        expect(latestMap.size).toBe(1);

        const toast = latestMap.get(firstId!);
        expect(toast?.duration).toBe(3000);
        expect(toast?.resetTimer).toBe(2000);
    });

    it('resetToastTimer updates resetTimer for an existing toast', () => {
        const { result } = renderHook(() => useToast(), { wrapper });

        act(() => {
            result.current.addToast({ message: 'Reset', type: 'info', duration: 1500 });
        });

        const mapAfterAdd = getLatestToastMap();
        const [id] = Array.from(mapAfterAdd.keys());

        act(() => {
            (Date.now as jest.Mock).mockReturnValue(3000);
            result.current.resetToastTimer(id!);
        });

        const latestMap = getLatestToastMap();
        const toast = latestMap.get(id!);

        expect(toast?.resetTimer).toBe(3000);
    });
});
