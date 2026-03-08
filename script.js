// ----------------------
// script.js - Chair Islamic TV Full Features (Updated)
// ----------------------

// ----------------------
// 1. Quran Reader (Full)
// ----------------------
const surahSelect = document.getElementById('surahSelect');
const reciterSelect = document.getElementById('reciterSelect');
const quranText = document.getElementById('quranText');

let quranData = null;

// Load complete Quran JSON
async function loadQuranData() {
  try {
    const res = await fetch('quran-complete.json'); // Root JSON
    quranData = await res.json();
    populateSurahList();
  } catch (err) {
    console.error("Failed to load Quran JSON:", err);
    alert("Failed to load Quran JSON. Make sure 'quran-complete.json' is in the root.");
  }
}

// Populate dropdown with all 114 Surahs
function populateSurahList() {
  quranData.surahs.forEach(s => {
    const option = document.createElement('option');
    option.value = s.number;
    option.textContent = `${s.number}. ${s.name} (${s.english})`;
    surahSelect.appendChild(option);
  });
}

// Load selected surah and display ayahs
function loadSurah() {
  const surahNum = parseInt(surahSelect.value);
  const reciter = reciterSelect.value;
  if (!surahNum) return;

  const surah = quranData.surahs.find(s => s.number === surahNum);
  if (!surah) return alert("Surah not found!");

  quranText.innerHTML = '';

  surah.ayahs.forEach((a, index) => {
    const ayahDiv = document.createElement('div');
    ayahDiv.classList.add('ayah');
    ayahDiv.innerHTML = `
      <div class="arabic"><strong>${index + 1}.</strong> ${a.text}</div>
      <div class="translation"><strong>${index + 1}.</strong> ${a.translation}</div>
      <div class="audio">
        <audio controls style="width:100%">
          <source src="${a.audio[reciter]}" type="audio/mpeg">
        </audio>
      </div>
    `;
    quranText.appendChild(ayahDiv);
  });
}

// ----------------------
// 2. Auto Latest YouTube Video
// ----------------------
const youtubeDiv = document.getElementById('youtubeVideos');

async function loadLatestYouTube() {
  try {
    const channelId = "UC5_wjk8WksHOOZHflU9heJQ"; // Your channel ID

    // Using RSS feed via rss2json proxy
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
  loadQuranData();
  surahSelect.addEventListener('change', loadSurah);
  reciterSelect.addEventListener('change', loadSurah);
  loadLatestYouTube();
});
