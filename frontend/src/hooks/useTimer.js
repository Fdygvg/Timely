import { useState, useEffect, useRef, useCallback } from 'react';
import { vibrate } from '../utils/helpers';

const useTimer = (initialDuration = 60, options = {}) => {
  const {
    autoStart = false,
    onComplete = () => {},
    onTick = () => {},
    vibrations = 1,
    sound = 'ding',
    muted = false
  } = options;

  const [timeLeft, setTimeLeft] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [totalDuration, setTotalDuration] = useState(initialDuration);
  const [isComplete, setIsComplete] = useState(false);
  
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const audioRef = useRef(null);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio(`/sounds/${sound}.mp3`);
    audioRef.current.volume = muted ? 0 : 0.5;
    audioRef.current.preload = 'auto';

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [sound, muted]);

  // Timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      startTimeRef.current = Date.now() - (totalDuration - timeLeft) * 1000;
      
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          onTick(newTime);
          
          if (newTime <= 0) {
            handleTimerEnd();
            return 0;
          }
          return newTime;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, timeLeft]);

  const handleTimerEnd = useCallback(() => {
    setIsRunning(false);
    setIsComplete(true);
    
    // Trigger vibrations
    if (vibrations > 0 && navigator.vibrate) {
      const pattern = [100, 50, 100].slice(0, vibrations).flat();
      vibrate(pattern);
    }
    
    // Play sound
    if (!muted && audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      } catch (err) {
        console.error('Sound error:', err);
      }
    }
    
    onComplete();
  }, [vibrations, muted, onComplete]);

  const start = useCallback(() => {
    if (isComplete) {
      reset();
    }
    setIsRunning(true);
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }
  }, [isComplete]);

  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);

  const toggle = useCallback(() => {
    if (isRunning) {
      pause();
    } else {
      start();
    }
  }, [isRunning, start, pause]);

  const reset = useCallback((newDuration = initialDuration) => {
    setIsRunning(false);
    setTimeLeft(newDuration);
    setTotalDuration(newDuration);
    setIsComplete(false);
    startTimeRef.current = null;
    clearInterval(timerRef.current);
  }, [initialDuration]);

  const adjustTime = useCallback((seconds) => {
    setTimeLeft(prev => {
      const newTime = Math.max(1, prev + seconds);
      return newTime;
    });
    setTotalDuration(prev => prev + seconds);
  }, []);

  const setDuration = useCallback((newDuration) => {
    const isValid = typeof newDuration === 'number' && newDuration > 0;
    if (!isValid) return;
    
    setTimeLeft(newDuration);
    setTotalDuration(newDuration);
    if (isRunning) {
      startTimeRef.current = Date.now() - (newDuration - timeLeft) * 1000;
    }
  }, [isRunning, timeLeft]);

  const skip = useCallback(() => {
    if (timeLeft > 0) {
      handleTimerEnd();
    }
  }, [timeLeft, handleTimerEnd]);

  const getElapsedTime = useCallback(() => {
    if (!startTimeRef.current) return 0;
    return Math.floor((Date.now() - startTimeRef.current) / 1000);
  }, []);

  const getProgress = useCallback(() => {
    if (totalDuration === 0) return 0;
    return ((totalDuration - timeLeft) / totalDuration) * 100;
  }, [totalDuration, timeLeft]);

  const testVibration = useCallback(() => {
    if (vibrations > 0 && navigator.vibrate) {
      const pattern = [100, 50, 100].slice(0, vibrations).flat();
      vibrate(pattern);
    }
  }, [vibrations]);

  const testSound = useCallback(() => {
    if (!muted && audioRef.current) {
      try {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.log('Audio play failed:', e));
      } catch (err) {
        console.error('Sound error:', err);
      }
    }
  }, [muted]);

  return {
    // State
    timeLeft,
    isRunning,
    totalDuration,
    isComplete,
    
    // Controls
    start,
    pause,
    toggle,
    reset,
    adjustTime,
    setDuration,
    skip,
    
    // Info
    getElapsedTime,
    getProgress,
    
    // Testing
    testVibration,
    testSound,
    
    // Configuration
    setVibrations: (count) => options.vibrations = count,
    setSound: (newSound) => {
      if (audioRef.current) {
        audioRef.current.src = `/sounds/${newSound}.mp3`;
        options.sound = newSound;
      }
    },
    setMuted: (mute) => {
      if (audioRef.current) {
        audioRef.current.volume = mute ? 0 : 0.5;
        options.muted = mute;
      }
    }
  };
};

export default useTimer;