// ----------------------
// script.js - Chair Islamic TV Full Features
// ----------------------

// ----------------------
// 1. Quran Reader (UPDATED)
// ----------------------

const surahSelect = document.getElementById('surahSelect');
const reciterSelect = document.getElementById('reciterSelect');
const audioPlayer = document.getElementById('audioPlayer');
const quranText = document.getElementById('quranText');

let quranData = [];

async function loadSurahList() {
  try {

    const res = await fetch("quran-complete.json");
    quranData = await res.json();

    quranData.forEach((surah, index) => {

      const option = document.createElement('option');
      option.value = index + 1;

      option.textContent =
        `${index + 1}. ${surah.name_translations.ar} (${surah.name_translations.en})`;

      surahSelect.appendChild(option);

    });

  } catch (err) {

    console.error("Failed to load Quran:", err);

  }
}


function playAyahAudio(surahNum, ayahNum) {

  const surah = quranData[surahNum - 1];

  if (!surah || !surah.recitation) {
    alert("Audio not available");
    return;
  }

  const base = surah.recitation;

  const parts = base.split("/");

  const file = ayahNum.toString().padStart(3, "0") + ".mp3";

  parts[parts.length - 1] = file;

  const audioURL = parts.join("/");

  const audio = new Audio(audioURL);

  audio.play();
}


function loadSurah() {

  const surahNum = parseInt(surahSelect.value);

  if (!surahNum) {
    alert("Please select a Surah!");
    return;
  }

  const surah = quranData[surahNum - 1];

  quranText.innerHTML = "";

  // load full surah audio
  audioPlayer.innerHTML = `
  <audio controls style="width:100%">
    <source src="${surah.recitation}" type="audio/mpeg">
  </audio>
  `;

  // display ayahs
  surah.ayahs.forEach(ayah => {

    const div = document.createElement("div");

    div.className = "ayah";

    div.innerHTML = `
      <button onclick="playAyahAudio(${surahNum},${ayah.number})">
      🔊 ${ayah.number}
      </button>

      <div class="arabic">${ayah.text}</div>

      <div class="translation">${ayah.translation}</div>
    `;

    quranText.appendChild(div);

  });

}


// ----------------------
// 2. Auto Latest YouTube Video
// ----------------------

const youtubeDiv = document.getElementById('youtubeVideos');

async function loadLatestYouTube() {
  try {

    const channelId = "UC-chairislamictv";

    const rssUrl =
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;

    const proxyUrl =
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

    const response = await fetch(proxyUrl);

    const data = await response.json();

    if (data.items && data.items.length > 0) {

      const latestVideoId = data.items[0].link.split('v=')[1];

      youtubeDiv.innerHTML = `
        <iframe width="100%" height="315"
        src="https://www.youtube.com/embed/${latestVideoId}"
        frameborder="0" allowfullscreen></iframe>
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

    const res = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=&method=2`
    );

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
// 4. Ask Question via Email
// ----------------------

function sendQuestion() {

  const name = document.getElementById('userName').value;

  const email = document.getElementById('userEmail').value;

  const question = document.getElementById('userQuestion').value;

  if (!name || !email || !question)
    return alert("All fields are required!");

  window.location.href =
    `mailto:shuraimkaweesi@gmail.com?subject=Question from ${name}&body=${
      encodeURIComponent(question + "\n\nEmail: " + email)
    }`;

  document.getElementById('questionStatus').textContent =
    "Email opened in your mail client.";

}


// ----------------------
// 5. Initialize Everything
// ----------------------

document.addEventListener('DOMContentLoaded', () => {

  loadSurahList();

  loadLatestYouTube();

});
