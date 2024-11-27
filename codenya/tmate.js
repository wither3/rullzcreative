const { tmate } = require('./data/tiktok.js');
const { tiktokDl } = require('./data/tikwm.js');

// Fungsi async untuk menangani download
async function downloadVideo(url) {
  try {
    const result = await tmate.download(url); // Memanggil fungsi download
    // Menampilkan hasil download tmate (jika diperlukan)
    console.log(result)
    const hasil = await tiktokDl(url); // Memanggil fungsi tiktokDl
    // Menampilkan hasil di konsol (jika diperlukan)

    // Cek apakah hasil ada
    if (!hasil) {
      console.log('Tunggu sebentar...'); // Jika hasil tidak ada
      return null; // Mengembalikan null jika tidak ada hasil
    } else {
      console.log('Berhasil mendapatkan informasi video!'); // Jika berhasil
      
      // Menampilkan informasi yang diinginkan
      const output = {
        nickname: hasil.nickname || 'Tidak ada username',
        nama: hasil.nama || 'Tidak ada nama',
        teks: result.title || 'gagal menemukan text',
        negara: hasil.region || 'Tidak diketahui',
        profile: hasil.profile || 'gagal menemukan data',
        data: {
          penonton: hasil.penonton || 'gagal mendapatkan data',
          like: hasil.like || 'gagal mendapatkan data',
          komen: hasil.komen || 'gagal mendapatkan data',
          favorit: hasil.favorit || 'gagal mendapatkan data',
          bagikan: hasil.bagikan || 'gagal mendapatkan data',
          unduh: hasil.unduh || 'gagal menemukan data',
          kapan: hasil.kapan || 'gagal menemukan data'
        },
        video: {
          A: {
            teks: 'tanpa watermark',
            link: result.downloadLinks[0]?.link || 'Tidak ada link'
          },
          B: {
            teks: 'tanpa watermark HD',
            link: result.downloadLinks[1]?.link || 'Tidak ada link'
          },
          C: {
            teks: 'dengan watermark',
            link: result.downloadLinks[2]?.link || 'Tidak ada link'
          },
          D: {
            teks: 'unduh mp3',
            link: result.downloadLinks[3]?.link || 'Tidak ada link'
          }
        },
        sound: {
          teks: hasil.soundTitle || 'Tidak ada judul suara',
          soundAuthor: hasil.soundAuthor || 'Tidak ada penulis suara',
          link: result.downloadLinks[3]?.link || 'Tidak ada link'
        }
      };

      return output; // Mengembalikan output yang diformat
    }
  } catch (error) {
    console.error('Terjadi kesalahan:', error); // Menangani error
    return null; // Mengembalikan null jika terjadi kesalahan
  }
}

// Ekspor fungsi downloadVideo agar bisa digunakan di file lain
module.exports = { downloadVideo };
