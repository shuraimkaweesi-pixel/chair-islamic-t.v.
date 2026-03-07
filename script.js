// ==============================
// Chair Islamic TV - Full Script
// ==============================

// Register Service Worker (PWA offline caching)
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log('Service Worker Registered'))
    .catch((err) => console.log('SW registration failed:', err));
}

// Ask a question via email
function sendQuestion() {
  const question = document.getElementById('userQuestion').value;
  if (!question.trim()) {
    document.getElementById('questionStatus').innerText = 'Please type a question.';
    return;
  }
  window.location.href = `mailto:shuraimkaweesi@gmail.com?subject=Question from Chair Islamic TV&body=${encodeURIComponent(question)}`;
  document.getElementById('questionStatus').innerText = 'Opening email client...';
}

// ==============================
// Quran Reader Logic
// ==============================

// Full 114 Surah Names
const surahs = [
"Al-Fatiha","Al-Baqarah","Al-Imran","An-Nisa","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah","Yunus",
"Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha",
"Al-Anbiya","Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas","Al-Ankabut","Ar-Rum",
"Luqman","As-Sajda","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir",
"Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf",
"Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqia","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahina",
"As-Saff","Al-Jumua","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haaqqa","Al-Maarij",
"Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyama","Al-Insan","Al-Mursalat","An-Naba","An-Naziat","Abasa",
"At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-Ala","Al-Ghashiyah","Al-Fajr","Al-Balad",
"Ash-Shams","Al-Lail","Ad-Dhuha","Ash-Sharh","At-Tin","Al-Alaq","Al-Qadr","Al-Bayyinah","Az-Zalzalah","Al-Adiyat",
"Al-Qaria","At-Takathur","Al-Asr","Al-Humazah","Al-Fil","Quraish","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr",
"Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"
];

// DOM Elements
const surahSelect = document.getElementById("surahSelect");
const reciterSelect = document.getElementById("reciterSelect");
const ayahContainer = document.getElementById("ayahContainer");

// Populate Surah dropdown
surahs.forEach((s, i) => {
  const opt = document.createElement("option");
  opt.value = i + 1;
  opt.text = `${i + 1}. ${s}`;
  surahSelect.appendChild(opt);
});

// Open/Close Quran Reader
function openQuranReader() {
  document.getElementById("quranReader").style.display = "block";
}

function closeQuranReader() {
  document.getElementById("quranReader").style.display = "none";
}

// Quran Audio URLs
const audioBaseURL = "https://everyayah.com/data/";

function getSurahAudioUrl(surah, reciter) {
  // surah number padded 001-114
  return `${audioBaseURL}${reciter}/${String(surah).padStart(3, '0')}.mp3`;
}

// Handle Surah selection change
surahSelect.addEventListener("change", () => {
  const surahNumber = surahSelect.value;
  const reciter = reciterSelect.value;

  if (!surahNumber) {
    ayahContainer.innerHTML = "";
    return;
  }

  const audioURL = getSurahAudioUrl(surahNumber, reciter);
  ayahContainer.innerHTML = `
    <p style="color:#FFD700;font-weight:bold;">Playing Surah ${surahNumber} — ${reciter.toUpperCase()}</p>
    <audio controls autoplay src="${audioURL}" style="width:100%; border-radius:10px;">
      Your browser does not support audio.
    </audio>
  `;
});
