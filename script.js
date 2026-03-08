// ===============================
// Chair Islamic TV - Main Script
// ===============================

// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then(() => console.log("Service Worker Registered"))
    .catch((err) => console.log("SW registration failed:", err));
}

// ===============================
// Ask Question via Email
// ===============================
function sendQuestion() {
  const question = document.getElementById("userQuestion").value;

  if (!question.trim()) {
    document.getElementById("questionStatus").innerText =
      "Please type your question first.";
    return;
  }

  window.location.href =
    "mailto:shuraimkaweesi@gmail.com?subject=Question from Chair Islamic TV&body=" +
    encodeURIComponent(question);
}

// ===============================
// Quran Reader Logic
// ===============================

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

// Reciters (working servers)
const reciters = {
  afasy: "https://server8.mp3quran.net/afs/",
  sudais: "https://server7.mp3quran.net/sds/",
  ghamdi: "https://server7.mp3quran.net/s_gmd/"
};

const surahSelect = document.getElementById("surahSelect");
const reciterSelect = document.getElementById("reciterSelect");
const ayahContainer = document.getElementById("ayahContainer");

// Populate Surah Dropdown
if (surahSelect) {
  surahs.forEach((name, index) => {
    const option = document.createElement("option");
    option.value = index + 1;
    option.textContent = `${index + 1}. ${name}`;
    surahSelect.appendChild(option);
  });
}

// Open Quran Reader
function openQuranReader() {
  document.getElementById("quranReader").style.display = "block";
}

// Close Quran Reader
function closeQuranReader() {
  document.getElementById("quranReader").style.display = "none";
}

// Play Surah
surahSelect.addEventListener("change", function () {

  const surahNumber = surahSelect.value;
  const reciterKey = reciterSelect.value;

  if (!surahNumber) return;

  const surahCode = String(surahNumber).padStart(3, "0");
  const audioURL = reciters[reciterKey] + surahCode + ".mp3";

  ayahContainer.innerHTML = `
    <h3>Playing Surah ${surahs[surahNumber - 1]}</h3>
    <audio controls autoplay style="width:100%;">
      <source src="${audioURL}" type="audio/mpeg">
    </audio>
  `;
});
