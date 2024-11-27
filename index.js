// ./index.js
const express = require('express');
const cors = require('cors');
const { downloadTikTok } = require('./codenya/ttdownload'); // Pastikan path ini sesuai dengan lokasi file ttdownload.js

const app = express();

// Middleware untuk mengizinkan CORS
app.use(cors());

// Middleware untuk parsing JSON
app.use(express.json());

// Endpoint untuk mengunduh video TikTok
app.get('/tiktok/download', async (req, res) => {
  const url = req.query.url; // Mengambil URL dari query parameter

  // Memeriksa apakah URL disediakan
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

app.get('/tmate/download', async (req, res) => {
  const url = req.query.url; // Mengambil URL dari query parameter

  if (!url) {
    return res.status(400).json({ error: 'URL tidak boleh kosong' }); // Menangani kasus URL kosong
  }

  try {
    const result = await downloadVideo(url); // Memanggil fungsi downloadVideo dengan URL

    if (result) {
      return res.json(result); // Mengembalikan hasil dalam format JSON
    } else {
      return res.status(404).json({ error: 'Tidak ada hasil untuk ditampilkan.' });
    }
  } catch (error) {
    console.error('Terjadi kesalahan saat mendownload:', error);
    return res.status(500).json({ error: 'Terjadi kesalahan saat mendownload.'});
  }
});





// Menentukan port untuk server
const PORT = process.env.PORT || 3000;

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

// Ekspor handler untuk Vercel
module.exports = app;
