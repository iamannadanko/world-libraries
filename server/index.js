import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from './prisma.js';
import { requireAuth, requireAdmin, optionalAuth } from './auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// ============ HELPER ============
// BigInt → Number для JSON серіалізації
function serializeLibrary(lib) {
  return {
    ...lib,
    collection_size: lib.collection_size ? Number(lib.collection_size) : null
  };
}

// ============ LIBRARIES API ============

// GET — всі бібліотеки (тільки approved для звичайних, всі для адміна)
app.get('/api/libraries', optionalAuth, async (req, res) => {
  try {
    const where = req.isAdmin ? {} : { status: 'approved' };
    const libraries = await prisma.library.findMany({
      where,
      orderBy: { collection_size: 'desc' }
    });
    res.json(libraries.map(serializeLibrary));
  } catch (err) {
    console.error('Error fetching libraries:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET — одна бібліотека за id
app.get('/api/libraries/:id', async (req, res) => {
  try {
    const library = await prisma.library.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!library) {
      return res.status(404).json({ error: 'Бібліотеку не знайдено' });
    }
    res.json(serializeLibrary(library));
  } catch (err) {
    console.error('Error fetching library:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST — додати нову бібліотеку (авторизовані → статус pending, адмін → approved)
app.post('/api/libraries', requireAuth, async (req, res) => {
  try {
    const { name, name_en, country, city, founded, collection_size, description, image_url, gallery_urls, website, fun_fact, architecture, notable_items, latitude, longitude } = req.body;
    const library = await prisma.library.create({
      data: {
        name,
        name_en: name_en || null,
        country,
        city,
        founded: founded ? parseInt(founded) : null,
        collection_size: collection_size ? BigInt(collection_size) : null,
        description: description || null,
        image_url: image_url || null,
        gallery_urls: gallery_urls || null,
        website: website || null,
        fun_fact: fun_fact || null,
        architecture: architecture || null,
        notable_items: notable_items || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        status: req.isAdmin ? 'approved' : 'pending',
        submitted_by: req.userEmail
      }
    });
    res.status(201).json(serializeLibrary(library));
  } catch (err) {
    console.error('Error creating library:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT — оновити бібліотеку (тільки для адміна)
app.put('/api/libraries/:id', requireAdmin, async (req, res) => {
  try {
    const { name, name_en, country, city, founded, collection_size, description, image_url, gallery_urls, website, fun_fact, architecture, notable_items, latitude, longitude } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (name_en !== undefined) data.name_en = name_en;
    if (country !== undefined) data.country = country;
    if (city !== undefined) data.city = city;
    if (founded !== undefined) data.founded = founded ? parseInt(founded) : null;
    if (collection_size !== undefined) data.collection_size = collection_size ? BigInt(collection_size) : null;
    if (description !== undefined) data.description = description;
    if (image_url !== undefined) data.image_url = image_url;
    if (gallery_urls !== undefined) data.gallery_urls = gallery_urls;
    if (website !== undefined) data.website = website;
    if (fun_fact !== undefined) data.fun_fact = fun_fact;
    if (architecture !== undefined) data.architecture = architecture;
    if (notable_items !== undefined) data.notable_items = notable_items;
    if (latitude !== undefined) data.latitude = latitude ? parseFloat(latitude) : null;
    if (longitude !== undefined) data.longitude = longitude ? parseFloat(longitude) : null;

    const library = await prisma.library.update({
      where: { id: parseInt(req.params.id) },
      data
    });
    res.json(serializeLibrary(library));
  } catch (err) {
    console.error('Error updating library:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE — видалити бібліотеку (тільки адмін може видалити напряму)
app.delete('/api/libraries/:id', requireAdmin, async (req, res) => {
  try {
    await prisma.library.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Видалено успішно' });
  } catch (err) {
    console.error('Error deleting library:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============ DELETE REQUESTS API ============

// POST — створити запит на видалення (для авторизованих користувачів)
app.post('/api/delete-requests', requireAuth, async (req, res) => {
  try {
    const { library_id, reason } = req.body;

    // Перевірити чи вже є pending запит від цього користувача
    const existing = await prisma.deleteRequest.findFirst({
      where: {
        library_id: parseInt(library_id),
        user_id: req.userId,
        status: 'pending'
      }
    });
    if (existing) {
      return res.json({ message: 'Запит вже надіслано', request: existing });
    }

    const request = await prisma.deleteRequest.create({
      data: {
        library_id: parseInt(library_id),
        user_id: req.userId,
        user_email: req.userEmail,
        reason: reason || null
      }
    });
    res.status(201).json(request);
  } catch (err) {
    console.error('Error creating delete request:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============ ADMIN API ============

// GET — список бібліотек на модерації
app.get('/api/admin/pending-libraries', requireAdmin, async (req, res) => {
  try {
    const libraries = await prisma.library.findMany({
      where: { status: 'pending' },
      orderBy: { created_at: 'desc' }
    });
    res.json(libraries.map(serializeLibrary));
  } catch (err) {
    console.error('Error fetching pending:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST — підтвердити бібліотеку
app.post('/api/admin/approve-library/:id', requireAdmin, async (req, res) => {
  try {
    const library = await prisma.library.update({
      where: { id: parseInt(req.params.id) },
      data: { status: 'approved' }
    });
    res.json(serializeLibrary(library));
  } catch (err) {
    console.error('Error approving library:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST — відхилити бібліотеку
app.post('/api/admin/reject-library/:id', requireAdmin, async (req, res) => {
  try {
    const library = await prisma.library.update({
      where: { id: parseInt(req.params.id) },
      data: { status: 'rejected' }
    });
    res.json(serializeLibrary(library));
  } catch (err) {
    console.error('Error rejecting library:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET — список запитів на видалення
app.get('/api/admin/delete-requests', requireAdmin, async (req, res) => {
  try {
    const requests = await prisma.deleteRequest.findMany({
      where: { status: 'pending' },
      include: { library: true },
      orderBy: { created_at: 'desc' }
    });
    res.json(requests.map((r) => ({
      ...r,
      library: serializeLibrary(r.library)
    })));
  } catch (err) {
    console.error('Error fetching delete requests:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST — підтвердити видалення (видаляє бібліотеку)
app.post('/api/admin/approve-delete/:id', requireAdmin, async (req, res) => {
  try {
    const request = await prisma.deleteRequest.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!request) {
      return res.status(404).json({ error: 'Запит не знайдено' });
    }

    // Видаляємо бібліотеку (cascade видалить і запити і обрані)
    await prisma.library.delete({
      where: { id: request.library_id }
    });

    res.json({ message: 'Бібліотеку видалено' });
  } catch (err) {
    console.error('Error approving delete:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST — відхилити запит на видалення
app.post('/api/admin/reject-delete/:id', requireAdmin, async (req, res) => {
  try {
    const request = await prisma.deleteRequest.update({
      where: { id: parseInt(req.params.id) },
      data: { status: 'rejected' }
    });
    res.json(request);
  } catch (err) {
    console.error('Error rejecting delete:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET — статистика для адмін-панелі
app.get('/api/admin/stats', requireAdmin, async (req, res) => {
  try {
    const [pendingLibraries, pendingDeletes, totalLibraries, totalUsers] = await Promise.all([
      prisma.library.count({ where: { status: 'pending' } }),
      prisma.deleteRequest.count({ where: { status: 'pending' } }),
      prisma.library.count({ where: { status: 'approved' } }),
      prisma.favorite.groupBy({ by: ['user_id'] }).then((r) => r.length)
    ]);
    res.json({ pendingLibraries, pendingDeletes, totalLibraries, totalUsers });
  } catch (err) {
    console.error('Error fetching admin stats:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// ============ FAVORITES API ============

// GET — обране поточного користувача
app.get('/api/favorites', requireAuth, async (req, res) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { user_id: req.userId },
      include: { library: true },
      orderBy: { created_at: 'desc' }
    });
    res.json(favorites.map((f) => ({
      ...f,
      library: serializeLibrary(f.library)
    })));
  } catch (err) {
    console.error('Error fetching favorites:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST — додати в обране
app.post('/api/favorites/:libraryId', requireAuth, async (req, res) => {
  try {
    const libraryId = parseInt(req.params.libraryId);
    const favorite = await prisma.favorite.create({
      data: {
        user_id: req.userId,
        library_id: libraryId
      }
    });
    res.status(201).json(favorite);
  } catch (err) {
    // Якщо вже є — не помилка
    if (err.code === 'P2002') {
      return res.json({ message: 'Вже в обраному' });
    }
    console.error('Error adding favorite:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE — прибрати з обраного
app.delete('/api/favorites/:libraryId', requireAuth, async (req, res) => {
  try {
    const libraryId = parseInt(req.params.libraryId);
    await prisma.favorite.deleteMany({
      where: {
        user_id: req.userId,
        library_id: libraryId
      }
    });
    res.json({ message: 'Видалено з обраного' });
  } catch (err) {
    console.error('Error removing favorite:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET — перевірка авторизації (повертає дані користувача + isAdmin)
app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const favCount = await prisma.favorite.count({
      where: { user_id: req.userId }
    });
    res.json({
      id: req.userId,
      email: req.userEmail,
      isAdmin: req.isAdmin,
      favorites_count: favCount
    });
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Catch-all: serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
