import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["app-icon.png", "app-icon-192.png", "og-image.png"],
      workbox: {
        navigateFallbackDenylist: [/^\/~oauth/],
        globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.(mp4|webm|m3u8)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "video-cache",
              expiration: { maxEntries: 20, maxAgeSeconds: 7 * 24 * 60 * 60 },
              rangeRequests: true,
            },
          },
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|webp|gif|svg)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "image-cache",
              expiration: { maxEntries: 100, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
          {
            urlPattern: /^https:\/\/.*\/rest\/v1\/.*/,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              expiration: { maxEntries: 50, maxAgeSeconds: 5 * 60 },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "A2S OTT - Stream Movies",
        short_name: "A2S OTT",
        description: "Stream unlimited movies and entertainment on any device",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        categories: ["entertainment", "video"],
        icons: [
          {
            src: "/app-icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/app-icon.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
