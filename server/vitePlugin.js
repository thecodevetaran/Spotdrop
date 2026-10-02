import express from 'express';
import cookieParser from 'cookie-parser';
import api from './api.js';

/**
 * Vite plugin that mounts the Spotdrop backend API directly into Vite dev server.
 * This enables seamless local development on a single port (5173).
 */
export function spotdropApiPlugin() {
  return {
    name: 'spotdrop-api-plugin',
    configureServer(server) {
      const app = express();
      app.use(express.json());
      app.use(cookieParser());
      app.use('/api', api);

      server.middlewares.use(app);
    },
  };
}
