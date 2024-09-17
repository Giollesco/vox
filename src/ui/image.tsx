// import { View as EImage } from 'react-native'; // Temporarily use View for testing
import type { ImageProps } from 'expo-image';
import { Image as EImage } from 'expo-image';
import { cssInterop } from 'nativewind';
import * as React from 'react';

export type ImgProps = ImageProps & {
  className?: string;
  sharedTransitionTag?: string;
};

const NImage = EImage; // Use View instead of Animated component for now
cssInterop(NImage, { className: 'style' });

export const Image = ({
  style,
  className,
  sharedTransitionTag = '',
  placeholder = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
  ...props
}: ImgProps) => {
  return (
    <NImage
      // sharedTransitionTag={sharedTransitionTag}
      className={className}
      placeholder={placeholder}
      style={style}
      {...props}
    />
  );
};
