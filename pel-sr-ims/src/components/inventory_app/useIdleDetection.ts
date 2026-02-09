import { useEffect, useRef, useState } from 'react';

interface UseIdleDetectionProps {
  onIdle: () => void;
  idleTime?: number; // milliseconds before considered idle (default: 2.5 minutes)
  warningTime?: number; // milliseconds to show warning before auto-logout (default: 30 seconds)
  enabled?: boolean;
}

interface UseIdleDetectionReturn {
  isIdle: boolean;
  isWarning: boolean;
  resetTimer: () => void;
  remainingSeconds: number;
}

/**
 * Hook to detect user inactivity and trigger warnings/callbacks
 * Tracks meaningful interactions: clicks, key presses, form changes, scrolls
 */
export function useIdleDetection({
  onIdle,
  idleTime = 150000, // 2.5 minutes
  warningTime = 30000, // 30 seconds
  enabled = true,
}: UseIdleDetectionProps): UseIdleDetectionReturn {
  const [isIdle, setIsIdle] = useState(false);
  const [isWarning, setIsWarning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(30);
  
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimers = () => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const startCountdown = () => {
    setRemainingSeconds(Math.floor(warningTime / 1000));
    
    countdownIntervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetTimer = () => {
    clearTimers();
    setIsWarning(false);
    setIsIdle(false);

    if (!enabled) return;

    // Start idle timer
    idleTimerRef.current = setTimeout(() => {
      setIsWarning(true);
      startCountdown();
      
      // Start warning timer
      warningTimerRef.current = setTimeout(() => {
        setIsIdle(true);
        setIsWarning(false);
        onIdle();
      }, warningTime);
    }, idleTime);
  };

  useEffect(() => {
    if (!enabled) {
      clearTimers();
      return;
    }

    // Events that indicate user activity
    const events = [
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'input',
      'change',
    ];

    const handleActivity = () => {
      if (!isWarning) {
        resetTimer();
      }
    };

    // Attach event listeners
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    // Start initial timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      clearTimers();
    };
  }, [enabled, isWarning]);

  // Handle visibility change (iPad lock/screen sleep)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // User locked iPad or switched apps - trigger immediate logout
        clearTimers();
        setIsIdle(true);
        setIsWarning(false);
        onIdle();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [onIdle]);

  return {
    isIdle,
    isWarning,
    resetTimer,
    remainingSeconds,
  };
}