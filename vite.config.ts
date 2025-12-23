
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Define __dirname in an ES module environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Use base path for production build, root for development
    const base = mode === 'production' ? '/threat-modeling-card-game/' : '/';
    return {
      base,
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
      ,
      build: {
        // Raise warning limit slightly and apply manual chunking to split vendors
        chunkSizeWarningLimit: 1200,
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
                if (id.includes('recharts')) return 'vendor-recharts';
                if (id.includes('marked')) return 'vendor-marked';
                if (id.includes('@google/genai')) return 'vendor-genai';
                if (id.includes('tailwind')) return 'vendor-tailwind';
                return 'vendor';
              }
            }
          }
        }
      }
    };
});
