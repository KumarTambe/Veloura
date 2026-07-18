// Central place for the backend API base URL.
//
// LOCAL DEV: leave VITE_API_URL unset. Requests stay relative (e.g. "/api/products"),
// and Vite's dev proxy (see vite.config.js) forwards them to your local backend.
//
// PRODUCTION: set VITE_API_URL to your deployed backend's URL
// (e.g. https://veloura-backend.onrender.com) as an environment variable
// on your hosting platform (Vercel/Netlify project settings). This must be
// set at BUILD time, since Vite bakes env vars into the build.
export const API_URL = import.meta.env.VITE_API_URL || '';
