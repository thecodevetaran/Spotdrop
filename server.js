import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import api from './server/api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Mount API routes
app.use('/api', api);

// Serve static assets from production dist folder if built
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, { maxAge: '1d' }));

  // SPA fallback for /admin and client routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('Spotdrop API Server running. Run "npm run build" to serve the frontend.');
  });
}

app.listen(PORT, () => {
  console.log(`✓ Spotdrop Server running on http://localhost:${PORT}`);
  console.log(`✓ Admin Dashboard available at http://localhost:${PORT}/admin`);
});
