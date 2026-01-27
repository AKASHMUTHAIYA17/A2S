import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.889ffb0fced4489086d391287e863f5b',
  appName: 'a2sott',
  webDir: 'dist',
  server: {
    url: 'https://889ffb0f-ced4-4890-86d3-91287e863f5b.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
