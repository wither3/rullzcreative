// ./codenya/ytdownload.js
const { tiksave } = require('./data/tiksave');
const { tiktokDl } = require('./data/tikwm'); // Pastikan path ini sesuai dengan lokasi file tiktokDl

const downloadTikTok = async (url) => {
  try {
    // Menjalankan kedua fungsi secara bersamaan
    const [videoData, tiktokData] = await Promise.all([
      tiksave.getData(url),
      tiktokDl(url)
    ]);

    // Menggabungkan data dari tiksave dan tiktokDl
    const combinedData = {
      nickname: tiktokData.nickname,
      nama: tiktokData.nama,
      profile: tiktokData.profile,
      negara: tiktokData.region,
      data: {
        penonton: tiktokData.penonton,
        like: tiktokData.like,
        komen: tiktokData.komen,
        favorit: tiktokData.favorit,
        bagikan: tiktokData.bagikan,
        unduh: tiktokData.unduh,
        kapan: tiktokData.kapan
      },
      video: {
        A: {
          teks: `No Watermark`,
          link: videoData.downloadLinks[0]?.link || 'Link tidak tersedia'
        },
        B: {
          teks: `No Watermark HD`,
          link: videoData.downloadLinks[2]?.link || 'Link tidak tersedia'
        },
        C: {
          teks: `Mp3`,
          link: videoData.downloadLinks[3]?.link || 'Link tidak tersedia'
        }
      },
      audioData: {
        soundtitle: tiktokData.soundTitle,
        soundAuthor: tiktokData.soundAuthor,
        link: videoData.downloadLinks[3]?.link || 'Link tidak tersedia'
      }
    };

    // Mengembalikan hasil gabungan
    return combinedData; 
  } catch (error) {
    console.error('Error:', error);
    throw error; // Melempar kembali error agar bisa ditangani di index.js
  }
};

// Ekspor fungsi downloadTikTok
module.exports = { downloadTikTok };
