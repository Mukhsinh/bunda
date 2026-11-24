import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const DIST_DIR = path.join(__dirname, 'dist');

// Serve static assets from the 'dist' directory
app.use(express.static(DIST_DIR, {
  maxAge: '1y',
  setHeaders: (res, filePath) => {
    // Avoid caching HTML or Service Worker files aggressively
    if (filePath.endsWith('.html') || filePath.endsWith('sw.js') || filePath.endsWith('manifest.webmanifest')) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    }
  }
}));

// SPA Fallback: Send index.html for any GET request that didn't match a static file
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    return next();
  }

  const indexPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send(`
      <h2>Dist build folder not found</h2>
      <p>Please build the project first by running: <code>npm run build</code></p>
    `);
  }
});

app.listen(PORT, HOST, () => {
  console.log(`Server is running at http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`);
});

