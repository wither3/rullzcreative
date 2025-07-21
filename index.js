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
const tiktokMain = require('./codenya/tiktokk');
const { fetchWeatherForCities } = require('./codenya/cuaca');
const { getGempaData } = require('./codenya/bmkg');
const { scrapeUSDtoIDR } = require('./codenya/uang'); // Import fungsi scraper
const { tiktokStalk } = require('./codenya/countik'); // Import fungsi tiktokStalk
const chatbot = require('./codenya/gpt');
const { spotidown } = require('./codenya/spotidown');

const API_KEY = '552fb7eb710adde5563836d7';
const apikey = `afba42893fmsha63e4a70440e54dp1d25a3jsn2511b8314ddb`;
const apikey2 = `44114406bbmshdee24010b885bc0p140418jsn3d9caf51b4b3`;
const apikey3 = `2d8efbca6cmshba7782a3d1b31bcp160901jsn1b8edec486b4`;
const blobURL = 'https://pm6jctnwwrulrr4g.public.blob.vercel-storage.com/tiktok_downloads-dC42MVKaPuFrsE8Ey4NztLqXnlHppm.json';
const apiKeys = [apikey, apikey2, apikey3];
const igStalk = require("./igstalk.js");

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


app.get('/igstalk', async (req, res) => {
  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ error: 'Username tidak diberikan' });
  }

  const data = await igStalk(username);
  res.json(data);
});

app.get('/spotify', async (req, res) => {
  const url = req.query.url; // Ambil URL dari query parameter
  if (!url) {
    return res.status(400).json({ error: 'URL Spotify tidak boleh kosong.' });
  }

  try {
    const data = await spotidown.download(url); // Ambil data dari fungsi download
    res.json({ success: true, data }); // Kirim respons JSON
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'Gagal mengambil data dari Spotify.' });
  }
});
app.get('/gpt', async (req, res) => {
    const query = req.query.q; // Ambil query dari parameter URL

    if (!query) {
        return res.status(400).json({ error: 'Query tidak boleh kosong!' });
    }

    try {
        const response = await chatbot.send(query); // Kirim pertanyaan ke chatbot
        res.status(200).json({ success: true, response }); // Kirim respons sebagai JSON
    } catch (error) {
        console.error("Terjadi kesalahan:", error.message);
        res.status(500).json({ success: false, error: "Terjadi kesalahan pada server!" });
    }
});
app.get('/tikstalk', async (req, res) => {
    const username = req.query.username; // Ambil username dari query parameter

    if (!username) {
        return res.status(400).json({ error: 'Username TikTok diperlukan!' });
    }

    try {
        const data = await tiktokStalk(username); // Panggil fungsi stalk
        res.status(200).json({ success: true, data }); // Kirim data sebagai respons
    } catch (error) {
        console.error('Gagal mendapatkan data TikTok:', error);
        res.status(500).json({ success: false, error: 'Terjadi kesalahan pada server!' });
    }
});

app.get('/usdtorpv2', async (req, res) => {
    try {
        const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`;

        // Panggil API ExchangeRate-API
        const response = await axios.get(url);

        // Ambil nilai tukar dari USD ke IDR
        const rate = response.data.conversion_rates.IDR;

        // Kirim hasil sebagai JSON
        res.status(200).json({
            success: true,
            rate: `1 USD = ${rate} IDR`
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Gagal mengambil data nilai tukar',
            error: error.message
        });
    }
});

app.get('/usdtorp', async (req, res) => {
    try {
        const result = await scrapeUSDtoIDR(); // Panggil fungsi scraper
        res.status(200).json({ success: true, rate: result });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal mengambil nilai tukar', error: error.message });
    }
});
app.get('/gempa', (req, res) => {
  https.get('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json', (response) => {
    let data = '';
    response.on('data', chunk => data += chunk);
    response.on('end', () => res.json(JSON.parse(data)));
  }).on('error', err => res.status(500).send({ error: err.message }));
});
app.get('/cuaca', async (req, res) => {
    try {
        const weatherData = await fetchWeatherForCities();
        res.status(200).json({
            status: 'success',
            data: weatherData
        });
    } catch (error) {
        console.error('Terjadi kesalahan:', error.message);
        res.status(500).json({
            status: 'error',
            message: 'Gagal mengambil data cuaca'
        });
    }
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
  try {
    const url = req.query.url; // Ambil URL dari query parameter
    if (!url) {
      return res.status(400).json({ error: 'URL TikTok harus diberikan dalam parameter "url".' });
    }

    console.log('Mengunduh data TikTok untuk URL:', url);

    const tikDlData = await tiktokDl(url);
    if (tikDlData) {
      console.log('Berhasil mendapatkan data TikTok:', tikDlData);
      return res.status(200).json({ success: true, data: tikDlData });
    } else {
      return res.status(404).json({ error: 'Tidak ada data yang ditemukan untuk URL yang diberikan.' });
    }
  } catch (error) {
    console.error('Kesalahan saat mengunduh data TikTok:', error.message);
    return res.status(500).json({ error: 'Terjadi kesalahan internal server.', detail: error.message });
  }
});
    

// Endpoint untuk melihat semua data yang disimpan


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
