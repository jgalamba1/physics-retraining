import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    // Capacitor serves from /android/app/src/main/assets/public
    // so base must be "./" for relative asset paths in WebView
    base: "./",
  },
  server: {
    port: 5173,
    host: true,
  },
});
