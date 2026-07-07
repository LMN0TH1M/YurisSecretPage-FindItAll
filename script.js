/* =========================
   LOGIN
========================= */

function unlockSite() {
    const pass = document.getElementById("passwordInput").value;
    const error = document.getElementById("loginError");

    if (pass === "Potato") {
        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("mainSite").style.display = "block";
    } else {
        error.innerHTML = "Access denied";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("passwordInput");

    input.addEventListener("keydown", e => {
        if (e.key === "Enter") unlockSite();
    });
});

/* =========================
   ELEMENTS / STATE
========================= */

const TOTAL_SECRETS = 8;

let noteOpen = false;
let popupOpen = false;

const intro = document.getElementById("intro");
const noteScreen = document.getElementById("noteScreen");
const player = document.getElementById("audioPlayer");

/* =========================
   AUDIO DATA
========================= */

const audios = [
    "audio1.m4a",
    "audio2.MP3",
    "audio3.MP3",
    "audio4.MP3",
    "audio5.MP3",
    "audio6.MP3",
    "audio7.MP3",
    "audio8.MP3",
    "audio9.MP3",
    "audio10.MP3",
    "audio11.MP3",
    "audio12.MP3",
    "audio13.MP3",
    "audio14.MP3",
    "audio15.MP3",
    "audio16.MP3",
    "audio17.MP3",
    "audio18.MP3",
    "audio19.MP3",
    "audio20.MP3"
];

const secretAudio = "myhome.m4a";

let heardAudios = new Set(
    JSON.parse(localStorage.getItem("heardAudios")) || []
);

/* =========================
   SECRETS
========================= */

const secrets = {
    a0: false,
    b7: false,
    c1: false,
    d1: false,
    e7: false,
    drag: false,
    reward: false,
    home: false
};

const savedSecrets = JSON.parse(localStorage.getItem("yuriSecrets"));
if (savedSecrets) Object.assign(secrets, savedSecrets);

/* =========================
   SAVE SYSTEM
========================= */

function saveProgress() {
    localStorage.setItem("heardAudios", JSON.stringify([...heardAudios]));
    localStorage.setItem("yuriSecrets", JSON.stringify(secrets));

    updateAudioProgress();
    updateSecretProgress();
}

/* =========================
   AUDIO PROGRESS
========================= */

function updateAudioProgress() {
    const count = heardAudios.size;

    document.getElementById("audioProgressText").innerHTML =
        `Audios Found: ${count}/${audios.length}`;

    document.getElementById("audioFill").style.width =
        (count / audios.length) * 100 + "%";

    if (count === audios.length) {
        document.getElementById("audioRewardBtn").style.display = "block";
    }
}

/* =========================
   SECRET PROGRESS
========================= */

function updateSecretProgress() {
    const found = Object.values(secrets).filter(Boolean).length;

    document.getElementById("secretProgressText").innerHTML =
        `Secrets: ${found}/${TOTAL_SECRETS}`;

    document.getElementById("secretFill").style.width =
        (found / TOTAL_SECRETS) * 100 + "%";
}

/* =========================
   CHECK ALL SECRETS
========================= */

function checkAllSecrets() {
    saveProgress();

    const done = Object.values(secrets).every(v => v === true);

    if (done) {
        const progress = document.getElementById("secretProgress");

        progress.style.opacity = "0";
        progress.style.transform = "translateY(20px)";
        progress.style.transition = "1s";

        setTimeout(() => {
            progress.style.display = "none";
            document.getElementById("finalSecretBtn").style.display = "block";
        }, 1000);
    }
}

/* =========================
   OPEN / CLOSE NOTE
========================= */

function openNote() {
    noteOpen = true;
    intro.style.display = "none";
    noteScreen.style.display = "flex";
    updateSecretProgress();
}

function goBack() {
    noteOpen = false;
    noteScreen.style.display = "none";
    intro.style.display = "flex";

    window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================
   AUDIO PLAY
========================= */

function playRandomAudio() {
    const popup = document.getElementById("audioPopup");
    const popupText = document.getElementById("audioText");

    const randomIndex = Math.floor(Math.random() * audios.length);
    const randomAudio = audios[randomIndex];

    const audioId = String(randomIndex + 1);

    const messages = ["ily", ":3", "i like you", "hehe", "ur pretty", "💜"];

    const msg = messages[Math.floor(Math.random() * messages.length)];

    if (!heardAudios.has(audioId)) {
        heardAudios.add(audioId);
        saveProgress();
    }

    player.pause();
    player.src = randomAudio;
    player.load();
    player.play().catch(() => {});

    popup.classList.add("showPopup");
    popupText.innerHTML = `Playing: ${randomIndex + 1}/${audios.length}`;

    player.onended = () => {
        popupText.innerHTML = msg;

        setTimeout(() => {
            popup.classList.remove("showPopup");
        }, 1200);
    };
    // 🔥 30% SECRET CHANCE (FIXED)
    const showSecret = Math.random() < 0.3;

    if (heardAudios.size >= audios.length && showSecret) {

        secrets.c1 = true; // your secret point
        checkAllSecrets();

        popupText.innerHTML = "i also like hearing you talk 💜 (c1)";

        popup.classList.add("showPopup");

        setTimeout(() => {
            popup.classList.remove("showPopup");
        }, 2000);
    }
}

/* =========================
   HEARTS
========================= */

let heartClicks = 0;
let firstHeartClick = 0;

function spawnHearts() {
    const emojis = ["💜", "❤️", "💕", "💖", "✨"];

    const now = Date.now();

    if (now - firstHeartClick > 2000) {
        firstHeartClick = now;
        heartClicks = 0;
    }

    heartClicks++;

    if (heartClicks >= 7) {
        const note = document.getElementById("secretNote");
        note.style.display = "block";
        note.innerHTML = "You found me! (b7)";

        secrets.b7 = true;
        checkAllSecrets();

        setTimeout(() => (note.style.display = "none"), 3000);
        heartClicks = 0;
    }

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const heart = document.createElement("div");
            heart.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];

            Object.assign(heart.style, {
                position: "fixed",
                left: Math.random() * 100 + "vw",
                bottom: "-50px",
                fontSize: Math.random() * 25 + 18 + "px",
                zIndex: 999999,
                pointerEvents: "none",
                transition: "transform 5s ease-out, opacity 5s ease-out"
            });

            document.body.appendChild(heart);

            setTimeout(() => {
                heart.style.transform = `translateY(-120vh)`;
                heart.style.opacity = "0";
            }, 50);

            setTimeout(() => heart.remove(), 5000);
        }, i * 100);
    }
}

/* =========================
   SECRET BOX
========================= */

document.addEventListener("keydown", e => {
    if (e.key !== "Enter") return;
    if (!noteOpen) return;
    if (popupOpen) return;

    document.getElementById("secretBox").style.display = "block";
    document.getElementById("secretInput").focus();

    secrets.a0 = true;
    checkAllSecrets();

    popupOpen = true;
});

function closeSecretBox() {
    document.getElementById("secretBox").style.display = "none";
    popupOpen = false;
}

/* =========================
   SECRET CODE CHECK
========================= */

const validCodes = ["marry me"];

const fakeErrors = [
    "Error: Too cute",
    "Error: Love overload",
    "Error: Hug required",
    "Error: Heart stolen"
];

function checkSecretCode() {
    const input = document.getElementById("secretInput").value.toLowerCase();
    const error = document.getElementById("secretError");

    if(input.toLowerCase() === "100"){

    open100Panel();

    return;

}

    if(input.toLowerCase() === "loviu"){

    playLoveAnimation();

    return;

}

    if (input === "home") {
        secrets.home = true;
        checkAllSecrets();

        const audio = document.getElementById("audioPlayer");
        audio.src = secretAudio;
        audio.play().catch(() => {});

        error.innerHTML = "home 💜";
        return;
    }

    if (input === "0711") {
        const today = new Date();
        const unlock = new Date("2026-07-5");

        if (today < unlock) {
            error.innerHTML = "Come back later 💜";
            return;
        }

        secrets.e7 = true;
checkAllSecrets();

closeSecretBox();
openBirthdayPage();

return;
    }

    if (validCodes.includes(input)) {
        error.innerHTML = "Accepted 💜";
    } else {
        error.innerHTML =
            fakeErrors[Math.floor(Math.random() * fakeErrors.length)];
    }
}

/* =========================
   FINAL
========================= */

function finishSecrets() {
    alert("more coming soon 💜");
}

function resetProgress() {

    // clear storage
    localStorage.removeItem("heardAudios");
    localStorage.removeItem("yuriSecrets");

    // reset audio tracking
    heardAudios.clear();

    // reset all secrets safely
    for (const key in secrets) {
        secrets[key] = false;
    }

    // reset UI safely
    const audioText = document.getElementById("audioProgressText");
    const audioFill = document.getElementById("audioFill");

    const secretText = document.getElementById("secretProgressText");
    const secretFill = document.getElementById("secretFill");

    if (audioText && audioFill) {
        audioText.innerHTML = `Audios Found: 0/${audios.length}`;
        audioFill.style.width = "0%";
    }

    if (secretText && secretFill) {
        secretText.innerHTML = `Secrets: 0/${Object.keys(secrets).length}`;
        secretFill.style.width = "0%";
    }

    // hide UI buttons safely
    const finalBtn = document.getElementById("finalSecretBtn");
    if (finalBtn) finalBtn.style.display = "none";

    const rewardBtn = document.getElementById("audioRewardBtn");
    if (rewardBtn) rewardBtn.style.display = "none";

    const note = document.getElementById("secretNote");
    if (note) note.style.display = "none";

    const popup = document.getElementById("audioPopup");
    if (popup) popup.classList.remove("showPopup");
}

window.showSeeSecret = function () {
    const note = document.getElementById("secretNote");

    if (!note) return;

    note.style.display = "block";
    note.innerHTML = "see you too (d1)";

    secrets.d1 = true;
    checkAllSecrets();

    setTimeout(() => {
        note.style.display = "none";
    }, 2500);
};

let draggedPhoto = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let noteRect = null;

const photos = document.querySelectorAll(".edge-photo:not(.no-drag)");

photos.forEach(photo => {

    photo.addEventListener("mousedown", (e) => {

        e.preventDefault();

    draggedPhoto = photo;

    if (!secrets.drag) {

        secrets.drag = true;
        checkAllSecrets();

        const note = document.getElementById("secretNote");

        note.innerHTML = "You found me! (drag)";
        note.style.display = "block";

        setTimeout(() => {
            note.style.display = "none";
        }, 2500);
    }

    const note = photo.closest(".note");
    noteRect = note.getBoundingClientRect();

    const rect = photo.getBoundingClientRect();

    // Save the current rotation
    const rotation = getComputedStyle(photo).transform;

    // Freeze the photo exactly where it is
    photo.style.left = (rect.left - noteRect.left) + "px";
    photo.style.top = (rect.top - noteRect.top) + "px";
    photo.style.right = "auto";
    photo.style.bottom = "auto";
    photo.style.transform = rotation;

    photo.style.zIndex = "99999";
    photo.style.cursor = "grabbing";

    // Now get the NEW rectangle after freezing it
    const newRect = photo.getBoundingClientRect();

    dragOffsetX = e.clientX - newRect.left;
    dragOffsetY = e.clientY - newRect.top;
    });

});

document.addEventListener("mousemove", (e) => {

    if (!draggedPhoto) return;

    draggedPhoto.style.left =
        (e.clientX - noteRect.left - dragOffsetX) + "px";

    draggedPhoto.style.top =
        (e.clientY - noteRect.top - dragOffsetY) + "px";

});

document.addEventListener("mouseup", () => {

    if (!draggedPhoto) return;

    draggedPhoto.style.cursor = "grab";
    draggedPhoto.style.zIndex = "";

    draggedPhoto = null;

});

function openBirthdayPage(){

    document.getElementById("birthdayPage").style.display = "block";

}

function closeBirthdayPage(){

    document.getElementById("birthdayPage").style.display = "none";

}

function openAudioReward() {

    if (!secrets.reward) {
    secrets.reward = true;
    checkAllSecrets();
}
    const panel = document.getElementById("audioRewardPanel");
    if (!panel) return;

    panel.classList.add("show");
}

function closeAudioReward() {
    const panel = document.getElementById("audioRewardPanel");
    if (!panel) return;

    panel.classList.remove("show");
}

function openHomePrompt() {

    console.log("1");

    const popup = document.getElementById("audioPopup");
    console.log(popup);

    const popupText = document.getElementById("audioText");
    console.log(popupText);

    popupText.innerHTML = 'psst... enter "home" in terminal :p';

    popup.classList.add("showPopup");

    setTimeout(() => {
        popup.classList.remove("showPopup");
    }, 2500);
}

function playLoveAnimation(){

    const overlay = document.getElementById("loveOverlay");
    const status = document.getElementById("loveStatus");
    const container = document.getElementById("loveContainer");

    overlay.style.display = "block";

    container.innerHTML = "";

    status.innerHTML = "Translating...";

    setTimeout(()=>{

        status.innerHTML = "";

        let i = 0;

        const timer = setInterval(()=>{

            if(i >= loveLanguages.length){

                clearInterval(timer);

                setTimeout(()=>{

                    overlay.style.display = "none";

                },3000);

                return;
            }

            const word = document.createElement("div");

            word.className = "loveWord";

            word.textContent = loveLanguages[i];

            word.style.left = Math.random()*80+10+"%";
            word.style.top = Math.random()*80+10+"%";

            word.style.fontSize =
                (22+Math.random()*20)+"px";

            container.appendChild(word);

            setTimeout(()=>word.remove(),3000);

            i++;

        },180);

    },1500);

}

const loveLanguages = [

"Te amo",
"Je t'aime",
"Ti amo",
"Ich liebe dich",
"Eu te amo",
"愛してる",
"大好き",
"사랑해",
"我爱你",
"Я тебя люблю",
"Te iubesc",
"Kocham cię",
"Ik hou van jou",
"Szeretlek",
"Mahal kita",
"Anh yêu em",
"Aku cinta padamu",
"Saya cinta kamu",
"Σ' αγαπώ",
"Rakastan sinua",
"Jag älskar dig",
"Jeg elsker dig",
"Jeg elsker deg",
"Volim te",
"Miluji tě",
"Ľúbim ťa",
"Te aroha ahau ki a koe",
"Aloha wau iā ʻoe",
"Ngiyakuthanda",
"Ndinokuthanda",
"أنا أحبك",
"אני אוהב אותך"

];

function open100Panel(){

    document.getElementById("love100Panel")
        .classList.add("show");

    document.getElementById("terminal")
        .classList.add("terminalLeft");

}

function close100Panel(){

    document.getElementById("love100Panel")
        .classList.remove("show");

    document.getElementById("terminal")
        .classList.remove("terminalLeft");

}

/* =========================
   INIT
========================= */

updateAudioProgress();
updateSecretProgress();
checkAllSecrets();