const express = require('express');
const cors = require('cors');
const { downloadTikTok } = require('./codenya/ttdownload');
const { downloadVideo } = require('./codenya/tmate.js');
const gemini = require('./codenya/gemini');
const { tiktokDl } = require('./tikwm2.js');
const aplMate = require('./codenya/apelmusik');
const ytdl = require('@distube/ytdl-core');
const Tiktok = require("@tobyg74/tiktok-api-dl");
const path = require('path');
const { readFile, writeFile } = require('./utils/fileHandler');
const { isDuplicate } = require('./utils/dataChecker');

const app = express();
const PORT = process.env.PORT || 3000;
const saveFilePath = path.join(__dirname, 'tiktok_downloads.json');
// Middleware untuk mengizinkan CORS
app.use(cors());
app.use(express.json());

// Middleware untuk mengabaikan favicon.ico
app.use((req, res, next) => {
  if (req.path === '/favicon.ico') {
    return res.status(204).end(); // Abaikan favicon.ico
  }
  console.log(`Request received: ${req.method} ${req.path}`); // Log semua permintaan
  next();
});

// Endpoint Debugging
app.get('/debug', (req, res) => {
  res.json({
    message: 'Debugging',
    tikwm2: typeof tiktokDl,
    gemini: typeof gemini,
    tmate: typeof downloadVideo,
    tiksave: typeof downloadTikTok,
    directory: __dirname,
  });
});

app.get('/ping', (req, res) => {
  // Catat waktu sebelum mulai proses
  const startTime = process.hrtime();

  // Simulasikan proses API (jika ada proses lain, tambahkan di sini)
  const result = { message: 'API is working fine' };

  // Hitung waktu setelah proses selesai
  const [seconds, nanoseconds] = process.hrtime(startTime);
  const elapsedTimeMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(3); // Waktu dalam ms

  // Kirim respons dengan waktu eksekusi
  res.json({
    status: 'success',
    result,
    responseTime: `${elapsedTimeMs} ms`,
  });
});


app.get('/tikwm/saved', (req, res) => {
  try {
    // Baca data yang disimpan
    const savedData = readFile(saveFilePath);

    if (savedData.length === 0) {
      return res.json({
        success: true,
        message: 'Tidak ada data yang disimpan.',
        data: [],
      });
    }

    // Ambil query parameter 'page' (opsional)
    const page = parseInt(req.query.page) || 1;
    const limit = 10; // Maksimal 10 hasil per halaman
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Ambil data sesuai halaman
    const paginatedData = savedData.slice(startIndex, endIndex);

    res.json({
      success: true,
      message: 'Data berhasil diambil.',
      data: paginatedData,
      pagination: {
        currentPage: page,
        totalItems: savedData.length,
        totalPages: Math.ceil(savedData.length / limit),
        hasNextPage: endIndex < savedData.length,
        hasPreviousPage: startIndex > 0,
      },
    });
  } catch (error) {
    console.error('Error fetching saved data:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data yang disimpan.',
      error: error.message,
    });
  }
});



app.get("/msdown/download", async (req, res) => {
  try {
    const tiktok_url = req.query.url; // Ambil URL dari parameter query

    if (!tiktok_url) {
      return res.status(400).json({
        success: false,
        message: "URL TikTok tidak diberikan",
      });
    }

    const result = await Tiktok.Downloader(tiktok_url, {
      version: "v3", // Pilih versi API
      proxy: "96.9.77.90", // Proxy opsional
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error saat memproses permintaan:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
});

app.get("/ssstik/download", async (req, res) => {
  try {
    const tiktok_url = req.query.url; // Ambil URL dari parameter query

    if (!tiktok_url) {
      return res.status(400).json({
        success: false,
        message: "URL TikTok tidak diberikan",
      });
    }

    const result = await Tiktok.Downloader(tiktok_url, {
      version: "v2", // Pilih versi API
      proxy: "96.9.77.90", // Proxy opsional
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error saat memproses permintaan:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
});

app.get('/youtube/download', async (req, res) => {
  const url = req.query.url; // URL diterima dari query parameter
  
  if (!url) {
    return res.status(400).json({ success: false, message: 'URL is required' });
  }

  try {
    const info = await ytdl.getInfo(url);
    const formats = info.formats.map(format => ({
      quality: format.qualityLabel || 'Unknown',
      mimeType: format.mimeType,
      url: format.url
    }));
    res.json({ success: true, formats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/apelmusik/download', async (req, res) => {
    const url = req.query.url; // URL diambil dari query parameter
    
    // Validasi apakah parameter `url` ada
    if (!url) {
        return res.status(400).json({
            status: 'error',
            message: 'Parameter "url" diperlukan',
        });
    }

    try {
        // Panggil fungsi `aplMate.request`
        const result = await aplMate.request(url);

        // Jika berhasil
        if (result.status === 'success') {
            return res.status(200).json(result);
        } else {
            // Jika ada kesalahan dari fungsi
            return res.status(result.code || 500).json(result);
        }
    } catch (error) {
        // Tangani error lainnya
        console.error(error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
});

// Endpoint TikTok dengan TikWM
app.get('/tikwm/download', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'URL TikTok harus disediakan dalam query parameter "url".' });
  }

  try {
    const existingData = readFile(saveFilePath);

    // Periksa apakah URL sudah ada
    if (isDuplicate(existingData, url)) {
      const existingResult = existingData.find((entry) => entry.result.url === url).result;
      return res.json({
        success: true,
        message: 'Data sudah ada, tidak perlu disimpan ulang.',
        data: existingResult,
      });
    }

    // Fetch data baru jika URL unik
    const result = await tiktokDl(url);
    const newEntry = {
      result: {
        ...result,
        url, // Tambahkan URL TikTok ke dalam result
      },
    };

    // Simpan data baru
    existingData.push(newEntry);
    writeFile(saveFilePath, existingData);

    res.json({
      success: true,
      message: 'Data berhasil diunduh dan disimpan.',
      data: newEntry.result, // Hanya kirim result
    });
  } catch (error) {
    console.error('Error TikWM:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengunduh data TikTok',
      error: error.message,
    });
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
    console.error('Error TikTok Downloader:', error);
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
    console.error('Error Gemini:', error);
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
    console.error('Error Tmate:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat mendownload.' });
  }
});

// Handler untuk rute yang tidak ditemukan
app.use((req, res) => {
  res.status(404).json({ error: 'berikut adalah path: /apelmusik/download?url= ,/tiktok/ ,/tmate ,/tikwm'});
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});