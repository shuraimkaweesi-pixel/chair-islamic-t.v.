// ----------------------
// script.js (Auto Latest YouTube + Full Features)
// ----------------------

const surahSelect = document.getElementById('surahSelect');
const reciterSelect = document.getElementById('reciterSelect');
const audioPlayer = document.getElementById('audioPlayer');
const quranText = document.getElementById('quranText');
const youtubeDiv = document.getElementById('youtubeVideos');

// ----------------------
// 1. Populate Surah List
// ----------------------
async function loadSurahList() {
  const surahs = [
    {number: 1, name: "الفاتحة", english: "Al-Fatiha"},
    {number: 2, name: "البقرة", english: "Al-Baqarah"},
    {number: 3, name: "آل عمران", english: "Aal-i-Imran"},
    // ... up to 114
  ];

  surahs.forEach(s => {
    const option = document.createElement('option');
    option.value = s.number.toString().padStart(3, '0');
    option.textContent = `${s.number}. ${s.name} (${s.english})`;
    surahSelect.appendChild(option);
  });
}

// ----------------------
// 2. Load Quran Surah JSON
// ----------------------
async function loadSurah() {
  const surahNum = surahSelect.value;
  const reciter = reciterSelect.value;
  if (!surahNum) return alert("Please select a Surah!");

  try {
    const res = await fetch(`/quran/${surahNum}.json`);
    const data = await res.json();

    audioPlayer.innerHTML = `
      <audio controls style="width:100%">
        <source src="${data.audio[reciter]}" type="audio/mpeg">
      </audio>
    `;

    quranText.innerHTML = '';
    data.ayahs.forEach(a => {
      quranText.innerHTML += `
        <div class="ayah">
          <div class="arabic">${a.text}</div>
          <div class="translation">${a.translation}</div>
        </div>
      `;
    });
  } catch (err) {
    console.error("Error loading Surah:", err);
    alert("Failed to load Quran Surah. Check your JSON files.");
  }
}

// ----------------------
// 3. Fetch Latest YouTube Video Automatically
// ----------------------
async function loadLatestYouTube() {
  try {
    // Replace this with your actual channel ID
    const channelId = "UC-chairislamictv"; 

    // Using YouTube Data API v3 requires an API key; for now, we'll embed latest video via channel RSS feed
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
// 4. Prayer Times
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
// 5. Ask a Question
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
// 6. Initialize
// ----------------------
document.addEventListener('DOMContentLoaded', () => {
  loadSurahList();
  loadLatestYouTube();
});
