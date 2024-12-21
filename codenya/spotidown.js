const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

const spotidown = {
  getToken: async () => {
    try {
      const response = await axios.get('https://spotidown.app/');
      const $ = cheerio.load(response.data);
      const inputs = $('input[name^="_"]');
      const results = [];
      const cookies = response.headers['set-cookie'];

      inputs.each((index, element) => {
        const inputName = $(element).attr('name');
        const inputValue = $(element).val();
        results.push({ name: inputName, value: inputValue });
      });

      return { results, cookies };
    } catch (error) {
      console.error('Error fetching data:', error);
      return JSON.stringify({ error: 'Error fetching data' });
    }
  },
  getData: async (url) => {
    try {
      const data = new FormData();
      const { results, cookies } = await spotidown.getToken();
      const name = results[0].name;
      const value = results[0].value;
      data.append('url', url);
      data.append(name, value);

      const config = {
        method: 'POST',
        url: 'https://spotidown.app/action',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0',
          'accept-language': 'id-ID',
          'referer': 'https://spotidown.app/',
          'origin': 'https://spotidown.app',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          'priority': 'u=0',
          'te': 'trailers',
          'Cookie': cookies,
          ...data.getHeaders()
        },
        data: data
      };

      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      console.error('Error in getData:', error);
      return error;
    }
  },
  download: async (url) => {
    try {
      const htmlData = await spotidown.getData(url);
      const $ = cheerio.load(htmlData);
      const downloadInfo = [];

      $('.spotidown-downloader').each((index, element) => {
        const title = $(element).find('.hover-underline').attr('title').trim();
        const artist = $(element).find('p span').text().trim();
        const thumbnail = $(element).find('img').attr('src');
        let audioLink = null;
        let coverLink = null;

        $(element).find('.abuttons a').each((i, el) => {
          const link = $(el).attr('href');
          const linkTitle = $(el).text().trim();
          if (linkTitle.includes('Mp3')) {
            audio = link;
          } else if (linkTitle.includes('Cover')) {
            cover = link;
          }
        });

        downloadInfo.push({ title, artist, thumbnail, audio, cover });
      });

      return downloadInfo;
    } catch (error) {
      console.error('Error in download:', error);
      return error;
    }
  }
};

module.exports = { spotidown };