import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.physicscurriculum.tracker",
  appName: "Physics Curriculum",
  webDir: "dist",
  android: {
    backgroundColor: "#0f172a",
    versionName: "1.0.0",
    versionCode: 1,
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 800,
      backgroundColor: "#0f172a",
      showSpinner: false,
    },
    Keyboard: {
      resize: "body",
      style: "dark",
      resizeOnFullScreen: true,
    },
  },
};

export default config;
