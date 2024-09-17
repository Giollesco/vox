import React from 'react';
import type { TextProps, TextStyle } from 'react-native';
import { I18nManager, Text as NNText, StyleSheet } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { FontWeight } from '@/types';

interface Props extends TextProps {
  className?: string;
  weight?: FontWeight;
}

export const Text = ({
  className = '',
  style,
  children,
  weight = 'regular',
  ...props
}: Props) => {
  const textStyle = React.useMemo(
    () =>
      twMerge(
        'text-base text-black  dark:text-white  font-jakarta font-normal',
        className
      ),
    [className]
  );

  const nStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        {
          writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
          fontFamily: weight,
        },
        style,
      ]) as TextStyle,
    [style, weight]
  );
  return (
    <NNText className={textStyle} style={nStyle} {...props}>
      {children}
    </NNText>
  );
};
