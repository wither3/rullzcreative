const https = require('https');

const apikey = `afba42893fmsha63e4a70440e54dp1d25a3jsn2511b8314ddb`;
const apikey2 = `44114406bbmshdee24010b885bc0p140418jsn3d9caf51b4b3`;
const apikey3 = `2d8efbca6cmshba7782a3d1b31bcp160901jsn1b8edec486b4`;

const apiKeys = [apikey, apikey2, apikey3];
const randomApiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];

const countries = {
  AF: "Afghanistan",
  AL: "Albania",
  DZ: "Algeria",
  AS: "American Samoa",
  AD: "Andorra",
  AO: "Angola",
  AR: "Argentina",
  AM: "Armenia",
  AU: "Australia",
  AT: "Austria",
  AZ: "Azerbaijan",
  BS: "Bahamas",
  BH: "Bahrain",
  BD: "Bangladesh",
  BB: "Barbados",
  BY: "Belarus",
  BE: "Belgium",
  BZ: "Belize",
  BJ: "Benin",
  BT: "Bhutan",
  BO: "Bolivia",
  BA: "Bosnia and Herzegovina",
  BW: "Botswana",
  BR: "Brazil",
  BN: "Brunei",
  BG: "Bulgaria",
  BF: "Burkina Faso",
  BI: "Burundi",
  KH: "Cambodia",
  CM: "Cameroon",
  CA: "Canada",
  CV: "Cape Verde",
  CF: "Central African Republic",
  TD: "Chad",
  CL: "Chile",
  CN: "China",
  CO: "Colombia",
  KM: "Comoros",
  CG: "Congo",
  CD: "Congo (DRC)",
  CR: "Costa Rica",
  HR: "Croatia",
  CU: "Cuba",
  CY: "Cyprus",
  CZ: "Czech Republic",
  DK: "Denmark",
  DJ: "Djibouti",
  DM: "Dominica",
  DO: "Dominican Republic",
  EC: "Ecuador",
  EG: "Egypt",
  SV: "El Salvador",
  GQ: "Equatorial Guinea",
  ER: "Eritrea",
  EE: "Estonia",
  SZ: "Eswatini",
  ET: "Ethiopia",
  FJ: "Fiji",
  FI: "Finland",
  FR: "France",
  GA: "Gabon",
  GM: "Gambia",
  GE: "Georgia",
  DE: "Germany",
  GH: "Ghana",
  GR: "Greece",
  GD: "Grenada",
  GT: "Guatemala",
  GN: "Guinea",
  GW: "Guinea-Bissau",
  GY: "Guyana",
  HT: "Haiti",
  HN: "Honduras",
  HU: "Hungary",
  IS: "Iceland",
  IN: "India",
  ID: "Indonesia",
  IR: "Iran",
  IQ: "Iraq",
  IE: "Ireland",
  IL: "Israel",
  IT: "Italy",
  JM: "Jamaica",
  JP: "Japan",
  JO: "Jordan",
  KZ: "Kazakhstan",
  KE: "Kenya",
  KI: "Kiribati",
  KP: "North Korea",
  KR: "South Korea",
  KW: "Kuwait",
  KG: "Kyrgyzstan",
  LA: "Laos",
  LV: "Latvia",
  LB: "Lebanon",
  LS: "Lesotho",
  LR: "Liberia",
  LY: "Libya",
  LI: "Liechtenstein",
  LT: "Lithuania",
  LU: "Luxembourg",
  MG: "Madagascar",
  MW: "Malawi",
  MY: "Malaysia",
  MV: "Maldives",
  ML: "Mali",
  MT: "Malta",
  MH: "Marshall Islands",
  MR: "Mauritania",
  MU: "Mauritius",
  MX: "Mexico",
  FM: "Micronesia",
  MD: "Moldova",
  MC: "Monaco",
  MN: "Mongolia",
  ME: "Montenegro",
  MA: "Morocco",
  MZ: "Mozambique",
  MM: "Myanmar",
  NA: "Namibia",
  NR: "Nauru",
  NP: "Nepal",
  NL: "Netherlands",
  NZ: "New Zealand",
  NI: "Nicaragua",
  NE: "Niger",
  NG: "Nigeria",
  MK: "North Macedonia",
  NO: "Norway",
  OM: "Oman",
  PK: "Pakistan",
  PW: "Palau",
  PS: "Palestine",
  PA: "Panama",
  PG: "Papua New Guinea",
  PY: "Paraguay",
  PE: "Peru",
  PH: "Philippines",
  PL: "Poland",
  PT: "Portugal",
  QA: "Qatar",
  RO: "Romania",
  RU: "Russia",
  RW: "Rwanda",
  WS: "Samoa",
  SM: "San Marino",
  ST: "Sao Tome and Principe",
  SA: "Saudi Arabia",
  SN: "Senegal",
  RS: "Serbia",
  SC: "Seychelles",
  SL: "Sierra Leone",
  SG: "Singapore",
  SK: "Slovakia",
  SI: "Slovenia",
  SB: "Solomon Islands",
  SO: "Somalia",
  ZA: "South Africa",
  SS: "South Sudan",
  ES: "Spain",
  LK: "Sri Lanka",
  SD: "Sudan",
  SR: "Suriname",
  SE: "Sweden",
  CH: "Switzerland",
  SY: "Syria",
  TW: "Taiwan",
  TJ: "Tajikistan",
  TZ: "Tanzania",
  TH: "Thailand",
  TL: "Timor-Leste",
  TG: "Togo",
  TO: "Tonga",
  TT: "Trinidad and Tobago",
  TN: "Tunisia",
  TR: "Turkey",
  TM: "Turkmenistan",
  TV: "Tuvalu",
  UG: "Uganda",
  UA: "Ukraine",
  AE: "United Arab Emirates",
  GB: "United Kingdom",
  US: "United States",
  UY: "Uruguay",
  UZ: "Uzbekistan",
  VU: "Vanuatu",
  VE: "Venezuela",
  VN: "Vietnam",
  YE: "Yemen",
  ZM: "Zambia",
  ZW: "Zimbabwe"
};




async function tiktokInfo(url) {
  const options = {
    method: 'POST',
    hostname: 'tiktok-media-no-watermark.p.rapidapi.com',
    port: null,
    path: '/v1/social/tiktok/detail/url',
    headers: {
      'x-rapidapi-key': `${randomApiKey}`,
      'x-rapidapi-host': 'tiktok-media-no-watermark.p.rapidapi.com',
      'Content-Type': 'application/json'
    }
  };

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const chunks = [];

      res.on('data', (chunk) => {
        chunks.push(chunk);
      });

      res.on('end', () => {
        const body = Buffer.concat(chunks);
        const data = JSON.parse(body.toString());
        resolve(data);
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(JSON.stringify({ url }));
    req.end();
  });
}

async function main(url) {
  try {
    const info = await tiktokInfo(url);

    
    const author = info.aweme_detail.author.unique_id;
    const nickname = info.aweme_detail.author.nickname;
    const videoId = info.aweme_detail.aweme_id;
    const negara = info.aweme_detail.region;
    const description = info.aweme_detail.desc;
    const kapan = info.aweme_detail.create_time;
    const profil = info.aweme_detail.author.avatar_larger.url_list[0];
    const view = info.aweme_detail.statistics.play_count;
    const like = info.aweme_detail.statistics.digg_count;
    const komen = info.aweme_detail.statistics.comment_count;
    const share = info.aweme_detail.statistics.share_count;
    const favorit = info.aweme_detail.statistics.collect_count;
    const repost = info.aweme_detail.statistics.repost_count;
    const shareWA = info.aweme_detail.statistics.whatsapp_share_count;

const negaranya = countries[negara];
    
    const timestamp = kapan;
    const tanggal = new Date(timestamp * 1000);
    const tahun = tanggal.getFullYear();
    const bulan = tanggal.getMonth() + 1;
    const hari = tanggal.getDate();
    const jam = tanggal.getHours();
    const menit = tanggal.getMinutes();
    const detik = tanggal.getSeconds();

    const Tanggalwaktu = `${tahun}-${bulan.toString().padStart(2, '0')}-${hari.toString().padStart(2, '0')} ${jam.toString().padStart(2, '0')}:${menit.toString().padStart(2, '0')}:${detik.toString().padStart(2, '0')}`;

    return {
      videoId: videoId,
      authorId: info.aweme_detail.author_user_id,
      author: author,
      nickname: nickname,
      region: negaranya,
      title: description,
      createTime: Tanggalwaktu,
      avatar: profil,
      videoInfo: {
        view: view,
        like: like,
        comment: komen,
        share: share,
        favorit: favorit,
        repost: repost,
        shareWA: shareWA
      },
      video: {
        size: info.aweme_detail.video.play_addr_h264.data_size,
        link: info.aweme_detail.video.play_addr_h264.url_list[2]
      },
      mp3: {
        author: info.aweme_detail.music.author,
        cover: info.aweme_detail.music.cover_large.url_list[0],
        title: info.aweme_detail.music.title,
        link: info.aweme_detail.music.play_url.url_list[0]
      }
    };
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = main;
