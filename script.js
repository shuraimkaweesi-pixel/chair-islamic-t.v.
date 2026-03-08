// ---------------- SERVICE WORKER ----------------
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(() => console.log('SW registered'))
    .catch(err => console.log(err));
}

// ---------------- INSTALL APP ----------------
let deferredPrompt;
const installBtn = document.getElementById('installBtn');
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});
installBtn.addEventListener('click', async () => {
  deferredPrompt.prompt();
  deferredPrompt = null;
  installBtn.style.display = 'none';
});

// ---------------- YOUTUBE ----------------
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('youtubeVideos').innerHTML = `
    <iframe width="100%" height="400" src="https://www.youtube.com/embed/zGIBIOMA0PQ"
    frameborder="0" allowfullscreen></iframe>`;
});

// ---------------- PRAYER ----------------
async function getPrayerTimes() {
  const city = document.getElementById('cityInput').value || "Kampala";
  try {
    const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Uganda&method=2`);
    const data = await res.json();
    const t = data.data.timings;
    document.getElementById('prayerTimes').innerHTML = `
      <p>Fajr: ${t.Fajr}</p>
      <p>Dhuhr: ${t.Dhuhr}</p>
      <p>Asr: ${t.Asr}</p>
      <p>Maghrib: ${t.Maghrib}</p>
      <p>Isha: ${t.Isha}</p>`;
  } catch(e){alert("Cannot load prayer times");}
}

// ---------------- ASK QUESTION ----------------
function sendQuestion(){
  const name=document.getElementById('userName').value;
  const email=document.getElementById('userEmail').value;
  const q=document.getElementById('userQuestion').value;
  if(!name||!email||!q){alert("Fill all fields!"); return;}
  window.location.href=`mailto:shuraimkaweesi@gmail.com?subject=Islamic Question&body=Name:${name}%0AEmail:${email}%0AQuestion:%0A${q}`;
  document.getElementById('questionStatus').innerText="Email client opened!";
}

// ---------------- QURAN OFFLINE ----------------
let quranData;
const surahSelect = document.getElementById('surahSelect');
const reciterSelect = document.getElementById('reciterSelect');
const audioPlayerDiv = document.getElementById('audioPlayer');
const quranTextDiv = document.getElementById('quranText');

fetch('quran.json')
  .then(res => res.json())
  .then(data => {
    quranData = data.surahs;
    quranData.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.id}. ${s.name.arabic} (${s.name.english})`;
      surahSelect.appendChild(opt);
    });
  });

function loadSurah() {
  const surahID = parseInt(surahSelect.value);
  const reciter = reciterSelect.value;
  if (!surahID) return alert("Select Surah!");

  // Audio link (online CDN)
  const reciterCodes = {
    afasy:'ar.alafasy',
    sudais:'ar.abdulrahmanalsudais',
    ghamdi:'ar.saadghamdi'
  };
  audioPlayerDiv.innerHTML=`<audio controls style="width:100%">
    <source src="https://cdn.islamic.network/quran/audio-surah/${reciterCodes[reciter]}/${surahID}.mp3" type="audio/mpeg">
    </audio>`;

  // Show text
  quranTextDiv.innerHTML="";
  const surah = quranData.find(s=>s.id===surahID);
  surah.verses.forEach(v=>{
    const div=document.createElement('div');
    div.classList.add('ayah');
    div.innerHTML=`<div class="arabic">${v.text}</div><div class="translation">${v.translation}</div>`;
    quranTextDiv.appendChild(div);
  });
}
