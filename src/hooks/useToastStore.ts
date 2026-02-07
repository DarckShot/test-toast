import { useCallback, useState } from 'react';
import type { Toast } from '../types/types';
import { createToastId, DEFAULT_TOAST_DURATION } from '../utils/toast';

type AddToast = (toast: Omit<Toast, 'id'>) => void;

type ToastStore = {
    toasts: Toast[];
    addToast: AddToast;
    removeToast: (id: string) => void;
    resetToastTimer: (id: string) => void;
};

export const useToastStore = (): ToastStore => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback<AddToast>((toast) => {
        setToasts((prevToasts) => {
            const existingToast = prevToasts.find(
                (t) => t.message === toast.message && t.type === toast.type,
            );

            if (existingToast) {
                return prevToasts.map((t) =>
                    t.id === existingToast.id
                        ? {
                              ...t,
                              duration: toast.duration ?? DEFAULT_TOAST_DURATION,
                              resetTimer: Date.now(),
                          }
                        : t,
                );
            }

            const newToast: Toast = {
                ...toast,
                id: createToastId(),
                duration: toast.duration ?? DEFAULT_TOAST_DURATION,
            };

            return [...prevToasts, newToast];
        });
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
    }, []);

    const resetToastTimer = useCallback((id: string) => {
        setToasts((prevToasts) =>
            prevToasts.map((t) => (t.id === id ? { ...t, resetTimer: Date.now() } : t)),
        );
    }, []);

    return { toasts, addToast, removeToast, resetToastTimer };
};
