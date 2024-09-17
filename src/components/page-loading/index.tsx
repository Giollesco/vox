import * as React from 'react';
import { useWindowDimensions } from 'react-native';

import { ActivityIndicator, colors, Text, View } from '@/ui';

type Props = { loading: boolean; backgroundColor?: string };

export const PageLoading = ({
  loading,
  backgroundColor,
  children,
}: React.PropsWithChildren<Props>) => {
  // Hooks
  const { width, height } = useWindowDimensions();

  // State
  const background = backgroundColor || colors.grey.main;

  if (loading) {
    return (
      <View
        style={{
          width,
          height,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: background,
        }}
      >
        <View>
          <ActivityIndicator color="#000" />
          <Text className="text-center opacity-50">Učitavanje</Text>
        </View>
      </View>
    );
  }

  return children;
};
