import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { spotdropApiPlugin } from './server/vitePlugin.js';

export default defineConfig({
  plugins: [react(), spotdropApiPlugin()],
  server: {
    port: 5173,
    host: true,
  },
});
