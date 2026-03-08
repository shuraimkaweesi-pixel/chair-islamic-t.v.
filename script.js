// ----------------------
// script.js - Chair Islamic TV Full Features
// ----------------------

// ----------------------
// 1. Quran Reader
// ----------------------
const surahSelect = document.getElementById('surahSelect');
const reciterSelect = document.getElementById('reciterSelect');
const audioPlayer = document.getElementById('audioPlayer');
const quranText = document.getElementById('quranText');

const reciters = {
  Afasy: "afasy",
  Baset: "baset",
  Ghamdi: "ghamdi"
};

// Load Surah list (1-114)
async function loadSurahList() {
  try {
    const res = await fetch('./quran_en.json'); // Load full Quran JSON
    const quranData = await res.json();

    quranData.forEach(surah => {
      const option = document.createElement('option');
      option.value = surah.number;
      option.textContent = `${surah.number}. ${surah.name} (${surah.englishName})`;
      surahSelect.appendChild(option);
    });

    // Save data globally
    window.quranData = quranData;
  } catch (err) {
    console.error("Failed to load Quran JSON:", err);
    alert("Failed to load Quran. Make sure quran_en.json is in root.");
  }
}

// Load selected Surah
function loadSurah() {
  const surahNum = parseInt(surahSelect.value);
  const reciter = reciterSelect.value;

  if (!surahNum) return alert("Please select a Surah!");
  if (!window.quranData) return alert("Quran data not loaded yet.");

  const surah = window.quranData.find(s => s.number === surahNum);
  if (!surah) return alert("Surah not found in JSON.");

  // Display Arabic + English ayahs
  quranText.innerHTML = '';
  surah.ayahs.forEach(a => {
    const ayahDiv = document.createElement('div');
    ayahDiv.className = 'ayah';
    ayahDiv.innerHTML = `
      <div class="ayah-number">[${a.numberInSurah}]</div>
      <div class="arabic">${a.text}</div>
      <div class="translation">${a.translation}</div>
    `;
    quranText.appendChild(ayahDiv);
  });

  // Load audio per Surah (assuming you have mp3 links structured as: audio/{reciter}/{surah}.mp3)
  audioPlayer.innerHTML = `
    <audio controls style="width:100%">
      <source src="./audio/${reciters[reciter]}/${surah.number}.mp3" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
  `;
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
});
