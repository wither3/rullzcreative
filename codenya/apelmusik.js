const axios = require('axios');
const cheerio = require('cheerio');
const FormData = require('form-data');

const aplMate = {
    get_token: async function () {
        const response = await axios.get('https://aplmate.com/');
        const $ = cheerio.load(response.data);
        return {
            token: $('input[type=hidden]').attr('name'),
            id: $('input[type=hidden]').val(),
            cookie: response.headers['set-cookie'].map(cookie => cookie.split(';')[0]).join('; ')
        };
    },

    request: async function (url) {
        url = url.split('?i=')[0];
        const rx = /^https:\/\/music\.apple\.com\/.+\/(album|song)\/.+$/;
        if (!rx.test(url)) return { creator: 'Daffa ~', status: 'error', code: 400, message: 'Link nya kudu yang slug album atau song bree 👍' };

        const { token, id, cookie } = await this.get_token();
        const form = new FormData();
        form.append('url', url);
        form.append(token, id);

        try {
            const response = await axios.post('https://aplmate.com/action', form, { headers: { ...form.getHeaders(), cookie, 'user-agent': 'Postify/1.0.' } });
            const $ = cheerio.load(response.data);
            const music_info = await this.get_info(url);

            if (url.includes('/song/')) {
                const image = $('.aplmate-downloader img').attr('src');
                const title = $('.aplmate-downloader h3[itemprop=name] .hover-underline').text().trim();
                let artist = $('.aplmate-downloader p').text().trim().replace(/ · | · |\s/g, '').trim();
                const downloadLinks = this.download_links(response.data);

                return { 
                    creator: 'Daffa ~', 
                    status: 'success', 
                    code: 200, 
                    data: [{ image, title, artist, download: downloadLinks, ...music_info }] 
                };
            }

            const results = await Promise.all($('.row.dlvideos').map(async (index, element) => {
                const image = $(element).find('img').attr('src');
                const title = $(element).find('h3[itemprop=name] .hover-underline').text().trim();
                let artist = $(element).find('p').text().trim().replace(/ · | · |\s/g, '').trim();
                const jwt_token = $(element).find('input[name=data]').val();
                const base = $(element).find('input[name=base]').val();
                const tokens = $(element).find('input[name=token]').val();

                const result = await this.track_data(jwt_token, base, tokens, cookie);
                const download = result.error ? [] : this.download_links(result.data);

                return { image, title, artist, download: download.length ? download : result };
            }).get());

            const res = results.map(item => ({ ...item, ...music_info }));

            return { creator: 'Daffa ~', status: 'success', code: 200, data: res };
        } catch {
            return { creator: 'Daffa ~', status: 'error', code: 500, message: 'Internal Server Error' };
        }
    },

    get_info: async function (url) {
        try {
            const response = await axios.get(url);
            const $ = cheerio.load(response.data);
            return {
                title: $('meta[property=og:title]').attr('content'),
                description: $('meta[property=og:description]').attr('content'),
                releaseDate: $('meta[property=music:release_date]').attr('content'),
                imageUrl: $('meta[property=og:image]').attr('content'),
                genre: $('meta[property=music:genre]').attr('content'),
                duration: $('meta[property=music:song:duration]').attr('content'),
                albumUrl: $('meta[property=music:album]').attr('content'),
                artistUrl: $('meta[property=music:musician]').attr('content'),
                albumTitle: $('meta[property=music:album]').attr('content')
            };
        } catch (error) {
            console.error(error);
            return {};
        }
    },

    track_data: async function (jwt_token, base, tokens, cookie) {
        const form = new FormData();
        form.append('data', jwt_token);
        form.append('base', base);
        form.append('token', tokens);

        try {
            const response = await axios.post('https://aplmate.com/action/track', form, {
                headers: { ...form.getHeaders(), origin: 'https://aplmate.com', referer: 'https://aplmate.com/', cookie, 'user-agent': 'Postify/1.0.0' },
            });
            return response.data;
        } catch {
            return { error: true, message: 'Tidak mendapatkan response dari API 👍' };
        }
    },

    download_links: function (html) {
        const $ = cheerio.load(html);
        return $('.aplmate-downloader .abuttons a').map((index, element) => ({
            title: $(element).text().trim(),
            link: 'https://aplmate.com' + $(element).attr('href')
        })).get().filter(link => link.title === 'Download Mp3' || link.title === 'Download Cover [HD]');
    }
};

module.exports = aplMate;
              
