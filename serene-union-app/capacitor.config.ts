import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.qurb.serene',
  appName: 'Qurb',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
