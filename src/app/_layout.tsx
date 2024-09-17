/* eslint-disable react/react-in-jsx-scope */
import { useReactNavigationDevTools } from '@dev-plugins/react-navigation';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { ThemeProvider } from '@react-navigation/native';
import { SplashScreen, Stack, useNavigationContainerRef } from 'expo-router';
import { StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { APIProvider } from '@/api';
import { hydrateAuth, loadSelectedTheme } from '@/core';
import { useThemeConfig } from '@/core/use-theme-config';
import {
  Urbanist_100Thin,
  Urbanist_100Thin_Italic,
  Urbanist_200ExtraLight,
  Urbanist_300Light,
  Urbanist_300Light_Italic,
  Urbanist_400Regular,
  Urbanist_400Regular_Italic,
  Urbanist_500Medium,
  Urbanist_500Medium_Italic,
  Urbanist_600SemiBold,
  Urbanist_600SemiBold_Italic,
  Urbanist_700Bold,
  Urbanist_700Bold_Italic,
  Urbanist_800ExtraBold,
  Urbanist_800ExtraBold_Italic,
  Urbanist_900Black,
  Urbanist_900Black_Italic,
  useFonts,
} from '@expo-google-fonts/urbanist';

export { ErrorBoundary } from 'expo-router';

// Import  global CSS file
import '../../global.css';

export const unstable_settings = {
  initialRouteName: '(app)',
};

hydrateAuth();
loadSelectedTheme();
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const navigationRef = useNavigationContainerRef();
  useReactNavigationDevTools(navigationRef);
  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const [fontsLoaded] = useFonts({
    thin: Urbanist_100Thin,
    thinItalic: Urbanist_100Thin_Italic,
    extraLight: Urbanist_200ExtraLight,
    extraLightItalic: Urbanist_200ExtraLight,
    light: Urbanist_300Light,
    lightItalic: Urbanist_300Light_Italic,
    regular: Urbanist_400Regular,
    regularItalic: Urbanist_400Regular_Italic,
    medium: Urbanist_500Medium,
    mediumItalic: Urbanist_500Medium_Italic,
    semiBold: Urbanist_600SemiBold,
    semiBoldItalic: Urbanist_600SemiBold_Italic,
    bold: Urbanist_700Bold,
    boldItalic: Urbanist_700Bold_Italic,
    extraBold: Urbanist_800ExtraBold,
    extraBoldItalic: Urbanist_800ExtraBold_Italic,
    black: Urbanist_900Black,
    blackItalic: Urbanist_900Black_Italic,
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <Providers>
      <Stack>
        <Stack.Screen
          name="(app)"
          options={{ headerShown: false, animation: 'fade' }}
        />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen
          name="audio"
          options={{
            headerShown: false,
            animation: 'fade',
          }}
        />
      </Stack>
    </Providers>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider value={theme}>
        <APIProvider>
          <BottomSheetModalProvider>
            {children}
            <FlashMessage position="top" />
          </BottomSheetModalProvider>
        </APIProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
