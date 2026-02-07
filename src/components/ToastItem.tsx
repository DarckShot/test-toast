import type { Toast } from '../types/types';
import { ToastItemView } from './ToastItemView';
import { useToastItemTimer } from '../hooks/useToastItemTimer';
import { DEFAULT_TOAST_DURATION } from '../utils/toast';

interface ToastItemProps {
    toast: Toast;
    onRemove: (id: string) => void;
}

export const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
    const { isEntering, isExiting, handleMouseEnter, handleMouseLeave } = useToastItemTimer({
        toastId: toast.id,
        duration: toast.duration ?? DEFAULT_TOAST_DURATION,
        resetTimer: toast.resetTimer,
        onRemove,
    });

    return (
        <ToastItemView
            message={toast.message}
            type={toast.type}
            isEntering={isEntering}
            isExiting={isExiting}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClose={() => onRemove(toast.id)}
        />
    );
};
