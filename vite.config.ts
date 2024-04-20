import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
      proxy: {
        '/api': {
          target: 'https://tunniplaan.taltech.ee/tt/api/public/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
          headers: {
            Origin: "https://tunniplaan.taltech.ee",
          },
        },
      }
    }
});
