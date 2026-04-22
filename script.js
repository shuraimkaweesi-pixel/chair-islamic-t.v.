// ===============================
// CHAIR ISLAMIC TV MAIN SCRIPT
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  initPWA();
  loadYoutubeVideos();
  loadHadith();
  initSurahList();
  startAdhanSystem();
  initLetters();
  unlockAudio();
});

// ===============================
// PWA
// ===============================
let deferredPrompt;

function initPWA() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
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

  const vids = ["ZGwG7UBlFCc","zGIBIOMA0PQ"];

  box.innerHTML = vids.map(id=>`
  <iframe width="100%" height="315"
  src="https://www.youtube.com/embed/${id}"
  allowfullscreen></iframe><br><br>
  `).join("");
}


// ===============================
// 🔒 COPY FIRST SYSTEM
// ===============================

let hasCopied = false;

function copyMerchant(){

  navigator.clipboard.writeText("7037856").then(()=>{

    hasCopied = true;

    alert("✅ Number copied. You can now donate.");

    // show donate button
    document.getElementById("donateBtn").style.display = "block";

  }).catch(()=>{
    alert("Copy failed. Please copy manually: 7037856");
  });

}


// ===============================
// 💰 DONATION FUNCTION
// ===============================
function donate(){

  if(!hasCopied){
    alert("⚠️ Please copy the merchant number first");
    return;
  }

  const amount = document.getElementById("amount").value;

  if(!amount || amount < 1000){
    alert("Enter valid amount (minimum 1000 UGX)");
    return;
  }

  const ussd = `*185*9*7037856*${amount}#`;

  window.location.href = "tel:" + encodeURIComponent(ussd);

}


// ===============================
// HADITH
// ===============================
async function loadHadith() {
  const box = document.getElementById("hadithBox");
  if (!box) return;

  try{
    const res = await fetch("hadith.json");
    const data = await res.json();

    const h = data.hadiths[Math.floor(Math.random()*data.hadiths.length)];

    box.innerHTML = `
      <div class="arabic">${h.arab}</div>
      <div class="translation">${h.en}</div>
    `;
  }catch{
    box.innerText = "Failed to load Hadith";
  }
}

// ===============================
// SURAH LIST
// ===============================
function initSurahList(){
const select = document.getElementById("surahSelect");
if(!select) return;

const names = ["Al-Fatiha","Al-Baqarah","Aal-Imran","An-Nisa","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah","Yunus","Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha"];

names.forEach((n,i)=>{
const opt = document.createElement("option");
opt.value = i+1;
opt.textContent = (i+1)+" - "+n;
select.appendChild(opt);
});
}

// ===============================
// LOAD SURAH
// ===============================
async function loadSurah(){
const num = parseInt(document.getElementById("surahSelect").value);
if(!num){ alert("Select a Surah"); return; }

try{
const res = await fetch(`https://api.alquran.cloud/v1/surah/${num}/editions/quran-uthmani,en.sahih`);
const data = await res.json();

const ar = data.data[0].ayahs;
const en = data.data[1].ayahs;

let html = "";

for(let i=0;i<ar.length;i++){
html += `
<div class="ayah" onclick="playAyah(${num},${i+1},this)">
<div class="arabic">${i+1}. ${ar[i].text}</div>
<div class="translation">${i+1}. ${en[i].text}</div>
</div>`;
}

document.getElementById("quranText").innerHTML = html;

}catch{
document.getElementById("quranText").innerHTML = "Failed to load Surah";
}
}

// ===============================
// 🔊 AYAH AUDIO
// ===============================
let currentAudio = null;
let currentSurah = null;
let currentAyah = null;
let ayahElements = [];

function playAyah(surah, ayah, el){

if(currentAudio && currentSurah===surah && currentAyah===ayah){
currentAudio.paused ? currentAudio.play() : currentAudio.pause();
return;
}

if(currentAudio) currentAudio.pause();

document.querySelectorAll(".ayah").forEach(a=>a.classList.remove("playing"));
el.classList.add("playing");

currentSurah = surah;
currentAyah = ayah;
ayahElements = document.querySelectorAll(".ayah");

const s = String(surah).padStart(3,"0");
const a = String(ayah).padStart(3,"0");

const url = `https://everyayah.com/data/Alafasy_128kbps/${s}${a}.mp3`;

currentAudio = new Audio(url);
currentAudio.play();

currentAudio.onended = ()=>{
const next = ayah + 1;
if(ayahElements[next-1]){
playAyah(surah,next,ayahElements[next-1]);
}
};
}

// ===============================
// 🔊 ADHAN SYSTEM (FIXED)
// ===============================
let prayerTimings = {};
let lastAdhanPlayed = "";

// request notification
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

// unlock audio
function unlockAudio(){
document.body.addEventListener("click", () => {
const a = new Audio("https://cdn.islamic.network/audio/adhan/1.mp3");
a.play().then(()=>{a.pause(); a.currentTime=0;}).catch(()=>{});
},{once:true});
}

// fetch + start
async function startAdhanSystem(){
try{
const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=Kampala&country=Uganda&method=2`);
const data = await res.json();
const t = data.data.timings;

prayerTimings = {
Fajr: t.Fajr.slice(0,5),
Dhuhr: t.Dhuhr.slice(0,5),
Asr: t.Asr.slice(0,5),
Maghrib: t.Maghrib.slice(0,5),
Isha: t.Isha.slice(0,5)
};

setInterval(checkAdhanTime,15000);

}catch(err){
console.log("Adhan error:",err);
}
}

function checkAdhanTime(){
if(!prayerTimings) return;

const now = new Date();
const currentTime =
now.getHours().toString().padStart(2,"0")+":"+
now.getMinutes().toString().padStart(2,"0");

for(let p in prayerTimings){
if(currentTime === prayerTimings[p] && lastAdhanPlayed !== p){
triggerAdhan(p);
lastAdhanPlayed = p;
}
}
}

function triggerAdhan(prayer){
const audio = new Audio("https://cdn.islamic.network/audio/adhan/1.mp3");
audio.play().catch(()=>{});

if(Notification.permission==="granted"){
new Notification("🕌 Prayer Time",{body:"It's time for "+prayer});
}

if(navigator.vibrate){
navigator.vibrate([500,300,500]);
}
}

// ===============================
// 🔒 COPY REQUIRED + AIRTEL DONATION
// ===============================

let hasCopied = false;

// COPY BUTTON FUNCTION
function copyMerchant(){

  navigator.clipboard.writeText("7037856").then(()=>{

    hasCopied = true;

    alert("✅ Merchant number copied. You can now donate.");

    // Optional: show donate button if hidden
    const btn = document.getElementById("donateBtn");
    if(btn) btn.style.display = "block";

  }).catch(()=>{
    alert("Copy failed. Please copy manually: 7037856");
  });

}


// ===============================
// DONATE (LOCKED UNTIL COPY)
// ===============================
function donate(){

  // 🚫 block if not copied
  if(!hasCopied){
    alert("⚠️ Please copy the merchant number first");
    return;
  }

  const amount = document.getElementById("amount").value;

  if(!amount || amount < 1000){
    alert("Enter valid amount (minimum 1000 UGX)");
    return;
  }

  const ussd = `*185*9*7037856*${amount}#`;

  window.location.href = "tel:" + encodeURIComponent(ussd);

}


// ===============================
// 📖 YASARNAH (REAL AUDIO)
// ===============================
const letters = [
{a:"ا",name:"Alif",url:"https://www.islamcan.com/audio/arabic/alif.mp3"},
{a:"ب",name:"Ba",url:"https://www.islamcan.com/audio/arabic/ba.mp3"},
{a:"ت",name:"Ta",url:"https://www.islamcan.com/audio/arabic/ta.mp3"},
{a:"ث",name:"Tha",url:"https://www.islamcan.com/audio/arabic/tha.mp3"},
{a:"ج",name:"Jeem",url:"https://www.islamcan.com/audio/arabic/jeem.mp3"},
{a:"ح",name:"Ha",url:"https://www.islamcan.com/audio/arabic/ha.mp3"},
{a:"خ",name:"Kha",url:"https://www.islamcan.com/audio/arabic/kha.mp3"},
{a:"د",name:"Dal",url:"https://www.islamcan.com/audio/arabic/dal.mp3"},
{a:"ذ",name:"Dhal",url:"https://www.islamcan.com/audio/arabic/dhal.mp3"},
{a:"ر",name:"Ra",url:"https://www.islamcan.com/audio/arabic/ra.mp3"},
{a:"ز",name:"Zay",url:"https://www.islamcan.com/audio/arabic/zay.mp3"},
{a:"س",name:"Seen",url:"https://www.islamcan.com/audio/arabic/seen.mp3"},
{a:"ش",name:"Sheen",url:"https://www.islamcan.com/audio/arabic/sheen.mp3"},
{a:"ص",name:"Sad",url:"https://www.islamcan.com/audio/arabic/sad.mp3"},
{a:"ض",name:"Dad",url:"https://www.islamcan.com/audio/arabic/dad.mp3"},
{a:"ط",name:"Taa",url:"https://www.islamcan.com/audio/arabic/taa.mp3"},
{a:"ظ",name:"Zaa",url:"https://www.islamcan.com/audio/arabic/zaa.mp3"},
{a:"ع",name:"Ain",url:"https://www.islamcan.com/audio/arabic/ain.mp3"},
{a:"غ",name:"Ghain",url:"https://www.islamcan.com/audio/arabic/ghain.mp3"},
{a:"ف",name:"Fa",url:"https://www.islamcan.com/audio/arabic/fa.mp3"},
{a:"ق",name:"Qaf",url:"https://www.islamcan.com/audio/arabic/qaf.mp3"},
{a:"ك",name:"Kaf",url:"https://www.islamcan.com/audio/arabic/kaf.mp3"},
{a:"ل",name:"Lam",url:"https://www.islamcan.com/audio/arabic/lam.mp3"},
{a:"م",name:"Meem",url:"https://www.islamcan.com/audio/arabic/meem.mp3"},
{a:"ن",name:"Noon",url:"https://www.islamcan.com/audio/arabic/noon.mp3"},
{a:"ه",name:"Ha",url:"https://www.islamcan.com/audio/arabic/haa.mp3"},
{a:"و",name:"Waw",url:"https://www.islamcan.com/audio/arabic/waw.mp3"},
{a:"ي",name:"Yaa",url:"https://www.islamcan.com/audio/arabic/yaa.mp3"}
];

let currentIndex=null;
let repeat=0;
let repeatCount=3;
let letterAudio=null;

function initLetters(){
const box=document.getElementById("lessonBox");
if(!box) return;

box.innerHTML="";
letters.forEach((l,i)=>{
box.innerHTML+=`
<div class="lesson" onclick="toggleLetter(${i})">
<h2 style="font-size:42px">${l.a}</h2>
<p>${l.name}</p>
</div>`;
});
}

function toggleLetter(i){
if(currentIndex===i && letterAudio){
letterAudio.paused?letterAudio.play():letterAudio.pause();
return;
}
startLetter(i);
}

function startLetter(i){
if(letterAudio) letterAudio.pause();
currentIndex=i;
repeat=0;
playLetter();
}

function playLetter(){
const l=letters[currentIndex];
letterAudio=new Audio(l.url);
letterAudio.play();
highlightLetter(currentIndex);

letterAudio.onended=()=>{
repeat++;
if(repeat<repeatCount){
playLetter();
return;
}
currentIndex++;
if(currentIndex<letters.length){
repeat=0;
playLetter();
}
};
}

function highlightLetter(i){
document.querySelectorAll(".lesson").forEach((el,index)=>{
el.style.border=index===i?"2px solid gold":"none";
});
                  }
