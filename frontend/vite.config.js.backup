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
    },
    build: {
      // Enable minification
      minify: isProduction ? "terser" : false,
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
      },
      // Enable source maps for development
      sourcemap: !isProduction,
      // Split chunks for better caching
      rollupOptions: {
        output: {
          manualChunks: {
            // Split React into a separate chunk
            "vendor-react": ["react", "react-dom", "react-router-dom"],
            // Split UI libraries into a separate chunk
            "vendor-ui": ["framer-motion", "lucide-react", "clsx", "tailwind-merge"],
            // Split state management into a separate chunk
            "vendor-state": ["zustand"],
            // Split particles into a separate chunk
            "vendor-particles": ["@tsparticles/engine", "@tsparticles/react", "@tsparticles/slim"],
          },
          // Use hashed filenames for better caching
          entryFileNames: isProduction ? "assets/[name].[hash].js" : "assets/[name].js",
          chunkFileNames: isProduction ? "assets/[name].[hash].js" : "assets/[name].js",
          assetFileNames: isProduction ? "assets/[name].[hash].[ext]" : "assets/[name].[ext]",
        },
      },
      // Set a max chunk size to avoid large bundles
      chunkSizeWarningLimit: 1000,
    },
    // Enable CSS code splitting
    css: {
      devSourcemap: !isProduction,
      modules: {
        // Generate shorter CSS class names in production
        generateScopedName: isProduction ? "[hash:base64:8]" : "[local]_[hash:base64:5]",
      },
    },
    // Configure server options
    server: {
      port: 3000,
      open: true,
      // Enable compression
      compress: true,
    },
    // Configure preview server
    preview: {
      port: 3000,
      open: true,
      // Enable compression
      compress: true,
    },
  };
});
