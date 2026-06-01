function unlockSite(){

    const pass =
        document
        .getElementById(
            "passwordInput"
        )
        .value;

    const error =
        document
        .getElementById(
            "loginError"
        );

    if(pass==="Potato"){

        document
            .getElementById(
                "loginScreen"
            )
            .style.display="none";

        document
            .getElementById(
                "mainSite"
            )
            .style.display="block";
    }

    else{

        error.innerHTML =
            "Access denied";
    }
}

document.addEventListener(
    "DOMContentLoaded",
    ()=>{

        const input =
            document
            .getElementById(
                "passwordInput"
            );

        input.addEventListener(
            "keydown",
            e=>{

                if(
                    e.key==="Enter"
                ){

                    unlockSite();
                }
            }
        );
    }
);

/* =========================
   ELEMENTS
========================= */

const TOTAL_SECRETS = 6;
let noteOpen = false;
let popupOpen = false;

const intro=
document.getElementById("intro");

const noteScreen=
document.getElementById("noteScreen");

const player=
document.getElementById("audioPlayer");

/* =========================
   SAVE
========================= */

function saveProgress(){

    localStorage.setItem(
        "heardAudios",
        JSON.stringify(
            [...heardAudios]
        )
    );

    localStorage.setItem(
        "secrets",
        JSON.stringify(secrets)
    );

    updateAudioProgress();

    function updateSecretProgress(){

    const bar =
        document.getElementById(
            "secretProgressBar"
        );

    const text =
        document.getElementById(
            "secretProgressText"
        );

    const resetBtn =
        document.getElementById(
            "resetBtn"
        );

    const finishedBtn =
        document.getElementById(
            "finishedBtn"
        );

    const found =
        Object.values(
            secrets
        ).filter(Boolean).length;

    const percent =
        (found / TOTAL_SECRETS) * 100;

    bar.style.width =
        percent + "%";

    /* MAIN MENU */

    if(
        noteOpen !== true
    ){

        text.innerHTML =
            `${found}/${TOTAL_SECRETS}`;

        resetBtn.style.display =
            "block";

        finishedBtn.style.display =
            "none";

        return;
    }

    /* NOTE OPEN */

    text.innerHTML = "";

    resetBtn.style.display =
        "none";

    if(
        found === TOTAL_SECRETS
    ){

        finishedBtn.style.display =
            "block";

    } else {

        finishedBtn.style.display =
            "none";
    }
    }
}

/* =========================
   AUDIO BAR
========================= */

function updateAudioProgress(){

    const text=
        document.getElementById(
            "audioProgressText"
        );

    const fill=
        document.getElementById(
            "audioFill"
        );

    const count=
        heardAudios.size;

    text.innerHTML=
        `Audios Found: ${count}/20`;

    fill.style.width=
        `${(count/20)*100}%`;
}

/* =========================
   OPEN NOTE
========================= */

function openNote(){

     noteOpen = true;

    updateSecretProgress();

    intro.style.display="none";

    noteScreen.style.display="flex";
}

/* =========================
   GO BACK
========================= */

function goBack(){

    noteOpen = false;

    updateSecretProgress();

    noteScreen.style.display="none";

    intro.style.display="flex";

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}

/* =========================
   AUDIO
========================= */

const audios=[
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

/* =========================
   PLAY RANDOM AUDIO
========================= */

function playRandomAudio(){

    const popup =
        document.getElementById(
            "audioPopup"
        );

    const popupText =
        document.getElementById(
            "audioText"
        );

    const randomIndex =
        Math.floor(
            Math.random() * audios.length
        );

    const randomAudio =
        audios[randomIndex];

    const audioId =
        String(randomIndex + 1);

    const messages = [
        "ily",
        ":3",
        "i like you",
        "hehe",
        "ur pretty",
        "Elo",
        "💜"
    ];

    const randomMessage =
        messages[
            Math.floor(
                Math.random() *
                messages.length
            )
        ];

    /* SAVE ONLY IF NEW */

if (!heardAudios.has(audioId)) {
    heardAudios.add(audioId);
    saveProgress();
}

    /* PLAY */

    player.pause();

    player.src = randomAudio;

    player.volume = 1;

    player.load();

    player.play().catch(()=>{});

    /* SHOW */

    popup.classList.add(
        "showPopup"
    );

    popupText.innerHTML =
        `Playing: ${randomIndex + 1}/20`;

    player.onended = null;

    player.onended = () => {

        /* 30% secret chance */

        const showSecret = Math.random() < 0.3;

    if (
        heardAudios.size === 20 &&
        showSecret
    ) {

        if (!secrets.c1) {
            secrets.c1 = true;
            checkAllSecrets();
        }

        popupText.innerHTML =
            "i also like hearing you talk 💜 (c1)";

        popup.classList.add("showPopup");

        setTimeout(() => {
            popup.classList.remove("showPopup");
        }, 2000);

        } else {

            /* normal msg */

            popupText.innerHTML =
                randomMessage;

            setTimeout(() => {

                popup.classList.remove(
                    "showPopup"
                );

            }, 1000);
        }
    };
}

/* =========================
   HEART ANIMATION
========================= */

function spawnHearts(){

    const emojis=[
        "💜",
        "❤️",
        "💕",
        "💖",
        "💞",
        "✨"
    ];

    /* SECRET HEART SPAM */

    const now=Date.now();

    if(now-firstHeartClick>2000){

        firstHeartClick=now;

        heartClicks=0;
    }

    heartClicks++;

    if(heartClicks>=7){

        const note=
        document.getElementById("secretNote");

        note.style.display="block";

        note.innerHTML=
        "You found me! (b7)";

        secrets.b7=true;

        checkAllSecrets();

        setTimeout(()=>{

            note.style.display="none";

        },3000);

        heartClicks=0;
    }

    /* HEART EFFECT */

    for(let i=0;i<35;i++){

        setTimeout(()=>{

            let heart=
            document.createElement("div");

            heart.innerHTML=
            emojis[
                Math.floor(
                    Math.random()*emojis.length
                )
            ];

            Object.assign(heart.style,{

                position:"fixed",

                left:
                Math.random()*100+"vw",

                bottom:"-50px",

                fontSize:
                (Math.random()*25+18)+"px",

                zIndex:"999999",

                pointerEvents:"none",

                opacity:"1",

                transition:
                "transform 5s ease-out, opacity 5s ease-out"
            });

            document.body.appendChild(heart);

            const drift=
            Math.random()*200-100;

            const rotate=
            Math.random()*720-360;

            const scale=
            Math.random()*1.5+1;

            setTimeout(()=>{

                heart.style.transform=
                `translate(${drift}px,-120vh)
                rotate(${rotate}deg)
                scale(${scale})`;

                heart.style.opacity="0";

            },30);

            setTimeout(()=>{

                heart.remove();

            },5000);

        },i*120);
    }
}

let heartClicks=0;
let firstHeartClick=0;

/* =========================
   SECRET SYSTEM
========================= */

const secrets={

    a0:false,
    b7:false,
    c1:false,
    d1:false,
    e7:false,
    drag:false
};

/* =========================
   SAVE SYSTEM
========================= */

let heardAudios=
    new Set(
        JSON.parse(
            localStorage.getItem("heardAudios")
        ) || []
    );

/* LOAD SAVED SECRETS */

const savedSecrets=
    JSON.parse(
        localStorage.getItem("yuriSecrets")
    );

if(savedSecrets){

    Object.assign(
        secrets,
        savedSecrets
    );
}

function resetProgress() {

    /* clear saved progress */

    localStorage.removeItem("heardAudios");
    localStorage.removeItem("yuriSecrets");

    /* clear audio set safely */

    heardAudios.clear();

    /* reset every secret safely */

    for (const key in secrets) {
        secrets[key] = false;
    }

    /* update UI */

    updateAudioProgress();
    updateSecretProgress();

    /* hide final button */

    const finalBtn =
        document.getElementById("finalSecretBtn");

    if (finalBtn) {
        finalBtn.style.display = "none";
    }

    /* hide note */

    const note =
        document.getElementById("secretNote");

    if (note) {
        note.style.display = "none";
    }

    /* save cleared state */

    saveProgress();
}

/* =========================
   FINAL SECRET CHECK
========================= */

function checkAllSecrets(){

    saveProgress();

    updateSecretProgress();

/* =========================
SAVE PROGRESS
========================= */

function saveProgress() {
    localStorage.setItem(
        "yuriSecrets",
        JSON.stringify(secrets)
    );

    localStorage.setItem(
        "heardAudios",
        JSON.stringify([...heardAudios])
    );

    updateAudioProgress();
    updateSecretProgress();
}

    const done=
        Object.values(secrets)
        .every(v=>v===true);

    if(done){

        const progress=
            document.getElementById(
                "secretProgress"
            );

        progress.style.opacity="0";

        progress.style.transform=
            "translateY(20px)";

        progress.style.transition=
            "1s";

        setTimeout(()=>{

            progress.style.display="none";

            document
            .getElementById("finalSecretBtn")
            .style.display="block";

        },1000);
    }
}

/* =========================
   SECRET PROGRESS UI
========================= */

function updateSecretProgress(){

    const total=
        Object.keys(secrets).length;

    const found=
        Object.values(secrets)
        .filter(v=>v).length;

    document.getElementById(
        "secretProgressText"
    ).innerHTML=
        `Secrets: ${found}/${total}`;

    document.getElementById(
        "secretFill"
    ).style.width=
        (found/total*100)+"%";
}

/* =========================
   SEE SECRET
========================= */

function showSeeSecret(){

    document
    .getElementById("secretNote")
    .style.display="block";

    document
    .getElementById("secretNote")
    .innerHTML=
        "see you too (d1)";

    secrets.d1=true;

    checkAllSecrets();

    setTimeout(()=>{

        document
        .getElementById("secretNote")
        .style.display="none";

    },3000);
}

/* =========================
   ENTER TERMINAL
========================= */

document.addEventListener("keydown", e => {

    if (e.key !== "Enter") return;

    /* only inside note */

    if (!noteOpen) return;

    /* popup visible? do nothing */

    if (popupOpen) return;

    const secretBox =
        document.getElementById(
            "secretBox"
        );

    /* already typing? */

    if (
        document.activeElement &&
        document.activeElement.id ===
        "secretInput"
    ) {
        return;
    }

    secretBox.style.display =
        "block";

    document
        .getElementById(
            "secretInput"
        )
        .focus();

    secrets.a0 = true;

    checkAllSecrets();
});

/* =========================
   CLOSE SECRET BOX
========================= */

function closeSecretBox(){

    document
    .getElementById("secretBox")
    .style.display="none";
}

/* =========================
   SECRET CODE CHECKER
========================= */

const validCodes=[
    "143",
    "ily",
    "yuri",
    "love",
    "a0",
    "b7",
    "c1"
];

const fakeErrors=[

    "Error: Too cute",

    "Error: You're too pretty",

    "Error: Love overload",

    "Error: Hug required",

    "Error: Heart stolen"
];

function checkSecretCode(){

    const input=
        document
        .getElementById("secretInput")
        .value
        .toLowerCase();

    const error=
        document
        .getElementById("secretError");

    /* SECRET 0711 */

    if(input==="0711"){

    const unlockDate =
        new Date("2026-07-11T00:00:00");

    const today =
        new Date();

    /* BEFORE JULY 11 */

    if(today < unlockDate){

        const secretBox =
            document.getElementById(
                "secretBox"
            );

        secretBox.style.left="32%";

        const old =
            document.getElementById(
                "foundPopup"
            );

        if(old){
            old.remove();
        }

        const found =
            document.createElement("div");

        found.id="foundPopup";

        found.innerHTML=`
            <button id="closeFoundPopup">✕</button>

            <h2>
                Come back on July 11 and try again!
            </h2>

            <p>
                (I'm also waiting &lt;3)
            </p>
        `;

        document.body.appendChild(found);

        setTimeout(()=>{

            found.classList.add(
                "showFound"
            );

        },20);

        document
            .getElementById(
                "closeFoundPopup"
            )
            .onclick=()=>{

                found.remove();

                secretBox.style.left="50%";
            };

        return;
    }

    /* JULY 11 OR LATER */

    secrets.e7 = true;

    checkAllSecrets();

    error.innerHTML =
        "Accepted 💜";

    return;
}

    /* NORMAL VALID CODES */

    if(validCodes.includes(input)){

        error.innerHTML=
            "Accepted 💜";
    }

    else{

        error.innerHTML=
            fakeErrors[
                Math.floor(
                    Math.random()*fakeErrors.length
                )
            ];
    }
}

/* =========================
   PHOTO 8 SECRET
========================= */

const photo8=
document.querySelector(".p8");

const photoSecret=
document.getElementById("photoSecret");

if(photo8){

    photo8.addEventListener("mouseenter",()=>{

        photo8.style.opacity=".3";

        photoSecret.style.opacity="1";
    });

    photo8.addEventListener("mouseleave",()=>{

        photo8.style.opacity="1";

        photoSecret.style.opacity="0";
    });
}

/* =========================
   DRAGGABLE PHOTOS
========================= */

const photos=
document.querySelectorAll(".edge-photo");

photos.forEach(photo=>{

     /* DISABLE DRAG FOR 8.png */

    if(
        photo.classList.contains("p8") ||
        photo.closest(".photoSecretWrap")
    ) return;

    photo.style.pointerEvents="auto";

    photo.style.cursor="grab";

    let dragging=false;

    let offsetX=0;
    let offsetY=0;

    photo.addEventListener("mousedown",e=>{

        dragging=true;

        secrets.drag=true;

        checkAllSecrets();

        offsetX=
        e.clientX-photo.offsetLeft;

        offsetY=
        e.clientY-photo.offsetTop;

        photo.style.zIndex="99999";

        photo.style.cursor="grabbing";

        e.preventDefault();
    });

    document.addEventListener("mousemove",e=>{

        if(!dragging) return;

        photo.style.left=
        (e.clientX-offsetX)+"px";

        photo.style.top=
        (e.clientY-offsetY)+"px";
    });

    document.addEventListener("mouseup",()=>{

        dragging=false;

        photo.style.cursor="grab";
    });
});

/* =========================
   FINAL BUTTON
========================= */

function finishSecrets(){

    alert(
        "more coming soon 💜"
    );
}

/* =========================
   RESET SYSTEM
========================= */

function resetProgress() {

    localStorage.removeItem("heardAudios");
    localStorage.removeItem("yuriSecrets");

    /* clear audios */
    heardAudios.clear();

    /* reset secrets */
    secrets.a0 = false;
    secrets.b7 = false;
    secrets.c1 = false;
    secrets.d1 = false;
    secrets.e7 = false;
    secrets.drag = false;

    updateAudioProgress();
    updateSecretProgress();

    const finalBtn =
        document.getElementById("finalSecretBtn");

    if (finalBtn) {
        finalBtn.style.display = "none";
    }

    const note =
        document.getElementById("secretNote");

    if (note) {
        note.style.display = "none";
    }

    saveProgress();
}

/* =========================
   INITIAL LOAD
========================= */

updateSecretProgress();

checkAllSecrets();

updateAudioProgress();