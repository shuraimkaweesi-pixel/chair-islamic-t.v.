// ============================
// Ask Question via Email
// ============================
function sendQuestion() {
  const question = document.getElementById("userQuestion").value.trim();
  if (!question) {
    document.getElementById("questionStatus").innerText = "⚠️ Please type your question first.";
    return;
  }
  const mailtoLink = `mailto:shuraimkaweesi@gmail.com?subject=Question from Chair Islamic TV&body=${encodeURIComponent(question)}`;
  window.location.href = mailtoLink;
  document.getElementById("questionStatus").innerText = "✅ Your email client should open now!";
}

// ============================
// Radio Animation
// ============================
const radio = document.getElementById("radioPlayer");
radio.addEventListener("play", () => radio.classList.add("playing"));
radio.addEventListener("pause", () => radio.classList.remove("playing"));
radio.addEventListener("ended", () => radio.classList.remove("playing"));

// ============================
// Quran Section Setup
// ============================

// Full Surah List
const surahList = [
  {number:1,name:"Al-Fatiha"},{number:2,name:"Al-Baqarah"},{number:3,name:"Aali Imran"},{number:4,name:"An-Nisa"},{number:5,name:"Al-Maida"},
  {number:6,name:"Al-An'am"},{number:7,name:"Al-A'raf"},{number:8,name:"Al-Anfal"},{number:9,name:"At-Tawba"},{number:10,name:"Yunus"},
  {number:11,name:"Hud"},{number:12,name:"Yusuf"},{number:13,name:"Ar-Ra'd"},{number:14,name:"Ibrahim"},{number:15,name:"Al-Hijr"},
  {number:16,name:"An-Nahl"},{number:17,name:"Al-Isra"},{number:18,name:"Al-Kahf"},{number:19,name:"Maryam"},{number:20,name:"Ta-Ha"},
  {number:21,name:"Al-Anbiya"},{number:22,name:"Al-Hajj"},{number:23,name:"Al-Mu'minun"},{number:24,name:"An-Nur"},{number:25,name:"Al-Furqan"},
  {number:26,name:"Ash-Shu'ara"},{number:27,name:"An-Naml"},{number:28,name:"Al-Qasas"},{number:29,name:"Al-Ankabut"},{number:30,name:"Ar-Rum"},
  {number:31,name:"Luqman"},{number:32,name:"As-Sajda"},{number:33,name:"Al-Ahzab"},{number:34,name:"Saba"},{number:35,name:"Fatir"},
  {number:36,name:"Ya-Sin"},{number:37,name:"As-Saffat"},{number:38,name:"Sad"},{number:39,name:"Az-Zumar"},{number:40,name:"Ghafir"},
  {number:41,name:"Fussilat"},{number:42,name:"Ash-Shura"},{number:43,name:"Az-Zukhruf"},{number:44,name:"Ad-Dukhan"},{number:45,name:"Al-Jathiya"},
  {number:46,name:"Al-Ahqaf"},{number:47,name:"Muhammad"},{number:48,name:"Al-Fath"},{number:49,name:"Al-Hujurat"},{number:50,name:"Qaf"},
  {number:51,name:"Adh-Dhariyat"},{number:52,name:"At-Tur"},{number:53,name:"An-Najm"},{number:54,name:"Al-Qamar"},{number:55,name:"Ar-Rahman"},
  {number:56,name:"Al-Waqia"},{number:57,name:"Al-Hadid"},{number:58,name:"Al-Mujadila"},{number:59,name:"Al-Hashr"},{number:60,name:"Al-Mumtahana"},
  {number:61,name:"As-Saff"},{number:62,name:"Al-Jumu'a"},{number:63,name:"Al-Munafiqun"},{number:64,name:"At-Taghabun"},{number:65,name:"At-Talaq"},
  {number:66,name:"At-Tahrim"},{number:67,name:"Al-Mulk"},{number:68,name:"Al-Qalam"},{number:69,name:"Al-Haqqa"},{number:70,name:"Al-Maarij"},
  {number:71,name:"Nuh"},{number:72,name:"Al-Jinn"},{number:73,name:"Al-Muzzammil"},{number:74,name:"Al-Muddaththir"},{number:75,name:"Al-Qiyama"},
  {number:76,name:"Al-Insan"},{number:77,name:"Al-Mursalat"},{number:78,name:"An-Naba"},{number:79,name:"An-Nazi'at"},{number:80,name:"Abasa"},
  {number:81,name:"At-Takwir"},{number:82,name:"Al-Infitar"},{number:83,name:"Al-Mutaffifin"},{number:84,name:"Al-Inshiqaq"},{number:85,name:"Al-Buruj"},
  {number:86,name:"At-Tariq"},{number:87,name:"Al-Ala"},{number:88,name:"Al-Ghashiya"},{number:89,name:"Al-Fajr"},{number:90,name:"Al-Balad"},
  {number:91,name:"Ash-Shams"},{number:92,name:"Al-Lail"},{number:93,name:"Ad-Duha"},{number:94,name:"Ash-Sharh"},{number:95,name:"At-Tin"},
  {number:96,name:"Al-Alaq"},{number:97,name:"Al-Qadr"},{number:98,name:"Al-Bayyinah"},{number:99,name:"Az-Zalzala"},{number:100,name:"Al-Adiyat"},
  {number:101,name:"Al-Qaria"},{number:102,name:"At-Takathur"},{number:103,name:"Al-Asr"},{number:104,name:"Al-Humaza"},{number:105,name:"Al-Fil"},
  {number:106,name:"Quraish"},{number:107,name:"Al-Maun"},{number:108,name:"Al-Kawthar"},{number:109,name:"Al-Kafirun"},{number:110,name:"An-Nasr"},
  {number:111,name:"Al-Masad"},{number:112,name:"Al-Ikhlas"},{number:113,name:"Al-Falaq"},{number:114,name:"An-Nas"}
];

const surahSelect = document.getElementById("surahSelect");
const reciterSelect = document.getElementById("reciterSelect");
const ayahContainer = document.getElementById("ayahContainer");

// Populate Surah Dropdown
surahList.forEach(s => {
  const opt = document.createElement("option");
  opt.value = s.number;
  opt.text = s.number + " - " + s.name;
  surahSelect.add(opt);
});

// Open/Close Quran Reader
function openQuranReader() { document.getElementById("quranReader").style.display = "block"; loadSurah(); }
function closeQuranReader() { document.getElementById("quranReader").style.display = "none"; }

// Load Surah + Translation + Audio
function loadSurah() {
  const surah = surahSelect.value;
  const reciter = reciterSelect.value;
  if (!surah) return;
  ayahContainer.innerHTML = "Loading...";
  fetch(`https://api.alquran.cloud/v1/surah/${surah}/en.asad`)
    .then(res => res.json())
    .then(data => {
      ayahContainer.innerHTML = "";
      data.data.ayahs.forEach(a => {
        const div = document.createElement("div");
        div.className = "ayah";
        div.innerHTML = `<div class="arabic">${a.text}</div>
          <div class="translation">${a.translation || ""}</div>
          <button class="audioBtn" onclick="playAyah(${surah},${a.numberInSurah},'${reciter}')">▶️ Play Audio</button>`;
        ayahContainer.appendChild(div);
      });
    });
}

// Play Quran Audio
function playAyah(surah, ayah, reciter) {
  const audioUrl = `https://everyayah.com/data/${reciter}/${String(surah).padStart(3,'0')}${String(ayah).padStart(3,'0')}.mp3`;
  const audio = new Audio(audioUrl);
  audio.play();
}

// Event Listeners
surahSelect.addEventListener("change", loadSurah);
reciterSelect.addEventListener("change", loadSurah);

// ============================
// PWA Service Worker
// ============================
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js")
    .then(() => console.log("Service Worker Registered"))
    .catch(err => console.log("SW registration failed:", err));
}
