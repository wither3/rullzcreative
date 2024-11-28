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

app.get('/Gemini', async (req, res) => {
  const messages = req.query.messages; // Ambil parameter messages dari URL
  const temperature = parseFloat(req.query.temperature) || 0.9; // Parameter opsional
  const top_p = parseFloat(req.query.top_p) || 0.7; // Parameter opsional
  const top_k = parseInt(req.query.top_k) || 40; // Parameter opsional

  // Validasi input
  if (!messages) {
    return res.status(400).json({ error: 'Parameter "messages" harus disediakan' });
  }

  try {
    // Menyiapkan format messages untuk Gemini
    const options = {
      messages: [{ role: 'user', content: messages }],
      temperature,
      top_p,
      top_k
    };

    // Memanggil fungsi Gemini
    const result = await gemini(options);
    if (result.success) {
      res.json(result); // Kembalikan hasil sebagai JSON
    } else {
      res.status(500).json({ error: 'Gagal mendapatkan jawaban dari Gemini', details: result.errors });
    }
  } catch (error) {
    console.error('Error saat memproses Gemini:', error);
    res.status(500).json({ error: 'Terjadi kesalahan internal', details: error.message });
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
