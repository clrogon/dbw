import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // SECURITY: fail the build loudly if the Supabase anon key is missing so a
  // Supabase key rotation on the dashboard does not silently produce a
  // bundle shipping an empty/stale key. The runtime guard in
  // src/integrations/supabase/client.ts catches the missing-env case inside
  // the bundle for the dev server; here we catch it at build time too, so a
  // misconfigured Vercel/preview deploy fails the build before a user ever
  // sees a blank page.
  const env = loadEnv(mode, process.cwd(), "");
  const missingRequired = [
    "VITE_SUPABASE_URL",
    "VITE_SUPABASE_PUBLISHABLE_KEY",
  ].filter((k) => !env[k]);
  if (process.env.VITE_SKIP_ENV_CHECK !== "1" && missingRequired.length > 0) {
    const msg =
      `[vite.config] Missing required env var(s): ${missingRequired.join(", ")}. ` +
      `Set them in .env (see .env.example) or set VITE_SKIP_ENV_CHECK=1 to bypass (CI-only).`;
    throw new Error(msg);
  }

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(),
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: ["favicon.ico", "og-image.jpg", "robots.txt"],
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,jpg,jpeg,svg,webp,woff,woff2}"],
          navigateFallbackDenylist: [/^\/~oauth/],
          runtimeCaching: [
            // Only cache Supabase Storage public assets (images) — NOT auth/REST endpoints.
            // TTL dropped from 30 days to 1 day (2026-07): a 30-day SW cache made admin
            // image updates invisible to returning PWA users for up to a month. A single
            // day balances quota vs freshness — admins no longer get "I updated it, why
            // didn't it change?" support tickets. If a longer TTL is ever restored, it
            // MUST be paired with URL-versioning on every CMS image write.
            {
              urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/v1\/object\/public\/.*/i,
              handler: "CacheFirst",
              options: {
                cacheName: "supabase-public-storage",
                expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 },
                cacheableResponse: { statuses: [0, 200] },
              },
            },
          ],
        },
        manifest: {
          name: "DBW — Mente Activa, Vida Saudável",
          short_name: "DBW Fitness",
          description: "Fitness profissional em Luanda. Natação, treino personalizado, ginástica laboral e aulas em grupo.",
          theme_color: "#C0392B",
          background_color: "#0f172a",
          display: "standalone",
          orientation: "portrait",
          scope: "/",
          start_url: "/",
          lang: "pt-AO",
          categories: ["fitness", "health", "sports"],
          icons: [
            {
              src: "/pwa-192x192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/pwa-512x512.png",
              sizes: "512x512",
              type: "image/png",
            },
            {
              src: "/pwa-512x512.png",
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
  };
});
