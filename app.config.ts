/* eslint-disable max-lines-per-function */
import type { ConfigContext, ExpoConfig } from '@expo/config';

import { ClientEnv, Env } from './env';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.NAME,
  description: `${Env.NAME} Mobile App`,
  owner: Env.EXPO_ACCOUNT_OWNER,
  scheme: Env.SCHEME,
  slug: 'vox',
  version: Env.VERSION.toString(),
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'cover',
    backgroundColor: '#DEF358',
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: 'https://u.expo.dev/698e9cb2-ddd4-4747-9dcb-8be5ca9c01d2',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },

  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    infoPlist: {
      NSMicrophoneUsageDescription:
        'This app requires microphone access in order to transcribe speech<',
    },
    bundleIdentifier: Env.BUNDLE_ID,
  },
  experiments: {
    typedRoutes: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#DEF358',
    },
    package: Env.PACKAGE,
    permissions: ['RECORD_AUDIO'],
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    [
      'expo-font',
      {
        // Import Urbanist font from Google Fonts
        fonts: [
          'node_modules/@expo-google-fonts/urbanist/Urbanist_100Thin_Italic.ttf',
          'node_modules/@expo-google-fonts/urbanist/Urbanist_100Thin.ttf',
          'node_modules/@expo-google-fonts/urbanist/Urbanist_200ExtraLight_Italic.ttf',
          'node_modules/@expo-google-fonts/urbanist/Urbanist_200ExtraLight.ttf',
          'node_modules/@expo-google-fonts/urbanist/Urbanist_300Light_Italic.ttf',
          'node_modules/@expo-google-fonts/urbanist/Urbanist_300Light.ttf',
          'node_modules/@expo-google-fonts/urbanist/Urbanist_400Regular_Italic.ttf',
          'node_modules/@expo-google-fonts/urbanist/Urbanist_400Regular.ttf',
          'node_modules/@expo-google-fonts/urbanist/Urbanist_500Medium_Italic.ttf',
          'node_modules/@expo-google-fonts/urbanist/Urbanist_500Medium.ttf',
          'node_modules/@expo-google-fonts/urbanist/Urbanist_600SemiBold_Italic.ttf',
          'node_modules/@expo-google-fonts/urbanist/Urbanist_600SemiBold.ttf',
          'node_modules/@expo-google-fonts/urbanist/Urbanist_700Bold_Italic.ttf',
          'node_modules/@expo-google-fonts/urbanist/Urbanist_700Bold.ttf',
          'node_modules/@expo-google-fonts/urbanist/Urbanist_800ExtraBold_Italic.ttf',
          'node_modules/@expo-google-fonts/urbanist/Urbanist_800ExtraBold.ttf',
          'node_modules/@expo-google-fonts/urbanist/Urbanist_900Black_Italic.ttf',
          'node_modules/@expo-google-fonts/urbanist/Urbanist_900Black.ttf',
        ],
      },
    ],
    'expo-localization',
    'expo-router',
    [
      'expo-build-properties',
      {
        android: {
          kotlinVersion: '1.7.22', // this is for softinput package
          minSdkVersion: 24,
        },
      },
    ],
    [
      'app-icon-badge',
      {
        enabled: Env.APP_ENV !== 'production',
        badges: [
          {
            text: Env.APP_ENV,
            type: 'banner',
            color: 'white',
          },
          {
            text: Env.VERSION.toString(),
            type: 'ribbon',
            color: 'white',
          },
        ],
      },
    ],
  ],
  extra: {
    ...ClientEnv,
    eas: {
      projectId: Env.EAS_PROJECT_ID,
    },
  },
});
