import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sahiplendirme.app',
  appName: 'Sahiplendirme',
  webDir: '../mobile-app/dist',
  android: {
    allowMixedContent: false,
    backgroundColor: '#F5F5F7',
    initialFocus: true,
  },
  ios: {
    scrollEnabled: true,
    backgroundColor: '#F5F5F7',
  },
};

export default config;
