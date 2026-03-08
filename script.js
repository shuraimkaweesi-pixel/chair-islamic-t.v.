// ===============================
// SURAH LIST
// ===============================

const surahNames = [
"Al-Fatiha","Al-Baqarah","Aal-Imran","An-Nisa","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah","Yunus",
"Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha",
"Al-Anbiya","Al-Hajj","Al-Mu’minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas","Al-Ankabut","Ar-Rum",
"Luqman","As-Sajdah","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir",
"Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf",
"Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqi'ah","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahanah",
"As-Saff","Al-Jumu’ah","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haqqah","Al-Ma'arij",
"Nuh","Al-Jinn","Al-Muzzammil","Al-Muddathir","Al-Qiyamah","Al-Insan","Al-Mursalat","An-Naba","An-Nazi'at","Abasa",
"At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-A'la","Al-Ghashiyah","Al-Fajr","Al-Balad",
"Ash-Shams","Al-Layl","Ad-Duha","Ash-Sharh","At-Tin","Al-Alaq","Al-Qadr","Al-Bayyinah","Az-Zalzalah","Al-Adiyat",
"Al-Qari'ah","At-Takathur","Al-Asr","Al-Humazah","Al-Fil","Quraysh","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr",
"Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"
]

// ===============================
// POPULATE SURAH DROPDOWN
// ===============================

const surahSelect = document.getElementById("surahSelect")

surahNames.forEach((name,i)=>{
let option=document.createElement("option")
option.value=i+1
option.textContent=(i+1)+" - "+name
surahSelect.appendChild(option)
})


// ===============================
// SURAH SEARCH
// ===============================

function searchSurah(){

let input=document.getElementById("surahSearch").value.toLowerCase()

for(let i=0;i<surahSelect.options.length;i++){

let txt=surahSelect.options[i].text.toLowerCase()

surahSelect.options[i].style.display=
txt.includes(input) ? "block":"none"

}

}


// ===============================
// LOAD SURAH
// ===============================

async function loadSurah(){

let surahNumber=surahSelect.value

if(!surahNumber){

alert("Select Surah")

return

}

try{

let arabicRes=await fetch("quran.json")
let englishRes=await fetch("quran_en.json")

let arabic=await arabicRes.json()
let english=await englishRes.json()

let arabicAyahs=arabic[surahNumber-1].ayahs
let englishAyahs=english[surahNumber-1].ayahs

let html=""

for(let i=0;i<arabicAyahs.length;i++){

html+=`

<div class="ayah">

<div class="arabic">
${i+1}. ${arabicAyahs[i].text}
</div>

<div class="translation">
${i+1}. ${englishAyahs[i]?.text || ""}
</div>

</div>

`

}

document.getElementById("quranText").innerHTML=html


// ===============================
// AUDIO PLAYER
// ===============================

let surahCode=String(surahNumber).padStart(3,'0')

let reciter=document.getElementById("reciterSelect").value

let reciters={
afasy:"https://server8.mp3quran.net/afs/",
baset:"https://server8.mp3quran.net/bas/",
ghamdi:"https://server7.mp3quran.net/s_gmd/"
}

let audioURL=reciters[reciter]+surahCode+".mp3"

document.getElementById("audioPlayer").innerHTML=`

<h3>Surah Audio</h3>

<audio controls>
<source src="${audioURL}" type="audio/mpeg">
</audio>

`

}catch(e){

console.log(e)

alert("Error loading Quran")

}

}


// ===============================
// PRAYER TIMES
// ===============================

function getPrayerTimes(){

let city=document.getElementById("cityInput").value || "Kampala"

fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Uganda&method=2`)
.then(r=>r.json())
.then(data=>{

let t=data.data.timings

document.getElementById("prayerTimes").innerHTML=`

Fajr: ${t.Fajr}<br>
Dhuhr: ${t.Dhuhr}<br>
Asr: ${t.Asr}<br>
Maghrib: ${t.Maghrib}<br>
Isha: ${t.Isha}

`

})

}


// ===============================
// ASK QUESTION EMAIL
// ===============================

function sendQuestion(){

let name=document.getElementById("userName").value
let email=document.getElementById("userEmail").value
let q=document.getElementById("userQuestion").value

let subject="Question from Chair Islamic TV"

let body=`Name: ${name}

Email: ${email}

Question:
${q}`

window.location.href=`mailto:shuraimkaweesi@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

}


// ===============================
// DAILY HADITH
// ===============================

async function loadHadith(){

try{

let res=await fetch("https://api.hadith.gading.dev/books/muslim?range=1-10")

let data=await res.json()

let hadith=data.data.hadiths[Math.floor(Math.random()*data.data.hadiths.length)]

document.getElementById("hadithBox").innerHTML=`

<p>${hadith.arab}</p>
<p>${hadith.id}</p>

`

}catch{

document.getElementById("hadithBox").innerText="Could not load Hadith"

}

}

loadHadith()


// ===============================
// YOUTUBE VIDEOS
// ===============================

const channelID="UC5_wjk8WksHOOZHflU9heJQ"

const youtubeContainer=document.getElementById("youtubeVideos")

fetch(`https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=${channelID}`)

.then(r=>r.json())

.then(data=>{

let html=""

data.items.slice(0,3).forEach(v=>{

let id=v.link.split("v=")[1]

html+=`<iframe src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe>`

})

youtubeContainer.innerHTML=html

})
