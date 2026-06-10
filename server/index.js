import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

// ============ API ROUTES ============

// GET all libraries
app.get('/api/libraries', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('libraries')
      .select('*')
      .order('collection_size', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching libraries:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET single library by id
app.get('/api/libraries/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('libraries')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('Error fetching library:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST — add a new library
app.post('/api/libraries', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('libraries')
      .insert([req.body])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Error creating library:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT — update a library
app.put('/api/libraries/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('libraries')
      .update(req.body)
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    res.json(data[0]);
  } catch (err) {
    console.error('Error updating library:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE — remove a library
app.delete('/api/libraries/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('libraries')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
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

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
