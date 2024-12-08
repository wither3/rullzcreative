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
const axios = require('axios');
const https = require('https');
const sqlite3 = require('sqlite3').verbose();
const tiktokMain = require('./codenya/tiktokk');

const apikey = `afba42893fmsha63e4a70440e54dp1d25a3jsn2511b8314ddb`;
const apikey2 = `44114406bbmshdee24010b885bc0p140418jsn3d9caf51b4b3`;
const apikey3 = `2d8efbca6cmshba7782a3d1b31bcp160901jsn1b8edec486b4`;
const blobURL = 'https://pm6jctnwwrulrr4g.public.blob.vercel-storage.com/tiktok_downloads-dC42MVKaPuFrsE8Ey4NztLqXnlHppm.json';
const apiKeys = [apikey, apikey2, apikey3];

const blobToken = 'BLOB_READ_WRITE_TOKEN';
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
const db = new sqlite3.Database(':memory:'); // Atau gunakan file DB untuk persistensi
db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS hasil (id INTEGER PRIMARY KEY, message TEXT, timestamp TEXT)');
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





app.get('/read-json', (req, res) => {
  db.all('SELECT * FROM hasil', (err, rows) => {
    if (err) {
      console.error('Error:', err);
      return res.status(500).json({ success: false, message: 'Gagal membaca data.' });
    }
    res.status(200).json({ success: true, data: rows });
  });
});

    
app.get('/api/tikdl', async (req, res) => {
  try {
    // Ambil URL dari query parameter
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ error: 'URL TikTok tidak disertakan.' });
    }

    // Panggil fungsi utama untuk mendapatkan informasi TikTok
    const result = await tiktokMain(url);

    // Kirim hasil sebagai respons JSON
    res.status(200).json(result);
  } catch (err) {
    console.error('Error:', err.message);
    res.status(500).json({ error: 'Terjadi kesalahan pada server.', details: err.message });
  }
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




// Data di memori
const savedData = [];

// Endpoint untuk menyimpan data


// Endpoint untuk menyimpan data TikTok

app.get('/tikwm/download', async (req, res) => {
  // ...
  const tikDlData = await tiktokDl(url);
  if (tikDlData) {
    console.log('Berhasil mendapatkan data TikTok:', tikDlData);
    return res.status(200).json({ success: true, data: tikDlData });
    const timestamp = new Date().toISOString();
    db.run('INSERT INTO hasil (message, timestamp) VALUES (?, ?)', [tikDlData, timestamp], function (err) {
      if (err) {
        console.error('Error:', err);
        console.log('gagal');
      }
      console.log('berhasil menyimpan');
    });
  }
  // ...
});
    

// Endpoint untuk melihat semua data yang disimpan
app.get('/tikwm/data', async (req, res) => {
  try {
    // Baca data dari blob storage
    const data = await readBlobData();
    const limit = parseInt(req.query.limit, 10) || 10; // Default maksimal 10
    const limitedData = data.slice(0, limit);

    res.json({
      success: true,
      message: `Menampilkan ${limitedData.length} data dari blob storage`,
      data: limitedData,
    });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data dari blob storage',
      error: error.message,
    });
  }
});


// Endpoint untuk melihat semua data



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



// Fungsi untuk menulis file JSON

// Fungsi untuk membaca file dari blob storage
async function readBlobData() {
  try {
    const response = await axios.get(blobURL);
    return response.data; // Mengembalikan isi file
  } catch (error) {
    console.error('Error reading blob data:', error.message);
    return []; // Kembalikan array kosong jika gagal
  }
}

// Fungsi untuk menulis data ke blob storage

async function writeBlobData(newData) {
  try {
    console.log('Mencoba menyimpan data ke blob:', newData);

    const response = await axios.put(blobURL, JSON.stringify(newData), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${blobToken}`, // Gunakan token di header
      },
    });

    console.log('Berhasil memperbarui blob:', response.status);
    return true;
  } catch (error) {
    console.error('Gagal menulis ke blob:', error.message);
    return false;
  }
}


// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
