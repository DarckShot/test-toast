import type { Toast } from '../types/types';

export const DEFAULT_TOAST_DURATION = 3000;

type ToastId = Toast['id'];

export const createToastId = (): ToastId =>
    `toast-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
