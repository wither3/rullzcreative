const axios = require('axios');

async function tiktokDl(url) {
    return new Promise(async (resolve, reject) => {
        try {
            let data = [];
            let domain = 'https://www.tikwm.com/api/';

            let response = await axios.post(domain, {}, {
                headers: {
                    'Accept': 'application/json, text/javascript, */*; q=0.01',
                    'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Origin': 'https://www.tikwm.com',
                    'Referer': 'https://www.tikwm.com/',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                params: {
                    url: url,
                    count: 12,
                    cursor: 0,
                    web: 1,
                    hd: 1
                }
            });

            let res = response.data.data;

            if (!res.size) {
                res.images.map(v => {
                    data.push({ type: 'photo', url: v });
                });
            } else {
                data.push(
                    { type: 'watermark', url: 'https://www.tikwm.com' + res.wmplay },
                    { type: 'nowatermark', url: 'https://www.tikwm.com' + res.play },
                    { type: 'nowatermark_hd', url: 'https://www.tikwm.com' + res.hdplay }
                );
            }

            resolve({
                nickname: res.author.nickname,
                nama: res.author.unique_id,
                region: res.region,
                soundTitle: res.music_info.title,
                soundAuthor: res.music_info.author,
                penonton: res.play_count,
                like: res.digg_count,
                komen: res.comment_count,
                favorit: res.collect_count,
                bagikan: res.share_count,
                unduh: res.download_count,
                kapan: res.create_time,
profile: `https://tikwm.com${res.author.avatar}`
            });
        } catch (e) {
            reject(e); // Typo diperbaiki di sini
        }
    });
}

module.exports = { tiktokDl };
