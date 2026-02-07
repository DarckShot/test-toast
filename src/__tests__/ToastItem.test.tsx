import { act, fireEvent, render } from '@testing-library/react';
import { ToastItem } from '@/components/ToastItem';
import type { Toast } from '@/types/types';

describe('ToastItem timer behavior', () => {
    let now = 0;

    const advance = (ms: number) => {
        now += ms;
        jest.advanceTimersByTime(ms);
    };

    beforeEach(() => {
        jest.useFakeTimers();
        now = 0;
        jest.spyOn(Date, 'now').mockImplementation(() => now);
    });

    afterEach(() => {
        jest.useRealTimers();
        jest.restoreAllMocks();
    });

    it('pauses the timer on mouseEnter and does not auto-remove while paused', () => {
        const onRemove = jest.fn();
        const toast: Toast = {
            id: 't1',
            type: 'success',
            message: 'Saved',
            duration: 1000,
        };

        const { getByText } = render(<ToastItem toast={toast} onRemove={onRemove} />);
        const item = getByText('Saved').closest('div');

        expect(item).not.toBeNull();

        act(() => {
            advance(600);
        });

        act(() => {
            fireEvent.mouseEnter(item!);
        });

        act(() => {
            advance(2000);
        });

        expect(onRemove).not.toHaveBeenCalled();
    });

    it('resumes the timer on mouseLeave and removes after remaining time', () => {
        const onRemove = jest.fn();
        const toast: Toast = {
            id: 't2',
            type: 'info',
            message: 'Processing',
            duration: 1000,
        };

        const { getByText } = render(<ToastItem toast={toast} onRemove={onRemove} />);
        const item = getByText('Processing').closest('div');

        expect(item).not.toBeNull();

        act(() => {
            advance(600);
        });

        act(() => {
            fireEvent.mouseEnter(item!);
        });

        act(() => {
            advance(2000);
        });

        expect(onRemove).not.toHaveBeenCalled();

        act(() => {
            fireEvent.mouseLeave(item!);
        });

        act(() => {
            advance(399);
        });

        expect(onRemove).not.toHaveBeenCalled();

        act(() => {
            advance(1);
        });

        act(() => {
            advance(300);
        });

        expect(onRemove).toHaveBeenCalledWith('t2');
    });
});
