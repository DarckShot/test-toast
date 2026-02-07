import type { Toast } from '../types/types';
import { ToastItem } from './ToastItem';

type ToastListProps = {
    toasts: Toast[];
    onRemove: (id: string) => void;
};

export const ToastList = ({ toasts, onRemove }: ToastListProps) => {
    if (toasts.length === 0) return null;

    return (
        <div className="toast-list">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
};
