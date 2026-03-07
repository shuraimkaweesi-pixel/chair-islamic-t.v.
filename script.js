// Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("sw.js")
    .then(() => console.log("Service Worker Registered"))
    .catch((err) => console.log("SW registration failed:", err));
}

// Ask via Email
function sendQuestion() {
  const question = document.getElementById("userQuestion").value;
  if (!question.trim()) {
    document.getElementById("questionStatus").innerText =
      "Please type a question.";
    return;
  }
  window.location.href = `mailto:shuraimkaweesi@gmail.com?subject=Question from Chair Islamic TV&body=${encodeURIComponent(
    question
  )}`;
  document.getElementById("questionStatus").innerText =
    "Opening email client...";
}

// Quran Recitation Logic
const surahs = [
  "Al-Fatiha",
  "Al-Baqarah",
  "Al-Imran",
  "An-Nisa",
  "Al-Ma'idah",
  // …(all 114 names here)
  "Al-Falaq",
  "An-Nas",
];

const surahSelect = document.getElementById("surahSelect");
const reciterSelect = document.getElementById("reciterSelect");
const ayahContainer = document.getElementById("ayahContainer");

// Populate dropdown
surahs.forEach((s, i) => {
  const opt = document.createElement("option");
  opt.value = i + 1;
  opt.text = `${i + 1}. ${s}`;
  surahSelect.append(opt);
});

function openQuranReader() {
  document.getElementById("quranReader").style.display = "block";
}

function closeQuranReader() {
  document.getElementById("quranReader").style.display = "none";
}

const audioBaseURL = "https://everyayah.com/data/";

function getSurahAudioUrl(surah, reciter) {
  return `${audioBaseURL}${reciter}/${String(surah).padStart(3, "0")}.mp3`;
}

surahSelect.addEventListener("change", () => {
  const surahNumber = surahSelect.value;
  const reciter = reciterSelect.value;
  const audioURL = getSurahAudioUrl(surahNumber, reciter);

  if (!surahNumber) {
    ayahContainer.innerHTML = "";
    return;
  }

  ayahContainer.innerHTML = `
    <p style="color:#FFD700;font-weight:bold;">
      Playing Surah ${surahNumber} — ${reciter.toUpperCase()}
    </p>
    <audio controls autoplay src="${audioURL}" style="width:100%;border-radius:10px;">
      Your browser does not support audio.
    </audio>
  `;
});
