//di buat oleh chatGPT
// igstalk.js
const axios = require('axios');
const FormData = require('form-data');

async function igStalk(username) {
  const form = new FormData();
  form.append('profile', username);

  try {
    const res = await axios.post(
      'https://tools.xrespond.com/api/instagram/profile-info',
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Accept': '*/*',
          'Accept-Encoding': 'gzip, deflate, br',
          'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
          'Origin': 'https://instaprofileviewer.com',
          'Referer': 'https://instaprofileviewer.com/',
          'Sec-Ch-Ua': '"Chromium";v="137", "Not/A)Brand";v="24"',
          'Sec-Ch-Ua-Mobile': '?1',
          'Sec-Ch-Ua-Platform': '"Android"',
          'Sec-Fetch-Dest': 'empty',
          'Sec-Fetch-Mode': 'cors',
          'Sec-Fetch-Site': 'cross-site',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36'
        }
      }
    );

    // Tampilkan data lengkap (termasuk isi array/object)
    
  const datanya = JSON.stringify(res.data, null, 2);
    return datanya;
  } catch (err) {
    console.error('❌ Gagal ambil data:', err.response?.data || err.message);
    return null;
  }
}

// Export agar bisa dipakai di file lain
module.exports = igStalk;
