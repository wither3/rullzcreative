const axios = require('axios');
const cheerio = require('cheerio');

async function scrapeWeather(location) {
    const query = `https://www.google.com/search?q=cuaca+${encodeURIComponent(location)}`;

    try {
        const { data } = await axios.get(query, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const $ = cheerio.load(data);
        const time = $('.wob_dts').text() || 'Waktu tidak ditemukan';
        const temperature = $('.wob_t').first().text() || 'Suhu tidak ditemukan';
        const condition = $('.wob_dcp').text() || 'Kondisi tidak ditemukan';

        return { time, temperature, condition };
    } catch (err) {
        console.error(`Error fetching weather for ${location}:`, err.message);
        return null;
    }
}

async function fetchWeatherForCities() {
    const cities = ['Samarinda', 'Bone, Sulawesi Selatan', 'Semarang'];
    const weatherData = {};

    for (const city of cities) {
        const result = await scrapeWeather(city);
        weatherData[city] = result
            ? {
                  Time: result.time,
                  Temperatur: result.temperature,
                  Kondisi: result.condition
              }
            : {
                  Time: 'Data tidak tersedia',
                  Temperatur: 'Data tidak tersedia',
                  Kondisi: 'Data tidak tersedia'
              };
    }

    return weatherData;
}

module.exports = { fetchWeatherForCities };
