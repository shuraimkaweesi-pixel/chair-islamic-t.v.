// ===============================
// CHAIR ISLAMIC TV MAIN SCRIPT - V3.2
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  initPWA();
  loadYoutubeVideos();
  loadHadith();
  initSurahList();
  startAdhanSystem();
  initLetters();
  initAudioUnlock();
});

// ===============================
// PWA
// ===============================
let deferredPrompt;

function initPWA() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(e => console.log("SW failed:", e));
  }

  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = document.getElementById("installBtn");
    if (btn) {
      btn.style.display = "block";
      btn.onclick = async () => {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
        btn.style.display = "none";
      };
    }
  });
}

// ===============================
// YOUTUBE
// ===============================
function loadYoutubeVideos() {
  const box = document.getElementById("youtubeVideos");
  if (!box) return;

  const vids = ["ZGwG7UBlFCc", "zGIBIOMA0PQ"];
  box.innerHTML = vids.map(id => `
    <iframe width="100%" height="315"
    src="https://www.youtube.com/embed/${id}"
    title="YouTube video"
    frameborder="0"
    allowfullscreen></iframe><br><br>
  `).join("");
}

// ===============================
// DONATION
// ===============================
let hasCopied = false;

function copyMerchant() {
  navigator.clipboard.writeText("7037856").then(() => {
    hasCopied = true;
    alert("✅ Merchant number copied. You can now donate.");
    const btn = document.getElementById("donateBtn");
    if (btn) btn.style.display = "block";
  }).catch(() => {
    alert("Copy failed. Please copy manually: 7037856");
  });
}

function donate() {
  if (!hasCopied) {
    alert("⚠️ Please copy the merchant number first");
    return;
  }

  const amount = document.getElementById("amount").value;
  if (!amount || amount < 1000) {
    alert("Enter valid amount (minimum 1000 UGX)");
    return;
  }

  const ussd = `*185*9*7037856*${amount}#`;
  const a = document.createElement('a');
  a.href = "tel:" + encodeURIComponent(ussd);
  a.click();
}

// ===============================
// HADITH
// ===============================
async function loadHadith() {
  const box = document.getElementById("hadithBox");
  if (!box) return;

  try {
    const res = await fetch("hadiths.json"); // Ensure this matches your filename
    if (!res.ok) throw new Error("HTTP " + res.status);
    
    const data = await res.json();
    
    // This line handles BOTH formats (if it's a list OR if it's wrapped in a 'hadiths' key)
    const list = Array.isArray(data) ? data : data.hadiths;
    
    if (!list || list.length === 0) throw new Error("No data found");

    const h = list[Math.floor(Math.random() * list.length)];
    
    // Use optional chaining or defaults to prevent "undefined" appearing on screen
    box.innerHTML = `
      <div class="arabic" dir="rtl">${h.arabic || h.arab || ''}</div>
      <div class="translation">${h.english || h.en || ''}</div>
      <div class="reference" style="font-size: 0.8em; opacity: 0.7;">${h.reference || ''}</div>
    `;
  } catch (err) {
    console.error("Hadith error:", err);
    box.innerText = "Prophetic wisdom loading...";
  }
}

// ===============================
// SURAH LIST
// ===============================
function initSurahList() {
  const select = document.getElementById("surahSelect");
  if (!select) return;

  const names = ["Al-Fatiha", "Al-Baqarah", "Aal-Imran", "An-Nisa", "Al-Ma'idah", "Al-An'am", "Al-A'raf", "Al-Anfal", "At-Tawbah", "Yunus", "Hud", "Yusuf", "Ar-Ra'd", "Ibrahim", "Al-Hijr", "An-Nahl", "Al-Isra", "Al-Kahf", "Maryam", "Ta-Ha", "Al-Anbiya", "Al-Hajj", "Al-Mu’minun", "An-Nur", "Al-Furqan", "Ash-Shu'ara", "An-Naml", "Al-Qasas", "Al-Ankabut", "Ar-Rum", "Luqman", "As-Sajdah", "Al-Ahzab", "Saba", "Fatir", "Ya-Sin", "As-Saffat", "Sad", "Az-Zumar", "Ghafir", "Fussilat", "Ash-Shura", "Az-Zukhruf", "Ad-Dukhan", "Al-Jathiyah", "Al-Ahqaf", "Muhammad", "Al-Fath", "Al-Hujurat", "Qaf", "Adh-Dhariyat", "At-Tur", "An-Najm", "Al-Qamar", "Ar-Rahman", "Al-Waqi'ah", "Al-Hadid", "Al-Mujadila", "Al-Hashr", "Al-Mumtahanah", "As-Saff", "Al-Jumu’ah", "Al-Munafiqun", "At-Taghabun", "At-Talaq", "At-Tahrim", "Al-Mulk", "Al-Qalam", "Al-Haqqah", "Al-Ma'arij", "Nuh", "Al-Jinn", "Al-Muzzammil", "Al-Muddathir", "Al-Qiyamah", "Al-Insan", "Al-Mursalat", "An-Naba", "An-Nazi'at", "Abasa", "At-Takwir", "Al-Infitar", "Al-Mutaffifin", "Al-Inshiqaq", "Al-Buruj", "At-Tariq", "Al-A'la", "Al-Ghashiyah", "Al-Fajr", "Al-Balad", "Ash-Shams", "Al-Layl", "Ad-Duha", "Ash-Sharh", "At-Tin", "Al-Alaq", "Al-Qadr", "Al-Bayyinah", "Az-Zalzalah", "Al-Adiyat", "Al-Qari'ah", "At-Takathur", "Al-Asr", "Al-Humazah", "Al-Fil", "Quraysh", "Al-Ma'un", "Al-Kawthar", "Al-Kafirun", "An-Nasr", "Al-Masad", "Al-Ikhlas", "Al-Falaq", "An-Nas"];

  names.forEach((n, i) => {
    const opt = document.createElement("option");
    opt.value = i + 1;
    opt.textContent = (i + 1) + " - " + n;
    select.appendChild(opt);
  });
}

// ===============================
// LOAD SURAH
// ===============================
async function loadSurah() {
  const num = parseInt(document.getElementById("surahSelect").value);
  if (!num) { alert("Select a Surah"); return; }

  const quranText = document.getElementById("quranText");
  if (quranText) quranText.innerHTML = "Loading...";
  stopAllAudio();

  try {
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${num}/editions/quran-uthmani,en.sahih`);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    const ar = data.data[0].ayahs;
    const en = data.data[1].ayahs;
    let html = "";

    for (let i = 0; i < ar.length; i++) {
      html += `
      <div class="ayah" onclick="playAyah(${num},${i + 1},this)">
        <div class="arabic">${ar[i].text} ﴿${i+1}﴾</div>
        <div class="translation">${i + 1}. ${en[i].text}</div>
      </div>`;
    }
    if (quranText) quranText.innerHTML = html;
  } catch (err) {
    console.log("Surah error:", err);
    if (quranText) quranText.innerHTML = "Failed to load Surah";
  }
}

// ===============================
// UNIFIED AUDIO MANAGEMENT
// ===============================
let currentAudio = null;
let letterAudio = null;
let adhanAudio = null;
let audioUnlocked = false;
let currentSurah = null;
let currentAyah = null;
let ayahElements = [];
let isPlayingSequence = false;
let isLetterPaused = false;

function stopAllAudio() {
  if (currentAudio) { currentAudio.pause(); currentAudio = null; }
  if (letterAudio) { letterAudio.pause(); letterAudio = null; }
  speechSynthesis.cancel();
  isPlayingSequence = false;
  isLetterPaused = false;
  document.querySelectorAll(".ayah,.lesson").forEach(a => a.classList.remove("playing", "active"));
}

// ===============================
// AYAH AUDIO - WORKING RECITERS
// ===============================
function getAudioUrl(reciter, surah, ayah) {
  const s = String(surah).padStart(3, "0");
  const a = String(ayah).padStart(3, "0");
  return `https://everyayah.com/data/${reciter}/${s}${a}.mp3`;
}

function playAyah(surah, ayah, el) {
  stopAllAudio();

  if (currentAudio && currentSurah === surah && currentAyah === ayah) {
    currentAudio.paused? currentAudio.play() : currentAudio.pause();
    return;
  }

  document.querySelectorAll(".ayah").forEach(a => a.classList.remove("playing"));
  el.classList.add("playing");
  el.scrollIntoView({behavior:"smooth", block:"center"});

  currentSurah = surah;
  currentAyah = ayah;
  ayahElements = document.querySelectorAll(".ayah");
  isPlayingSequence = true;

  const reciter = document.getElementById("reciterSelect").value || "Alafasy_128kbps";
  const url = getAudioUrl(reciter, surah, ayah);

  currentAudio = new Audio(url);

  currentAudio.onerror = () => {
    console.log(`Audio failed for ${reciter}`);
    el.classList.remove("playing");
    if(isPlayingSequence) playNextAyah();
  };

  currentAudio.play().catch(e => {
    console.log("Ayah play error:", e);
    alert("Tap the screen once to enable audio, then try again.");
  });

  currentAudio.onended = () => {
    if(isPlayingSequence) playNextAyah();
  };
}

function playNextAyah(){
  if(!isPlayingSequence) return;
  const next = currentAyah + 1;
  if (ayahElements[next - 1]) {
    playAyah(currentSurah, next, ayahElements[next - 1]);
  } else {
    stopAllAudio();
  }
}
// ===============================
// ADHAN SYSTEM - OPTIMIZED
// ===============================
let prayerTimings = {};
let lastAdhanPlayed = "";
let lastAdhanDate = "";
let adhanCheckInterval = null;

// Helper to ensure "HH:mm" format is clean
const cleanTime = (timeStr) => timeStr ? timeStr.trim().slice(0, 5) : "";

async function startAdhanSystem() {
  // 1. Load from cache first for immediate protection
  const cached = loadAdhanCache();
  if (cached) {
    prayerTimings = cached;
  }

  // 2. Start the timer ONLY ONCE
  if (!adhanCheckInterval) {
    adhanCheckInterval = setInterval(checkAdhanTime, 30000); // 30s is plenty
  }

  // 3. Fetch fresh times
  try {
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=Kampala&country=Uganda&method=2`);
    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();
    const t = data.data.timings;

    prayerTimings = {
      Fajr: cleanTime(t.Fajr),
      Dhuhr: cleanTime(t.Dhuhr),
      Asr: cleanTime(t.Asr),
      Maghrib: cleanTime(t.Maghrib),
      Isha: cleanTime(t.Isha)
    };

    saveAdhanCache(prayerTimings);
    console.log("Prayer times updated:", prayerTimings);

  } catch (err) {
    console.log("Adhan fetch error:", err);
  }
}

function checkAdhanTime() {
  if (!Object.keys(prayerTimings).length) return;

  const now = new Date();
  const today = now.toDateString();
  const currentTime = now.getHours().toString().padStart(2, "0") + ":" + 
                      now.getMinutes().toString().padStart(2, "0");

  // Reset tracker for a new day
  if (lastAdhanDate !== today) {
    lastAdhanPlayed = "";
    lastAdhanDate = today;
  }

  for (let p in prayerTimings) {
    if (currentTime === prayerTimings[p] && lastAdhanPlayed !== p) {
      triggerAdhan(p);
      lastAdhanPlayed = p;
    }
  }
}

function triggerAdhan(prayer) {
  // Use the unified stop to clear Quran or Yasarnah audio first
  stopAllAudio();

  if (adhanAudio && audioUnlocked) {
    adhanAudio.currentTime = 0;
    // Set volume to max for Adhan specifically
    adhanAudio.volume = 1.0; 
    
    adhanAudio.play().then(() => {
      console.log(`Playing Adhan for ${prayer}`);
      // Optional: Show a stop button in your UI here
      const stopBtn = document.getElementById("stopAdhanBtn");
      if(stopBtn) stopBtn.style.display = "block";
    }).catch(e => {
      console.log("Adhan blocked:", e);
      alert("Time for " + prayer + "! (Tap to enable audio)");
    });
  } else {
    // Fallback if the user hasn't clicked anything since page load
    alert("🕌 It is time for " + prayer);
  }

  // Standard Notification Logic
  if (Notification.permission === "granted") {
    new Notification("🕌 Prayer Time", {
      body: `It's time for ${prayer} in Kampala`,
      icon: "logo.png"
    });
  }

  if (navigator.vibrate) navigator.vibrate([500, 300, 500]);
}

// Add this to your "Unified Audio Management" section to handle stopping Adhan
function stopAdhan() {
    if (adhanAudio) {
        adhanAudio.pause();
        adhanAudio.currentTime = 0;
    }
    const stopBtn = document.getElementById("stopAdhanBtn");
    if(stopBtn) stopBtn.style.display = "none";
}

// =====================
// DATA: ALL YASARNAH PAGES
// =====================
const yasarnahPages = [
  {
    title: "Dars 1: Alif - Yaa",
    info: "Single Letters",
    letters: [
      {a:"ا", name:"Alif", file:"blog/alif.mp3"},
      {a:"ب", name:"Ba", file:"blog/baa.mp3"},
      {a:"ت", name:"Ta", file:"blog/taa.mp3"},
      {a:"ث", name:"Tha", file:"blog/thaa.mp3"},
      {a:"ج", name:"Jim", file:"blog/jeem.mp3"},
      {a:"ح", name:"Ha", file:"blog/haa.mp3"},
      {a:"خ", name:"Kha", file:"blog/khaa.mp3"},
      {a:"د", name:"Dal", file:"blog/daal.mp3"}
      // ... Add all letters for Page 1
    ]
  },
  {
    title: "Dars 2: Fatha",
    info: "Short Vowels (Zabar)",
    letters: [
      {a:"اَ", name:"Alif Fatha", file:"blog/a_fatha.mp3"},
      {a:"بَ", name:"Ba Fatha", file:"blog/ba_fatha.mp3"},
      {a:"تَ", name:"Ta Fatha", file:"blog/ta_fatha.mp3"}
    ]
  }
];

let currentDarsIndex = 0;
let currentLetterIndex = null;
let letterRepeat = 0;
let letterRepeatCount = 3;
let isPlayingSequence = false;
let isLetterPaused = false;

// =====================
// CORE FUNCTIONS
// =====================

function loadDars(index) {
  stopLetterLesson();
  currentDarsIndex = index;
  const dars = yasarnahPages[index];
  
  // Update Header
  document.getElementById("darsTitle").innerText = dars.title;
  document.getElementById("darsInfo").innerText = dars.info;
  document.getElementById("darsCounter").innerText = `Page ${index + 1} / ${yasarnahPages.length}`;
  
  // Build Grid
  const box = document.getElementById("lessonBox");
  box.innerHTML = ""; 
  dars.letters.forEach((l, i) => {
    box.innerHTML += `
      <div class="lesson" id="letter-${i}" onclick="startLetter(${i})">
        <div class="arabic">${l.a}</div>
        <div class="name">${l.name}</div>
      </div>
    `;
  });
}

function changeDars(step) {
  let newIndex = currentDarsIndex + step;
  if (newIndex >= 0 && newIndex < yasarnahPages.length) {
    loadDars(newIndex);
  }
}

function startLetter(i) {
  stopLetterLesson();
  currentLetterIndex = i;
  letterRepeat = 0;
  isPlayingSequence = false; // Playing only one letter
  playCurrentLetter();
}

function playCurrentLetter() {
  const dars = yasarnahPages[currentDarsIndex];
  if (currentLetterIndex === null || currentLetterIndex >= dars.letters.length) {
    stopLetterLesson();
    return;
  }

  const letter = dars.letters[currentLetterIndex];
  highlightLetter(currentLetterIndex);
  updateLetterProgress();

  // AUDIO LOGIC: Playing MP3 file
  const audio = new Audio(letter.file);
  
  audio.onended = () => {
    if (!isPlayingSequence && letterRepeat === 0) {
        // Just one tap play
        setTimeout(() => {
             document.querySelectorAll(".lesson").forEach(l => l.classList.remove("active"));
        }, 500);
        return;
    }

    letterRepeat++;
    if (letterRepeat < letterRepeatCount) {
      setTimeout(playCurrentLetter, 500);
    } else {
      if (isPlayingSequence) {
        currentLetterIndex++;
        letterRepeat = 0;
        setTimeout(playCurrentLetter, 800);
      } else {
        stopLetterLesson();
      }
    }
  };

  audio.play().catch(e => {
      console.error("Audio error:", e);
      // Fallback to Speech Synthesis if MP3 fails
      useSpeechFallback(letter.a);
  });
}

function useSpeechFallback(text) {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.onend = () => { /* repeat logic here if needed */ };
    speechSynthesis.speak(utterance);
}

// =====================
// UI HELPERS
// =====================

function highlightLetter(i) {
  document.querySelectorAll(".lesson").forEach((el, index) => {
    el.classList.toggle("active", index === i);
  });
}

function setRepeat(num) {
  letterRepeatCount = num;
  document.getElementById("letterProgress").textContent = `Repeat set to ${num}x`;
}

function toggleLetterSequence() {
  if (isPlayingSequence) {
    stopLetterLesson();
  } else {
    currentLetterIndex = 0;
    letterRepeat = 0;
    isPlayingSequence = true;
    document.getElementById("letterPlayBtn").textContent = "⏸ Stop All";
    playCurrentLetter();
  }
}

function stopLetterLesson() {
  isPlayingSequence = false;
  currentLetterIndex = null;
  document.getElementById("letterPlayBtn").textContent = "▶ Play All";
  document.querySelectorAll(".lesson").forEach(l => l.classList.remove("active"));
}

function updateLetterProgress() {
  const progress = document.getElementById("letterProgress");
  const dars = yasarnahPages[currentDarsIndex];
  if (progress && currentLetterIndex !== null) {
    progress.textContent = `Playing: ${dars.letters[currentLetterIndex].name}`;
  }
}

// Initial Load
loadDars(0);
