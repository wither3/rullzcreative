const express = require('express');
const cors = require('cors');
const { downloadTikTok } = require('./codenya/ttdownload'); 
const { downloadVideo } = require('./codenya/tmate.js'); 
const gemini = require('./codenya/gemini');
const { tiktokDl } = require('./tikwm2.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk mengizinkan CORS
app.use(cors());
app.use(express.json());


app.get('/debug', (req, res) => {
  res.json({
    message: 'Debugging',
    tikwm2: typeof tiktokDl,
    gemini: typeof gemini,
    tmate: typeof downloadVideo,
    tiksave: typeof downloadTiktok,
    directory: __dirname
  });
});
// Endpoint TikTok dengan TikWM
app.get('/tikwm/download', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'URL TikTok harus disediakan dalam query parameter "url".' });
  }
  try {
    const result = await tiktokDl(url);
    res.json({ success: true, message: 'Data berhasil diunduh', data: result });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengunduh data TikTok', error: error.message });
  }
});

// Endpoint TikTok Downloader
app.get('/tiktok/download', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'URL tidak disediakan' });
  }
  try {
    const result = await downloadTikTok(url);
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mengambil data' });
  }
});

// Endpoint Gemini
app.get('/Gemini', async (req, res) => {
  const messages = req.query.messages;
  const temperature = parseFloat(req.query.temperature) || 0.9;
  const top_p = parseFloat(req.query.top_p) || 0.7;
  const top_k = parseInt(req.query.top_k) || 40;

  if (!messages || typeof messages !== 'string') {
    return res.status(400).json({ error: 'Parameter "messages" harus berupa string.' });
  }
  try {
    const options = { messages: [{ role: 'user', content: messages }], temperature, top_p, top_k };
    const result = await gemini(options);
    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json({ error: 'Gagal mendapatkan jawaban dari Gemini', details: result.errors });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan internal', details: error.message });
  }
});

// Endpoint Tmate
app.get('/tmate/download', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'URL tidak boleh kosong' });
  }
  try {
    const result = await downloadVideo(url);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: 'Tidak ada hasil untuk ditampilkan.' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mendownload.' });
  }
});

                         


// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
           
