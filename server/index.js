import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from './prisma.js';

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

// ============ API ROUTES (Prisma ORM) ============

// GET — всі бібліотеки
app.get('/api/libraries', async (req, res) => {
  try {
    const libraries = await prisma.library.findMany({
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

// POST — додати нову бібліотеку
app.post('/api/libraries', async (req, res) => {
  try {
    const { name, name_en, country, city, founded, collection_size, description, image_url, website, fun_fact } = req.body;
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
        website: website || null,
        fun_fact: fun_fact || null
      }
    });
    res.status(201).json(serializeLibrary(library));
  } catch (err) {
    console.error('Error creating library:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT — оновити бібліотеку
app.put('/api/libraries/:id', async (req, res) => {
  try {
    const { name, name_en, country, city, founded, collection_size, description, image_url, website, fun_fact } = req.body;
    const data = {};
    if (name !== undefined) data.name = name;
    if (name_en !== undefined) data.name_en = name_en;
    if (country !== undefined) data.country = country;
    if (city !== undefined) data.city = city;
    if (founded !== undefined) data.founded = founded ? parseInt(founded) : null;
    if (collection_size !== undefined) data.collection_size = collection_size ? BigInt(collection_size) : null;
    if (description !== undefined) data.description = description;
    if (image_url !== undefined) data.image_url = image_url;
    if (website !== undefined) data.website = website;
    if (fun_fact !== undefined) data.fun_fact = fun_fact;

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

// DELETE — видалити бібліотеку
app.delete('/api/libraries/:id', async (req, res) => {
  try {
    await prisma.library.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Error deleting library:', err.message);
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
