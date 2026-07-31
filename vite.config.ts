import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
// https://vite.dev/config/
export default defineConfig({
  css: { devSourcemap: true },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Target modern browsers for smaller output (no legacy polyfills)
    target: "esnext",
    // Enable CSS minification
    cssMinify: "lightningcss",
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — changes rarely, very cacheable
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          // UI primitives
          "ui-vendor": [
            "radix-ui",
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
          ],
          // Icons — large tree-shakeable lib
          "icons-vendor": ["lucide-react"],
          // Form handling
          "form-vendor": [
            "react-hook-form",
            "@hookform/resolvers",
            "zod",
          ],
          // Internationalization
          "i18n-vendor": ["i18next", "react-i18next"],
          // State & HTTP
          "state-vendor": ["zustand", "axios"],
          // Notifications & utilities
          "util-vendor": ["sonner", "@tanstack/react-virtual"],
        },
      },
    },
  },
})