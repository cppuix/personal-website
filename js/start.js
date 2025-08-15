let currentIndex = parseInt(localStorage.getItem("lastLesson")) || 0;
let audios = [];
let filePrefix = "https://ia600807.us.archive.org/21/items/dorosJami3MasailElAkida/";
let autoPlay = localStorage.getItem("autoPlay") === "true";
let isNaturalTimeUpdate = true;
let isVolumeDragging = false;
let volumeLevel = localStorage.getItem("volumeLevel");
let isMute = false;
const skipTime = 5;
let isDragging = false;
const speeds = [1, 1.25, 1.5, 1.75, 2];

//###################################################################

const themeSwitch = document.getElementById("themeSwitch");
const adviceButton = document.getElementById("adviceButton");

//####################################################################
//                      AUDIO ELEMENT
//####################################################################
const audioElement = document.getElementById("audio-player");
const downloadLink = document.getElementById("download-link");
const currentSpeedLabel = document.getElementById("currentSpeedLabel");
const increaseSpeed = document.getElementById("increaseSpeed");
const decreaseSpeed = document.getElementById("decreaseSpeed");

const playPause = document.getElementById("playPause");
const slider = document.getElementById("slider");
const thumb = document.getElementById("thumb");
const timeDisplay = document.getElementById("timeDisplay");
const progress = document.getElementById("progress");
const playIcon = document.getElementById("playIcon");
const pauseIcon = document.getElementById("pauseIcon");
const durationDisplay = document.getElementById("durationDisplay");
const backward = document.getElementById("backward");
const forward = document.getElementById("forward");

const paginationSpinbox = document.getElementById("pagination-spinbox");


//#########################################################################
//                          VOLUME ELEMENTS
//#########################################################################
const volumeRange = document.getElementById("volumeRange");
const volumeProgress = document.getElementById('volumeProgress');
const volumeButton = document.getElementById("volumeButton");
const volumeLabel = document.getElementById("volumeLabel");
const soundOffIcon = document.getElementById("soundOffIcon");
const soundOnIcon = document.getElementById("soundOnIcon");
const muteIcon = document.getElementById("muteIcon");
const volumeThumb = document.getElementById("volumeThumb");
const toggleVolumeSliderButton = document.getElementById("toggleVolumeSliderButton");
const volumeSliderContainer = document.getElementById("volumeSliderContainer");


const openVolumeSliderIcon = document.getElementById("openVolumeSliderIcon");
const closeVolumeSliderIcon = document.getElementById("closeVolumeSliderIcon");

//##################################################################

let currentSpeedIndex = parseInt(localStorage.getItem("speedIndex")) || 0;

volumeRange.value = volumeLevel || 50;

volumeLabel.textContent = (volumeLevel !== null) ? `%${volumeLevel}` : `${50}%`;
audioElement.volume = volumeRange.value / 100;


//##################################################
//                      THEME STUFF
//##################################################

if (localStorage.getItem("theme") === "light")  
{
    document.body.classList.add("light-mode");
}

themeSwitch.addEventListener("click", () =>
{
    document.body.classList.toggle("light-mode");
    const isLight = document.body.classList.contains("light-mode");
    localStorage.setItem("theme", isLight ? "light" : "dark");
});

//##################################################

if (autoPlay)
{
    autoPlayIcon.style.display = "inline";
    noAutoPlayIcon.style.display = "none";
}
else
{
    autoPlayIcon.style.display = "none";
    noAutoPlayIcon.style.display = "inline";
}

audioElement.playbackRate = speeds[currentSpeedIndex];
currentSpeedLabel.textContent = `${speeds[currentSpeedIndex]}`;

// Load first audio when data is available
fetch("/json/combined.json")
    .then(response => response.json())
    .then(data =>
    {
        audios = data;
        updateAudioPlayer();
        updatePaginationInput(currentIndex + 1);

        paginationSpinbox.setAttribute('maxlength', audios.length.toString().length);

        populateDatalist();
    })
    .catch(error => console.error("Error loading audio data:", error));