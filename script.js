// ======================
// SURAH LIST
// ======================
const surahs = [
"Al-Fatiha","Al-Baqarah","Al-Imran","An-Nisa","Al-Ma'idah","Al-An'am","Al-A'raf","Al-Anfal","At-Tawbah","Yunus",
"Hud","Yusuf","Ar-Ra'd","Ibrahim","Al-Hijr","An-Nahl","Al-Isra","Al-Kahf","Maryam","Ta-Ha",
"Al-Anbiya","Al-Hajj","Al-Mu'minun","An-Nur","Al-Furqan","Ash-Shu'ara","An-Naml","Al-Qasas","Al-Ankabut","Ar-Rum",
"Luqman","As-Sajda","Al-Ahzab","Saba","Fatir","Ya-Sin","As-Saffat","Sad","Az-Zumar","Ghafir",
"Fussilat","Ash-Shura","Az-Zukhruf","Ad-Dukhan","Al-Jathiyah","Al-Ahqaf","Muhammad","Al-Fath","Al-Hujurat","Qaf",
"Adh-Dhariyat","At-Tur","An-Najm","Al-Qamar","Ar-Rahman","Al-Waqia","Al-Hadid","Al-Mujadila","Al-Hashr","Al-Mumtahina",
"As-Saff","Al-Jumua","Al-Munafiqun","At-Taghabun","At-Talaq","At-Tahrim","Al-Mulk","Al-Qalam","Al-Haaqqa","Al-Maarij",
"Nuh","Al-Jinn","Al-Muzzammil","Al-Muddaththir","Al-Qiyama","Al-Insan","Al-Mursalat","An-Naba","An-Naziat","Abasa",
"At-Takwir","Al-Infitar","Al-Mutaffifin","Al-Inshiqaq","Al-Buruj","At-Tariq","Al-Ala","Al-Ghashiyah","Al-Fajr","Al-Balad",
"Ash-Shams","Al-Lail","Ad-Dhuha","Ash-Sharh","At-Tin","Al-Alaq","Al-Qadr","Al-Bayyinah","Az-Zalzalah","Al-Adiyat",
"Al-Qaria","At-Takathur","Al-Asr","Al-Humazah","Al-Fil","Quraish","Al-Ma'un","Al-Kawthar","Al-Kafirun","An-Nasr",
"Al-Masad","Al-Ikhlas","Al-Falaq","An-Nas"
];

// populate dropdown
const surahSelect = document.getElementById("surahSelect");
surahs.forEach((s, i) => {
    const option = document.createElement("option");
    option.value = i + 1;
    option.textContent = `${i + 1}. ${s}`;
    surahSelect.appendChild(option);
});

// ======================
// LOAD SURAH
// ======================
async function loadSurah() {
    const surahNumber = surahSelect.value;
    const reciter = document.getElementById("reciterSelect").value;
    if (!surahNumber) return alert("Please select a Surah!");

    try {
        // Fetch Quran Arabic + English from local json
        const resArabic = await fetch("quran.json");
        const resEnglish = await fetch("quran_en.json");
        const quranArabic = await resArabic.json();
        const quranEnglish = await resEnglish.json();

        const arabicAyahs = quranArabic[surahNumber - 1].ayahs;
        const englishAyahs = quranEnglish[surahNumber - 1].ayahs;

        let html = "";
        for (let i = 0; i < arabicAyahs.length; i++) {
            html += `
            <div class="ayah">
                <p class="arabic">${i+1}. ${arabicAyahs[i].text}</p>
                <p class="translation">${i+1}. ${englishAyahs[i].text}</p>
            </div>
            `;
        }
        document.getElementById("quranText").innerHTML = html;

        // Audio
        const reciters = {
            afasy: "https://server8.mp3quran.net/afs/",
            baset: "https://server8.mp3quran.net/bas/",
            ghamdi: "https://server7.mp3quran.net/s_gmd/"
        };
        const surahCode = String(surahNumber).padStart(3, "0");
        const audioURL = reciters[reciter] + surahCode + ".mp3";
        document.getElementById("audioPlayer").innerHTML = `
            <h3>Surah Audio</h3>
            <audio controls>
                <source src="${audioURL}" type="audio/mpeg">
            </audio>
        `;

    } catch (err) {
        console.error(err);
        alert("Failed to load Quran. Make sure quran.json and quran_en.json exist in root.");
    }
}

// ======================
// PRAYER TIMES
// ======================
function getPrayerTimes() {
    const city = document.getElementById("cityInput").value || "Kampala";
    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Uganda&method=2`)
        .then(res => res.json())
        .then(data => {
            const t = data.data.timings;
            document.getElementById("prayerTimes").innerHTML = `
                <p>🕌 Fajr: ${t.Fajr}</p>
                <p>🌅 Sunrise: ${t.Sunrise}</p>
                <p>🕌 Dhuhr: ${t.Dhuhr}</p>
                <p>🌇 Asr: ${t.Asr}</p>
                <p>🌆 Maghrib: ${t.Maghrib}</p>
                <p>🌙 Isha: ${t.Isha}</p>
            `;
        })
        .catch(err => console.error(err));
}

// ======================
// SEND QUESTION
// ======================
function sendQuestion() {
    const name = document.getElementById("userName").value;
    const email = document.getElementById("userEmail").value;
    const question = document.getElementById("userQuestion").value;
    if (!question) return document.getElementById("questionStatus").innerText = "Please type your question.";

    const subject = "Islamic Question from Website";
    const body = `Name: ${name}\nEmail: ${email}\n\nQuestion:\n${question}`;
    window.location.href = `mailto:shuraimkaweesi@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// ======================
// AUTO YOUTUBE VIDEOS
// ======================
const channelID = "UC5_wjk8WksHOOZHflU9heJQ"; // Chair Islamic TV
const youtubeContainer = document.getElementById("youtubeVideos");

fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelID}`)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(data => {
        const entries = data.querySelectorAll("entry");
        let html = "";
        for (let i = 0; i < Math.min(entries.length, 3); i++) {
            const videoID = entries[i].querySelector("yt\\:videoId").textContent;
            html += `
                <iframe src="https://www.youtube.com/embed/${videoID}" allowfullscreen></iframe>
            `;
        }
        youtubeContainer.innerHTML = html;
    });
