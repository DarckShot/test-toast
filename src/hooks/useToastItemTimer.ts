import { useEffect, useRef, useState, useCallback } from 'react';

type UseToastItemTimerParams = {
    toastId: string;
    duration: number;
    resetTimer?: number;
    onRemove: (id: string) => void;
    enterMs?: number;
    exitMs?: number;
};

export const useToastItemTimer = ({
    toastId,
    duration,
    resetTimer,
    onRemove,
    enterMs = 400,
    exitMs = 300,
}: UseToastItemTimerParams) => {
    const [isExiting, setIsExiting] = useState(false);
    const [isEntering, setIsEntering] = useState(true);
    const timeoutRef = useRef<number | null>(null);
    const remainingTimeRef = useRef<number>(duration);
    const startTimeRef = useRef<number>(0);
    const isPausedRef = useRef(false);
    const onRemoveRef = useRef(onRemove);
    const toastIdRef = useRef(toastId);
    const durationRef = useRef(duration);

    useEffect(() => {
        onRemoveRef.current = onRemove;
    }, [onRemove]);

    useEffect(() => {
        toastIdRef.current = toastId;
    }, [toastId]);

    useEffect(() => {
        durationRef.current = duration;
    }, [duration]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsEntering(false);
        }, enterMs);

        return () => clearTimeout(timer);
    }, [enterMs]);

    const triggerExitAndRemove = useCallback(() => {
        setIsExiting(true);
        setTimeout(() => {
            onRemoveRef.current(toastIdRef.current);
        }, exitMs);
    }, [exitMs]);

    const startTimer = useCallback(() => {
        startTimeRef.current = Date.now();
        timeoutRef.current = window.setTimeout(() => {
            triggerExitAndRemove();
        }, remainingTimeRef.current);
    }, [triggerExitAndRemove]);

    const pauseTimer = useCallback(() => {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
            const elapsed = Date.now() - startTimeRef.current;
            remainingTimeRef.current = Math.max(0, remainingTimeRef.current - elapsed);

            if (remainingTimeRef.current <= 0) {
                triggerExitAndRemove();
            }
        }
    }, [triggerExitAndRemove]);

    useEffect(() => {
        remainingTimeRef.current = durationRef.current;
        startTimer();

        return () => {
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [toastId, startTimer]);

    useEffect(() => {
        if (!resetTimer) return;

        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }

        remainingTimeRef.current = durationRef.current;

        if (!isPausedRef.current) {
            startTimer();
        }
    }, [resetTimer, startTimer]);

    const handleMouseEnter = useCallback(() => {
        isPausedRef.current = true;
        pauseTimer();
    }, [pauseTimer]);

    const handleMouseLeave = useCallback(() => {
        isPausedRef.current = false;

        if (timeoutRef.current === null && remainingTimeRef.current > 0) {
            startTimer();
            return;
        }

        if (timeoutRef.current === null && remainingTimeRef.current <= 0) {
            triggerExitAndRemove();
        }
    }, [startTimer, triggerExitAndRemove]);

    return {
        isEntering,
        isExiting,
        handleMouseEnter,
        handleMouseLeave,
    };
};
