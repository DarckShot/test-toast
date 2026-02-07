import type { ReactNode } from 'react';
import type { ToastType } from '../types/types';
import styles from './ToastItem.module.scss';

type ToastItemViewProps = {
    message: ReactNode;
    type: ToastType;
    isEntering: boolean;
    isExiting: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClose: () => void;
};

export const ToastItemView = ({
    message,
    type,
    isEntering,
    isExiting,
    onMouseEnter,
    onMouseLeave,
    onClose,
}: ToastItemViewProps) => {
    return (
        <div
            className={`${styles.toast} ${styles[`toast-${type}`]} ${
                isEntering ? styles['toast-entering'] : ''
            } ${isExiting ? styles['toast-exiting'] : ''}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}>
            <span>{message}</span>
            <button onClick={onClose}>×</button>
        </div>
    );
};
