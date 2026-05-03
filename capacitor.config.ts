import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sahiplendirme.app',
  appName: 'Sahiplendirme',
  webDir: 'out',
  server: {
    // Vercel'deki canlı siteyi WebView olarak aç
    url: 'https://sahiplendirme-web.vercel.app',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    backgroundColor: '#ffffff',
    initialFocus: true,
  },
  ios: {
    scrollEnabled: true,
    backgroundColor: '#ffffff',
  },
};

export default config;
