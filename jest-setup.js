jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-image-picker', () => ({
  launchImageLibraryAsync: jest.fn(),
  requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  launchCameraAsync: jest.fn(),
  MediaTypeOptions: {
    All: 'all',
    Images: 'images',
    Videos: 'videos',
  },
  CameraType: {
    back: 'back',
    front: 'front',
  },
}));
