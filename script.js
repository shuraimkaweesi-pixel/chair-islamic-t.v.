// ----------------------
// script.js - Chair Islamic TV Full Features (Updated)
// ----------------------

// ----------------------
// 1. Quran Reader
// ----------------------
const surahSelect = document.getElementById('surahSelect');
const reciterSelect = document.getElementById('reciterSelect');
const quranText = document.getElementById('quranText');

async function loadSurahList() {
  // All 114 Surahs
  const surahs = [
    { number: 1, name: "الفاتحة", english: "Al-Fatiha" },
    { number: 2, name: "البقرة", english: "Al-Baqarah" },
    { number: 3, name: "آل عمران", english: "Aal-i-Imran" },
    { number: 4, name: "النساء", english: "An-Nisa" },
    { number: 5, name: "المائدة", english: "Al-Ma'idah" },
    { number: 6, name: "الأنعام", english: "Al-An'am" },
    { number: 7, name: "الأعراف", english: "Al-A'raf" },
    { number: 8, name: "الأنفال", english: "Al-Anfal" },
    { number: 9, name: "التوبة", english: "At-Tawbah" },
    { number: 10, name: "يونس", english: "Yunus" },
    // ... add all surahs up to 114 here
  ];

  surahs.forEach(s => {
    const option = document.createElement('option');
    option.value = s.number.toString().padStart(3, '0');
    option.textContent = `${s.number}. ${s.name} (${s.english})`;
    surahSelect.appendChild(option);
  });
}

// Load Surah with ayah numbering and audio
async function loadSurah() {
  const surahNum = surahSelect.value;
  const reciter = reciterSelect.value;
  if (!surahNum) return alert("Please select a Surah!");

  try {
    const res = await fetch(`/quran/${surahNum}.json`);
    const data = await res.json();

    quranText.innerHTML = '';

    data.ayahs.forEach((a, index) => {
      const ayahDiv = document.createElement('div');
      ayahDiv.classList.add('ayah');

      // Arabic + numbering
      const arabicDiv = document.createElement('div');
      arabicDiv.classList.add('arabic');
      arabicDiv.textContent = `${index + 1}. ${a.text}`;

      // English translation + numbering
      const transDiv = document.createElement('div');
      transDiv.classList.add('translation');
      transDiv.textContent = `${index + 1}. ${a.translation}`;

      // Audio per ayah
      const audioDiv = document.createElement('div');
      audioDiv.classList.add('audio');
      if (a.audio && a.audio[reciter]) {
        audioDiv.innerHTML = `
          <audio controls style="width:100%">
            <source src="${a.audio[reciter]}" type="audio/mpeg">
          </audio>
        `;
      }

      ayahDiv.appendChild(arabicDiv);
      ayahDiv.appendChild(transDiv);
      ayahDiv.appendChild(audioDiv);

      quranText.appendChild(ayahDiv);
    });

  } catch (err) {
    console.error("Error loading Surah:", err);
    alert("Failed to load Quran Surah. Check your JSON files.");
  }
}

// ----------------------
// 2. Auto Latest YouTube Video
// ----------------------
const youtubeDiv = document.getElementById('youtubeVideos');

async function loadLatestYouTube() {
  try {
    const channelId = "UC5_wjk8WksHOOZHflU9heJQ";
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    const response = await fetch(proxyUrl);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const latestVideoId = data.items[0].link.split('v=')[1];
      youtubeDiv.innerHTML = `
        <iframe width="100%" height="315" src="https://www.youtube.com/embed/${latestVideoId}" frameborder="0" allowfullscreen></iframe>
      `;
    } else {
      youtubeDiv.innerHTML = "<p>No videos found.</p>";
    }
  } catch (err) {
    console.error("Error fetching latest YouTube video:", err);
    youtubeDiv.innerHTML = "<p>Failed to load latest video.</p>";
  }
}

// ----------------------
// 3. Prayer Times
// ----------------------
async function getPrayerTimes() {
  const city = document.getElementById('cityInput').value;
  if (!city) return alert("Enter a city!");

  try {
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=&method=2`);
    const data = await res.json();
    const timings = data.data.timings;
    const container = document.getElementById('prayerTimes');
    container.innerHTML = `
      <p>Fajr: ${timings.Fajr}</p>
      <p>Dhuhr: ${timings.Dhuhr}</p>
      <p>Asr: ${timings.Asr}</p>
      <p>Maghrib: ${timings.Maghrib}</p>
      <p>Isha: ${timings.Isha}</p>
    `;
  } catch (err) {
    console.error(err);
    alert("Failed to fetch prayer times.");
  }
}

// ----------------------
// 4. Ask a Question via Email
// ----------------------
function sendQuestion() {
  const name = document.getElementById('userName').value;
  const email = document.getElementById('userEmail').value;
  const question = document.getElementById('userQuestion').value;
  if (!name || !email || !question) return alert("All fields are required!");

  window.location.href = `mailto:shuraimkaweesi@gmail.com?subject=Question from ${name}&body=${encodeURIComponent(question + "\n\nEmail: " + email)}`;
  document.getElementById('questionStatus').textContent = "Email opened in your mail client.";
}

// ----------------------
// 5. Initialize Everything
// ----------------------
document.addEventListener('DOMContentLoaded', () => {
  loadSurahList();
  loadLatestYouTube();

  surahSelect.addEventListener('change', loadSurah);
  reciterSelect.addEventListener('change', loadSurah);
});
