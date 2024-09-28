import { Level } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAuth } from '../auth';
import { getItem, removeItem, setItem } from '../storage';

export const useTimeSpentTracker = () => {
  // Hooks
  const { account, updateAccount } = useAuth();

  // Check if minutesPerDay is null
  if (account && account.minutesPerDay === null) {
    return {
      timeSpentToday: 0,
      timeSpentTodayMinutes: 0,
      targetReached: false,
      resetTimeSpent: () => {},
    };
  }

  // Refs
  const intervalId = useRef<NodeJS.Timeout | null>(null); // Use a ref for the interval ID
  const targetReached = useRef(getItem('targetReached')); // Use a ref for targetReached

  // State
  const [timeSpentToday, setTimeSpentToday] = useState(0);

  // Functions
  const getTargetTime = (level: Level | null | undefined) => {
    if (level === null || level === undefined) {
      return 10 * 60; // 10 minutes default
    }
    switch (level) {
      case Level.L1:
        return 5 * 60; // 5 minutes
      case Level.L2:
        return 10 * 60; // 10 minutes
      case Level.L3:
        return 15 * 60; // 15 minutes
      default:
        return 10 * 60; // 10 minutes default
    }
  };

  const targetTime = getTargetTime(account?.minutesPerDay);

  useEffect(() => {
    loadTimeSpent();

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );

    return () => {
      subscription.remove();
      stopSessionTimer(); // Ensure timer is cleared on unmount
    };
  }, []);

  const loadTimeSpent = () => {
    const today = new Date().toDateString();
    const storedDate = getItem<string>('lastDate');
    const storedTime = getItem<number>('timeSpentToday') || 0;

    if (storedDate === today) {
      setTimeSpentToday(storedTime);
    } else {
      setItem('lastDate', today);
      setItem('timeSpentToday', 0);
      setTimeSpentToday(0);
    }
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      startSessionTimer();
    } else if (nextAppState.match(/inactive|background/)) {
      stopSessionTimer();
    }
  };

  const startSessionTimer = () => {
    if (getItem('targetReached')) {
      return; // Don't start the timer if the target has been reached
    }

    console.log('Starting session timer');
    if (!intervalId.current) {
      intervalId.current = setInterval(() => {
        setTimeSpentToday((prev) => {
          const newTimeSpent = prev + 1; // Increment by 1 second
          if (newTimeSpent >= targetTime && !targetReached.current) {
            onTargetReached();
          }
          setItem('timeSpentToday', newTimeSpent); // Update stored time
          return newTimeSpent;
        });
      }, 1000); // Update every second
    }
  };

  const onTargetReached = () => {
    console.log('Target reached');
    targetReached.current = true; // Update the ref
    setItem('targetReached', true);
    stopSessionTimer();
    if (account && account.dailyGoals.length > 0) {
      let dailyGoals = [...account.dailyGoals];
      let today = new Date().toLocaleDateString();
      // Push the current date to the daily goals in DD.MM.YYYY format
      dailyGoals.push(today);
      updateAccount({ dailyGoals });
    }
  };

  const stopSessionTimer = () => {
    console.log('Stopping session timer');
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null; // Clear the ref
    }
  };

  const resetTimeSpent = () => {
    setItem('timeSpentToday', 0);
    setTimeSpentToday(0);
    targetReached.current = false; // Reset the ref
    removeItem('lastDate');
    removeItem('timeSpentToday');
    removeItem('targetReached');
  };

  return {
    timeSpentToday, // Return in seconds
    timeSpentTodayMinutes: Math.floor(timeSpentToday / 60), // Return in minutes
    targetReached: targetReached.current, // Return target reached state
    resetTimeSpent,
    onTargetReached,
  };
};
