import { useCompleteDailyGoal } from '@/api/time-tracking/use-complete-daily-goal';
import { Level } from '@/types';
import { useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAuth } from '../auth';
import { getItem, removeItem, setItem } from '../storage';

export const useTimeSpentTracker = () => {
  // Hooks
  const { account, updateAccount } = useAuth();
  const { mutate: completeDailyGoal, isLoading: loading } =
    useCompleteDailyGoal();

  // Check if minutesPerDay is null
  if (account && account.minutesPerDay === null) {
    return {
      timeSpentToday: 0,
      timeSpentTodayMinutes: 0,
      targetReached: false,
      resetTimeSpent: () => {},
    };
  }

  // Constsants
  const accountID = account?.$id || '';

  // Refs
  const intervalId = useRef<NodeJS.Timeout | null>(null); // Use a ref for the interval ID
  const targetReached = useRef(getItem(`targetReached_${accountID}`)); // Use a ref for targetReached

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

    // Start the timer if the app is active when the component mounts
    if (AppState.currentState === 'active') {
      startSessionTimer();
    }

    return () => {
      subscription.remove();
      stopSessionTimer(); // Ensure timer is cleared on unmount
    };
  }, []);

  const loadTimeSpent = () => {
    const today = new Date().toDateString();
    const storedDate = getItem<string>(`lastDate_${accountID}`);
    const storedTime = getItem<number>(`timeSpentToday_${accountID}`) || 0;

    if (storedDate === today) {
      setTimeSpentToday(storedTime);
    } else {
      setItem(`lastDate_${accountID}`, today);
      setItem(`timeSpentToday_${accountID}`, 0);
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
    if (getItem(`targetReached_${accountID}`)) {
      return; // Don't start the timer if the target has been reached
    }

    console.log('[TIME SPENT TRACKER]: Starting session timer');
    if (!intervalId.current) {
      intervalId.current = setInterval(() => {
        setTimeSpentToday((prev) => {
          const newTimeSpent = prev + 1; // Increment by 1 second
          if (newTimeSpent >= targetTime && !targetReached.current) {
            onTargetReached();
          }
          setItem(`timeSpentToday_${accountID}`, newTimeSpent); // Update stored time
          return newTimeSpent;
        });
      }, 1000); // Update every second
    }
  };

  const onTargetReached = () => {
    console.log('[TIME SPENT TRACKER]: Target reached');
    targetReached.current = true; // Update the ref
    setItem(`targetReached_${accountID}`, true);
    stopSessionTimer();
    if (account && account.dailyGoals.length > 0) {
      let dailyGoals = [...account.dailyGoals];
      let today = new Date().toLocaleDateString();
      // Push the current date to the daily goals in DD.MM.YYYY format
      dailyGoals.push(today);
      completeDailyGoal(
        { accountId: accountID, dailyGoals },
        {
          onSuccess(data, variables, context) {
            updateAccount({ dailyGoals });
          },
          onError(error, variables, context) {
            console.log(
              '[TIME SPENT TRACKER]: Finish exercise error => ',
              error
            );
          },
        }
      );
    }
  };

  const stopSessionTimer = () => {
    console.log('[TIME SPENT TRACKER]: Stopping session timer');
    if (intervalId.current) {
      clearInterval(intervalId.current);
      intervalId.current = null; // Clear the ref
    }
  };

  const resetTimeSpent = () => {
    setItem(`timeSpentToday_${accountID}`, 0);
    setTimeSpentToday(0);
    targetReached.current = false; // Reset the ref
    removeItem(`lastDate_${accountID}`);
    removeItem(`timeSpentToday_${accountID}`);
    removeItem(`targetReached_${accountID}`);
  };

  return {
    timeSpentToday, // Return in seconds
    timeSpentTodayMinutes: Math.floor(timeSpentToday / 60), // Return in minutes
    targetReached: targetReached.current, // Return target reached state
    loading,
    resetTimeSpent,
    onTargetReached,
  };
};
