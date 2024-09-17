import { useRef } from 'react';
import * as Haptics from 'expo-haptics';

type Props = {
  velocityTreshold: number;
};

const useVibrate = ({ velocityTreshold }: Props) => {
  // Refs
  const lastScrollOffset = useRef(0);
  const lastScrollTime = useRef(0);

  // Methods
  function vibrate(event: any) {
    const currentScrollOffset = event.contentOffset.y;
    const currentTime = Date.now();
    const timeDiff = currentTime - lastScrollTime.current;
    const offsetDiff = currentScrollOffset - lastScrollOffset.current;
    const velocity = offsetDiff / timeDiff;
    lastScrollOffset.current = currentScrollOffset;
    lastScrollTime.current = currentTime;
    if (Math.abs(velocity) > velocityTreshold) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  return vibrate;
};

export default useVibrate;
