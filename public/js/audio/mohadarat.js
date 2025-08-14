let audios = [];
let filePrefix = "https://archive.org/download/mohadaratSheikhHawbani/";
let currentMohadaraIndex = parseInt(localStorage.getItem("lastMohadaraIndex")) || 0;

let autoPlay = localStorage.getItem("autoPlayMohadarat") === "true";
let isNaturalTimeUpdate = true;
let isVolumeDragging = false;
let volumeLevel = localStorage.getItem("volumeLevelMohadarat");
let isMute = false;
const skipTime = 5;
let isDragging = false;
const speeds = [1, 1.25, 1.5, 1.75, 2];

const lessonName = document.getElementById("mohadaraName")


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
const loadingIcon = document.getElementById("loadingIcon");

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
// const autoPlayIcon = document.getElementById("autoPlayIcon")
// const noAutoPlayIcon = document.getElementById("noAutoPlayIcon")

const openVolumeSliderIcon = document.getElementById("openVolumeSliderIcon");
const closeVolumeSliderIcon = document.getElementById("closeVolumeSliderIcon");

//##################################################################

let currentSpeedIndex = parseInt(localStorage.getItem("speedIndex")) || 0;

volumeRange.value = volumeLevel || 50;

volumeLabel.textContent = (volumeLevel !== null) ? `%${volumeLevel}` : `${50}%`;
audioElement.volume = volumeRange.value / 100;


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

//Load first audio when data is available
fetch("/json/mohadarat.json")
    .then(response => response.json())
    .then(data =>
    {
        audios = data;
        updateAudioPlayer();
        console.log("currentMohadaraIndex", currentMohadaraIndex)
        updatePaginationInput(getMohadaraNameFromIndex(currentMohadaraIndex));

        mediaSessionSetup();

        paginationSpinbox.setAttribute('maxlength', audios.length.toString().length);
    })
    .catch(error => console.error("Error loading audio data:", error));

audioElement.addEventListener("ended", async () => 
{
    if (autoPlay && isNaturalTimeUpdate) 
    {
        selectMohadaraFromIndex(currentMohadaraIndex + 1);
        try 
        {
            await audioElement.play();
            await requestWakeLock();
        }
        catch (err) 
        {
            console.error("Failed to play next audio:", err);
        }
    }
});

//############################## AUDIO SPEED ###########################

increaseSpeed.addEventListener("click", function ()
{
    currentSpeedIndex = (currentSpeedIndex + 1) % speeds.length;
    audioElement.playbackRate = speeds[currentSpeedIndex];
    currentSpeedLabel.textContent = `${speeds[currentSpeedIndex]}`;;
    localStorage.setItem("speedIndex", currentSpeedIndex);
});

decreaseSpeed.addEventListener("click", function ()
{
    currentSpeedIndex = (currentSpeedIndex - 1 + speeds.length) % speeds.length;
    audioElement.playbackRate = speeds[currentSpeedIndex];
    currentSpeedLabel.textContent = `${speeds[currentSpeedIndex]}`;;
    localStorage.setItem("speedIndex", currentSpeedIndex);
});


audioElement.addEventListener("loadedmetadata", function ()
{
    isNaturalTimeUpdate = false;
    const lastTime = localStorage.getItem(`audio-time-${currentMohadaraIndex}-mohadarat}`) || 0;

    // if (Math.round(lastTime * 1000) === Math.round(audioElement.duration * 1000))
    // {
    //     showPlayIcon();
    // }

    //assuming the new loaded audio should be paused
    //otherweise, the above needs tweaking then readding
    showPlayIcon();
    audioElement.currentTime = parseFloat(lastTime);
    audioElement.playbackRate = speeds[currentSpeedIndex];
});

audioElement.addEventListener("timeupdate", moveProgress);

function moveProgress()
{
    if (!audioElement.duration)
    {
        return;
    }

    localStorage.setItem(`audio-time-${currentMohadaraIndex}-mohadarat`, audioElement.currentTime);

    const percent = (audioElement.currentTime / audioElement.duration) * 100;
    const currentProgress = parseFloat(progress.style.width) || 0;

    if (Math.abs(currentProgress - percent) > 0) // Small threshold to avoid micro-adjustments
    {
        updateSlider();
    }
};

function updateAudioPlayer()
{
    const audio = audios[currentMohadaraIndex];
    if (!audio)
    {
        console.error("No audio found at index:", currentMohadaraIndex);
        return;
    }

    localStorage.setItem("lastMohadaraIndex", currentMohadaraIndex);

    document.getElementById("audioTitle").textContent = audio.title;

    downloadLink.href = filePrefix + audio.file;
    downloadLink.download = audio.file;

    //document.getElementById("description").innerHTML = audio.description;

    audioElement.src = filePrefix + audio.file;
}

function updatePaginationInput(mohadaraName)
{
    document.getElementById("pagination-spinbox").value = mohadaraName;
}

function selectMohadaraFromSpinbox()
{
    if (paginationSpinbox.value === "")
    {
        paginationSpinbox.value = getMohadaraNameFromIndex(currentMohadaraIndex);
    }
    else
    {
        selectMohadaraFromName(paginationSpinbox.value);
    }
}

function getSuggestionIndex(mohadaraName)
{
    const options = document.getElementById("mohadara-suggestions").getElementsByTagName("option");
    let index = -1;

    for (let i = 0; i < options.length; i++)
    {
        if (options[i].value === mohadaraName)
        {
            index = i;
            break;
        }
    }

    return index;
}

function getMohadaraNameFromIndex(index)
{
    console.log("getMohadaraNameFromIndex: ", index)
    const options = document.getElementById("mohadara-suggestions").getElementsByTagName("option");

    if (index >= 0 && index < options.length)
    {
        return options[index].value;
    }

    return null; // Return null if the index is out of bounds
}

function selectMohadaraFromIndex(index)
{
    if (index >= 0 && index < audios.length)
    {
        let mohadaraName = getMohadaraNameFromIndex(index);
        currentMohadaraIndex = index;
        updateAudioPlayer();
        updatePaginationInput(mohadaraName);
        paginationSpinbox.style.border = 'none'
    }
    else
    {
        paginationSpinbox.style.border = '1px solid red'
        console.log("selectMohadaraFromIndex - invalid index: ", index);
    }
}

function selectMohadaraFromName(mohadaraName)
{
    let index = getSuggestionIndex(mohadaraName);

    if (index >= 0 && index < audios.length)
    {
        currentMohadaraIndex = index;
        updateAudioPlayer();
        updatePaginationInput(mohadaraName);
        paginationSpinbox.style.border = 'none'
    }
    else
    {
        paginationSpinbox.style.border = '1px solid red'
        console.log("selectMohadaraFromName - invalid index", index);
    }
}

backward.addEventListener("click", seekBackward);
function seekBackward()
{
    audioElement.currentTime = Math.max(0, audioElement.currentTime - skipTime);
}

forward.addEventListener("click", seekForward);
function seekForward()
{
    audioElement.currentTime = Math.min(audioElement.duration, audioElement.currentTime + skipTime);
}

audioElement.addEventListener("loadedmetadata", () => 
{
    durationDisplay.textContent = formatTime(audioElement.duration);
});

playPause.addEventListener("click", () => 
{
    if (audioElement.paused) 
    {
        audioElement.play().catch(console.error);
    }
    else 
    {
        audioElement.pause();
    }
});

audioElement.addEventListener("playing", () =>
{
    isNaturalTimeUpdate = true;
    showPauseIcon();
});

audioElement.addEventListener("pause", showPlayIcon);
audioElement.addEventListener("loadstart", showLoading);

function showLoading()
{
    playIcon.style.display = "none";
    pauseIcon.style.display = "none";
    loadingIcon.style.display = "inline";
}

function showPlayIcon()
{
    playIcon.style.display = "inline";
    pauseIcon.style.display = "none";
    loadingIcon.style.display = "none";
}

function showPauseIcon()
{
    playIcon.style.display = "none";
    pauseIcon.style.display = "inline";
    loadingIcon.style.display = "none";
}

//audioElement.addEventListener("timeupdate", updateSlider);

slider.addEventListener("click", (e) =>
{
    const rect = slider.getBoundingClientRect();
    const percent = (rect.right - e.clientX) / rect.width; // RTL Fix
    audioElement.currentTime = percent * audioElement.duration;
});

//#######################################################

thumb.addEventListener("mousedown", thumbPressed);
thumb.addEventListener("touchstart", thumbPressed);

function thumbPressed()
{
    isDragging = true;
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("touchmove", onDrag);

    document.addEventListener("mouseup", () => 
    {
        isDragging = false;
        document.removeEventListener("mousemove", onDrag);
    });
    document.addEventListener("touchend", () => 
    {
        isDragging = false;
        document.removeEventListener("touchmove", onDrag);
    });
}

function onDrag(event) 
{
    if (!isDragging) return;

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;

    const sliderRect = slider.getBoundingClientRect();
    let percent = ((sliderRect.right - clientX) / sliderRect.width) * 100;
    percent = Math.max(0, Math.min(100, percent));

    //thumb.style.right = `${percent}%`;
    //progress.style.width = `${percent}%`;

    audioElement.currentTime = (percent / 100) * audioElement.duration;
}

audioElement.addEventListener("seeking", moveProgress)

//##################################################

function formatTime(seconds) 
{
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
}

function updateSlider() 
{
    const percent = (audioElement.currentTime / audioElement.duration) * 100;

    thumb.style.right = `${percent}%`;
    progress.style.width = `${percent}%`;
    timeDisplay.textContent = formatTime(audioElement.currentTime);
}

//##########################VOLUME#########################


volumeButton.addEventListener("click", toggleMute);

function showSoundOnIcon()
{
    soundOnIcon.style.display = "inline";
    soundOffIcon.style.display = "none";
    muteIcon.style.display = "none";
}

function showSoundOffIcon()
{
    soundOnIcon.style.display = "none";
    soundOffIcon.style.display = "inline";
    muteIcon.style.display = "none";
}

function showMuteIcon()
{
    soundOnIcon.style.display = "none";
    soundOffIcon.style.display = "none";
    muteIcon.style.display = "inline";
}

function showOpenVolumeSliderIcon()
{
    openVolumeSliderIcon.style.display = "none";
    closeVolumeSliderIcon.style.display = "inline";
}

function showCloseVolumeSliderIcon()
{
    openVolumeSliderIcon.style.display = "inline";
    closeVolumeSliderIcon.style.display = "none";
}

function toggleMute()
{
    audioElement.muted = !audioElement.muted
    toggleVolumeButtonIcon()
}

function rangeSlide(value)
{
    volumeProgress.style.height = `${value}%`;

    audioElement.volume = value / 100;
    volumeLabel.innerText = `%${value}`;
    localStorage.setItem("volumeLevel", value);
}

toggleVolumeSliderButton.addEventListener("click", () =>
{
    volumeSliderContainer.classList.toggle('show');
    toggleVolumeSliderButton.classList.toggle('hidden');

    if (volumeSliderContainer.classList.contains('show'))
    {
        showOpenVolumeSliderIcon()
    }
    else
    {
        showCloseVolumeSliderIcon()
    }
})

audioElement.addEventListener("volumechange", toggleVolumeButtonIcon)

function toggleVolumeButtonIcon()
{
    if (audioElement.muted)
    {
        if (muteIcon.style.display === "none")
        {
            showMuteIcon()
        }
    }
    else
    {
        if (audioElement.volume * 100 > 0)
        {
            if (soundOnIcon.style.display === "none")
            {
                showSoundOnIcon()
            }
        }
        else
        {
            if (soundOffIcon.style.display === "none")
            {
                showSoundOffIcon()
            }
        }
    }
};

document.addEventListener('click', (event) => 
{
    if (volumeSliderContainer.classList.contains('show')
        && !volumeSliderContainer.contains(event.target) && !toggleVolumeSliderButton.contains(event.target))
    {
        volumeSliderContainer.classList.remove('show');
        showCloseVolumeSliderIcon()
    }
});

rangeSlide(volumeRange.value)
// volumeThumb.addEventListener("mousedown", volumeThumbPressed);
// volumeThumb.addEventListener("touchstart", volumeThumbPressed);

// function volumeThumbPressed()
// {
//     isVolumeDragging = true;
//     document.addEventListener("mousemove", onVolumeDrag);
//     document.addEventListener("touchmove", onVolumeDrag);

//     document.addEventListener("mouseup", () =>
//     {
//         isVolumeDragging = false;
//         document.removeEventListener("mousemove", onVolumeDrag);
//     });
//     document.addEventListener("touchend", () =>
//     {
//         isVolumeDragging = false;
//         document.removeEventListener("touchmove", onVolumeDrag);
//     });
// }

// function onVolumeDrag(event)
// {
//     if (!isVolumeDragging) return;

//     const clientX = event.touches ? event.touches[0].clientX : event.clientX;

//     const sliderRect = volumeRange.getBoundingClientRect();
//     let percent = ((sliderRect.right - clientX) / sliderRect.width) * 100;
//     percent = Math.max(0, Math.min(100, percent));

//     // thumb.style.right = `${percent}%`;
//     // progress.style.width = `${percent}%`;

//     volumeRange.value = (percent / 100) * audioElement.duration;
// }

// Navigation buttons
document.getElementById("first").onclick = () => selectMohadaraFromIndex(0);
document.getElementById("last").onclick = () => selectMohadaraFromIndex(audios.length - 1);
document.getElementById("prev").onclick = () => selectMohadaraFromIndex(currentMohadaraIndex - 1);
document.getElementById("next").onclick = () => selectMohadaraFromIndex(currentMohadaraIndex + 1);

// document.querySelectorAll('.lessonLink').forEach(item => 
// {
//     item.addEventListener('click', event => 
//     {
//         const lessonNumber = event.target.dataset.lesson;
//         selectMohadaraFromName(lessonNumber - 1)

//         sideModal.style.display = "none";
//     });
// });

function mediaSessionSetup()
{
    if ("mediaSession" in navigator) 
    {
        navigator.mediaSession.metadata = new MediaMetadata(
            {
                title: `درس ${currentMohadaraIndex + 1}`,
                artist: "دروس جامع مسائل العقيدة الصحيحة"
            });

        navigator.mediaSession.setActionHandler("nexttrack", () => selectMohadaraFromIndex(currentMohadaraIndex + 1));
        navigator.mediaSession.setActionHandler("previoustrack", () => selectMohadaraFromIndex(currentMohadaraIndex - 1));

        navigator.mediaSession.setActionHandler("seekbackward", seekBackward);
        navigator.mediaSession.setActionHandler("seekforward", seekForward);
    }
}

async function requestWakeLock() 
{
    try 
    {
        if ("wakeLock" in navigator) 
        {
            wakeLock = await navigator.wakeLock.request("screen");
            console.log("Screen Wake Lock activated");
        }
    }
    catch (err) 
    {
        console.error("Failed to activate wake lock:", err);
    }
}

audioElement.addEventListener("play", requestWakeLock);



// let currentFetchController = null;

// function setDownloadLink(audio) {
//     // Abort any ongoing fetch
//     if (currentFetchController) {
//         currentFetchController.abort();
//     }

//     currentFetchController = new AbortController();
//     const { signal } = currentFetchController;

//     downloadLink.textContent = "جاري التحميل...";
//     downloadLink.style.pointerEvents = "none";
//     downloadLink.style.opacity = "0.5";

//     fetch(filePrefix + audio.file, { signal })
//         .then(response => response.blob())
//         .then(blob => {
//             const blobURL = URL.createObjectURL(blob);
//             downloadLink.href = blobURL;
//             downloadLink.download = audio.file;

//             downloadLink.textContent = "تحميل الصوتية";
//             downloadLink.style.pointerEvents = "auto";
//             downloadLink.style.opacity = "1";
//         })
//         .catch(error => {
//             if (error.name === 'AbortError') {
//                 console.log('Download aborted.');
//             } else {
//                 console.error('Error:', error);
//                 downloadLink.textContent = "فشل التحميل";
//             }
//         });
// }