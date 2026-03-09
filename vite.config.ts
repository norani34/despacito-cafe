import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  function serveDistStatic() {
    const distDir = path.resolve(__dirname, 'dist');
    const mimeTypes: Record<string, string> = {
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.avif': 'image/avif',
      '.ico': 'image/x-icon',
    };

    return {
      name: 'vite:serve-dist-static',
      configureServer(server: any) {
        server.middlewares.use(async (req: any, res: any, next: any) => {
          try {
            const urlPath = decodeURIComponent((req.url || '').split('?')[0]);
            const filePath = path.join(distDir, urlPath);
            if (!filePath.startsWith(distDir)) return next();
            const stat = await fs.promises.stat(filePath).catch(() => null);
            if (!stat || !stat.isFile()) return next();
            const ext = path.extname(filePath).toLowerCase();
            const mime = mimeTypes[ext] || 'application/octet-stream';
            res.statusCode = 200;
            res.setHeader('Content-Type', mime);
            const stream = fs.createReadStream(filePath);
            stream.pipe(res);
          } catch (err) {
            next();
          }
        });
      },
    };
  }
  return {
    plugins: [react(), tailwindcss(), serveDistStatic()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'motion-vendor': ['motion/react'],
            'ui-vendor': ['lucide-react'],
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
