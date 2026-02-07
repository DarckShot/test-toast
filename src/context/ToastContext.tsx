import React, { type ReactNode } from 'react';
import { ToastList } from '../components/ToastList';
import { useToastStore } from '../hooks/useToastStore';
import { ToastContext } from './ToastContextValue';

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { toasts, addToast, removeToast, resetToastTimer } = useToastStore();

    return (
        <ToastContext.Provider value={{ addToast, removeToast, resetToastTimer }}>
            {children}
            <ToastList toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
};
