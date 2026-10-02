import express from 'express';
import cookieParser from 'cookie-parser';
import api from '../server/api.js';

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Parse cookies for admin authentication
app.use(cookieParser());

// Mount the Spotdrop API routes at /api
app.use('/api', api);

// Export Express app for Vercel Serverless Function runtime
export default app;
