import express from 'express';
import cookieParser from 'cookie-parser';
import api from '../server/api.js';

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Parse cookies for admin authentication
app.use(cookieParser());

// Mount the Spotdrop API routes at both /api and root / to handle Vercel's rewrite behaviors seamlessly
app.use('/api', api);
app.use('/', api);

// Export Express app for Vercel Serverless Function runtime
export default app;
