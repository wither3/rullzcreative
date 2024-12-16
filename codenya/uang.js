const axios = require('axios');
const cheerio = require('cheerio');

// Fungsi scraping nilai tukar USD ke IDR
const scrapeUSDtoIDR = async () => {
    try {
        const url = 'https://www.google.com/search?q=1%24+berapa+rupiah';
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        const rate = $('span.DFlfde.SwHCTb').attr('data-value'); // Ambil nilai tukar

        if (rate) {
            return `1 USD = ${rate} IDR`;
        } else {
            throw new Error('Nilai tukar tidak ditemukan.');
        }
    } catch (error) {
        return `Gagal mengambil data: ${error.message}`;
    }
};

module.exports = { scrapeUSDtoIDR };
