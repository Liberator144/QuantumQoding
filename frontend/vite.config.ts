import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const isProduction = mode === "production";

  return {
    plugins: [
      react(),
      // Generate bundle visualization in stats.html
      visualizer({
        open: false,
        gzipSize: true,
        brotliSize: true,
        filename: "stats.html",
      }),
      // Compress assets with gzip
      viteCompression({
        verbose: true,
        algorithm: "gzip",
        ext: ".gz",
      }),
      // Compress assets with brotli (better compression but less supported)
      viteCompression({
        verbose: true,
        algorithm: "brotliCompress",
        ext: ".br",
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },    build: {
      // STRICT TYPESCRIPT COHERENCE - PREVENT PRODUCTION BUILDS
      rollupOptions: {
        external: () => true, // Mark all modules as external to prevent bundling
        output: {
          format: 'es', // Use ES modules format
          // Prevent any file generation
          entryFileNames: () => {
            throw new Error('STRICT TYPESCRIPT COHERENCE: Production builds are disabled to prevent JavaScript generation');
          },
        },
      },
    },    // Enable CSS code splitting
    css: {
      devSourcemap: !isProduction,
      modules: {
        // Generate shorter CSS class names in production
        generateScopedName: isProduction ? "[hash:base64:8]" : "[local]_[hash:base64:5]",
      },
    },
    // Configure server options
    server: {
      port: parseInt(process.env.VITE_PORT || '5173', 10),
      open: true,
      // Enable compression
      compress: true,
      // Configure proxy for backend API
      proxy: {
        '/api': {
          target: `http://localhost:${process.env.VITE_BACKEND_PORT || '3001'}`,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    // Configure preview server
    preview: {
      port: parseInt(process.env.VITE_PORT || '5173', 10),
      open: true,
      // Enable compression
      compress: true,
    },
  };
});