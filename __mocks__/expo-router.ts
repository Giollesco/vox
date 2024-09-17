// Mocking expo-router and other Expo modules
jest.mock('expo-router', () => ({
  Link: jest.fn(() => null),
}));

jest.mock('expo-asset', () => ({
  useAssets: jest.fn(() => [[], false]),
}));

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

// Add more mocks as needed
