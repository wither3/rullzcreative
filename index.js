// ./index.js
const express = require('express');
const cors = require('cors');
const { downloadTikTok } = require('./codenya/ttdownload'); // Pastikan path ini sesuai dengan lokasi file ytdownload.js

const app = express();

// Middleware untuk mengizinkan CORS
app.use(cors());

// Middleware untuk parsing JSON
app.use(express.json());

// Endpoint untuk mengunduh video TikTok
app.get('/tiktok/download', async (req, res) => {
  const url = req.query.url; // Mengambil URL dari query parameter

  if (!url) {
    return res.status(400).json({ error: 'URL tidak disediakan' });
  }

  try {
    const result = await downloadTikTok(url); // Menunggu hasil dari downloadTikTok
    res.json(result); // Mengembalikan hasil sebagai JSON
  } catch (error) {
    console.error('Error saat mengambil data:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data' });
  }
});

// Ekspor handler untuk Vercel
module.exports = app;
