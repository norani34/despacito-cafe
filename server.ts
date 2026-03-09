import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('vibes.db');

// Initialize Database
// Dropping tables to ensure schema update for this dev iteration
db.exec(`
  DROP TABLE IF EXISTS memories;
  DROP TABLE IF EXISTS songs;

  CREATE TABLE IF NOT EXISTS memories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user TEXT,
    text_ar TEXT,
    text_en TEXT,
    image TEXT,
    color TEXT,
    rotate TEXT,
    client_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    artist TEXT,
    duration TEXT,
    added_by TEXT,
    client_id TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE INDEX IF NOT EXISTS idx_memories_created_at ON memories(created_at);
  CREATE INDEX IF NOT EXISTS idx_songs_created_at ON songs(created_at);
`);

// Seed initial data if empty
const memoryCount = db.prepare('SELECT count(*) as count FROM memories').get() as { count: number };
if (memoryCount.count === 0) {
  const insertMemory = db.prepare('INSERT INTO memories (user, text_ar, text_en, color, rotate, client_id) VALUES (?, ?, ?, ?, ?, ?)');
  insertMemory.run('Ahmed M.', 'أحلى مولتن كيك كلته في حياتي! 🍫', 'Best Molten Cake I ever had! 🍫', 'bg-yellow-100', 'rotate-2', 'system');
  insertMemory.run('Sarah K.', 'المكان ده بيتي التاني بجد ❤️', 'This place is literally my second home ❤️', 'bg-rose-100', '-rotate-1', 'system');
  insertMemory.run('Omar', 'القهوة هنا بتظبط يومي ☕', 'Coffee here fixes my entire day ☕', 'bg-blue-100', 'rotate-3', 'system');
  insertMemory.run('Laila', 'وحشني قعدة الصحاب هنا أوي 🥺', 'Miss hanging out with friends here so much 🥺', 'bg-green-100', '-rotate-2', 'system');
  insertMemory.run('Hassan', 'الوايت موكا اختراع! 🥤', 'The White Mocha is an invention! 🥤', 'bg-purple-100', 'rotate-1', 'system');
}

const songCount = db.prepare('SELECT count(*) as count FROM songs').get() as { count: number };
if (songCount.count === 0) {
  const insertSong = db.prepare('INSERT INTO songs (title, artist, duration, added_by, client_id) VALUES (?, ?, ?, ?, ?)');
  insertSong.run('Tamally Maak', 'Amr Diab', '4:15', 'Admin', 'system');
  insertSong.run('3 Daqat', 'Abu ft. Yousra', '3:45', 'Admin', 'system');
  insertSong.run('Nour El Ein', 'Amr Diab', '4:02', 'Admin', 'system');
  insertSong.run('Fly Me To The Moon', 'Frank Sinatra', '2:30', 'Admin', 'system');
  insertSong.run('Sway', 'Michael Bublé', '3:10', 'Admin', 'system');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security & Performance Middleware
  app.use(helmet({
    contentSecurityPolicy: false, // Disabled for dev/preview environment compatibility
    crossOriginEmbedderPolicy: false,
  }));
  app.use(compression());
  
  // Rate Limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Limit each IP to 1000 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use(limiter);

  app.use(express.json({ limit: '10mb' })); // Increase limit for base64 images

  // API Routes
  app.get('/api/memories', (req, res) => {
    const memories = db.prepare('SELECT * FROM memories ORDER BY created_at DESC').all();
    res.json(memories);
  });

  app.post('/api/memories', (req, res) => {
    const { user, text, image, color, rotate } = req.body;
    const clientId = req.headers['x-client-id'] as string || 'guest';

    if (!user || !text) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Sanitize inputs (basic example, better to use a library like DOMPurify on frontend)
    const safeUser = String(user).slice(0, 50);
    const safeText = String(text).slice(0, 500);

    const stmt = db.prepare('INSERT INTO memories (user, text_ar, text_en, image, color, rotate, client_id) VALUES (?, ?, ?, ?, ?, ?, ?)');
    const info = stmt.run(safeUser, safeText, safeText, image || null, color || 'bg-white', rotate || 'rotate-0', clientId);
    res.json({ id: info.lastInsertRowid, ...req.body, client_id: clientId });
  });

  app.delete('/api/memories/:id', (req, res) => {
    const { id } = req.params;
    const clientId = req.headers['x-client-id'] as string;

    if (!clientId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const memory = db.prepare('SELECT client_id FROM memories WHERE id = ?').get(id) as { client_id: string } | undefined;

    if (!memory) {
      return res.status(404).json({ error: 'Memory not found' });
    }

    if (memory.client_id !== clientId) {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own memories' });
    }

    db.prepare('DELETE FROM memories WHERE id = ?').run(id);
    res.json({ success: true });
  });

  app.get('/api/songs', (req, res) => {
    const songs = db.prepare('SELECT * FROM songs ORDER BY created_at DESC').all();
    res.json(songs);
  });

  app.post('/api/songs', (req, res) => {
    const { title, artist, duration, added_by } = req.body;
    const clientId = req.headers['x-client-id'] as string || 'guest';

    if (!title || !artist) {
      return res.status(400).json({ error: 'Missing title or artist' });
    }
    const stmt = db.prepare('INSERT INTO songs (title, artist, duration, added_by, client_id) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(title, artist, duration || '3:00', added_by || 'Guest', clientId);
    res.json({ id: info.lastInsertRowid, ...req.body, client_id: clientId });
  });

  app.delete('/api/songs/:id', (req, res) => {
    const { id } = req.params;
    const clientId = req.headers['x-client-id'] as string;

    if (!clientId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const song = db.prepare('SELECT client_id FROM songs WHERE id = ?').get(id) as { client_id: string } | undefined;

    if (!song) {
      return res.status(404).json({ error: 'Song not found' });
    }

    if (song.client_id !== clientId) {
      return res.status(403).json({ error: 'Forbidden: You can only delete your own songs' });
    }

    db.prepare('DELETE FROM songs WHERE id = ?').run(id);
    res.json({ success: true });
  });

  // Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    // Serve static preview assets (images) from the built `dist` folder in dev
    // so the dev server shows the same pictures as the `vite preview` output.
    app.use('/The Atmosphere', express.static(path.join(__dirname, 'dist', 'The Atmosphere')));

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving with caching
    app.use(express.static('dist', {
      maxAge: '1y', // Cache static assets for 1 year
      etag: false
    }));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
