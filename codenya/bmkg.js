const axios = require('axios');
const cheerio = require('cheerio');

// Fungsi untuk scraping data gempa
async function getGempaData() {
    const url = 'https://www.bmkg.go.id/';
    try {
        // Fetch HTML halaman BMKG
        const response = await axios.get(url);
        const html = response.data;

        // Load HTML ke Cheerio
        const $ = cheerio.load(html);

        // Seleksi elemen berdasarkan struktur HTML
        const container = $('.px-6.lg\\:px-12');

        const waktuGempa = container.find('p.mt-2').text().trim();
        console.log(waktuGempa);
// Pemetaan nama bulan ke angka

// Pemetaan nama bulan ke angka
const monthMap = {
    "Jan": 1,
    "Feb": 2,
    "Mar": 3,
    "Apr": 4,
    "May": 5,
    "Jun": 6,
    "Jul": 7,
    "Aug": 8,
    "Sep": 9,
    "Oct": 10,
    "Nov": 11,
    "Dec": 12
};

// String tanggal yang ingin diproses
const dateString = waktuGempa;

// Memisahkan string berdasarkan spasi
const parts = dateString.split(" ");

// Mengambil bagian bulan (indeks 1)
const bulan = parts[1];

// Mengonversi nama bulan menjadi angka menggunakan pemetaan
const bulanAngka = monthMap[bulan];





        
const tanggalWaktu = waktuGempa.split(','); // Memisahkan tanggal dan waktu
        const tanggal = tanggalWaktu[0].trim(); // "16 Des 2024"
const waktu = tanggalWaktu[1].trim(); // "10:50:04 WIB"        

        // Ubah nama bulan menjadi angka
        
        const bagianTanggal = tanggal.split(' '); // Pisahkan tanggal
        const hari = bagianTanggal[0]; // "16"
        
        const tahun = bagianTanggal[2]; // "2024"

        // Pisahkan jam, menit, detik
        const bagianWaktu = waktu.split(':'); // ["10", "50", "04 WIB"]
        const jam = bagianWaktu[0]; // "10"
        const menit = bagianWaktu[1]; // "50"
        const detik = bagianWaktu[2].split(' ')[0]; // "04"
const urlGambar = `https://static.bmkg.go.id/${tahun}${bulanAngka}${hari}${jam}${menit}${detik}.mmi.jpg`;



        
        const status = container.find('span.bg-\\[\\#0099001A\\]').text().trim();
        const lokasi = container.find('p.mt-4').text().trim();
        const magnitude = container
            .find('div:contains("Magnitudo:") span.font-bold')
            .text()
            .trim();
        const kedalaman = container
            .find('div:contains("Kedalaman:") span.font-bold')
            .text()
            .trim();
        const koordinat = container
            .find('div:contains("Koordinat Lokasi:") span.font-bold')
            .text()
            .trim();

        // Ambil URL gambar
        const gambarUrl = urlGambar;

        const saran = container.find('p.text-sm.font-medium').text().trim();

        // Return data dalam format JSON
        return {
            waktu,
            status,
            lokasi,
            magnitude,
            kedalaman,
            koordinat,
            gambarUrl,
            saran,
        };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { error: 'Error fetching data' };
    }
}

// Ekspor fungsi untuk digunakan di file lain
module.exports = { getGempaData };
