let audios = [];
let filePrefixes = ["https://archive.org/download/omdatAhkamShHawbani/",
    "https://archive.org/download/ithafKiram/",
    "https://archive.org/download/kawaidFiqhiya/"
];
let lessonsNames = ["شرح عمدة الأحكام من كلام خير الأنام",
    "شرح إتحاف الكرام بفقه الرؤى والأحلام",
    "شرح منظومة القواعد الفقهية"
]
let jsonFileNames = ["omdatAhkam", "ithafKiram", "kawaidFiqhiya"]
let currentPlaylistIndex = parseInt(localStorage.getItem("currentPlaylistIndex")) || 0;
let currentIndex = parseInt(localStorage.getItem("lastLesson"+jsonFileNames[currentPlaylistIndex])) || 0;

let autoPlay = localStorage.getItem("autoPlay") === "true";
let isNaturalTimeUpdate = true;
let isVolumeDragging = false;
let volumeLevel = localStorage.getItem("volumeLevel");
let isMute = false;
const skipTime = 5;
let isDragging = false;
const speeds = [1, 1.25, 1.5, 1.75, 2];

const lessonName = document.getElementById("lessonName")


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
fetch("/json/" + jsonFileNames[currentPlaylistIndex] + ".json")
    .then(response => response.json())
    .then(data =>
    {
        audios = data;
        updateAudioPlayer();
        updatePaginationInput(currentIndex + 1);

        paginationSpinbox.setAttribute('maxlength', audios.length.toString().length);

        lessonName.innerText = lessonsNames[currentPlaylistIndex]
        if(lessonsNames[currentPlaylistIndex] === "شرح عمدة الأحكام من كلام خير الأنام")
        {
            document.getElementById("sideMain").innerHTML =
            `<h2>فهرس شرح عمدة الأحكام من كلام خير الأنام – كتاب الطهارة</h2>
				<p><strong>(المؤلف:</strong> الإمام الحافظ تقي الدين أبو محمد عبدالغني بن عبدالواحد المقدسي رحمه الله
					تعالى)</p>
				<section>
					<h3>كتاب الطهارة</h3><ul><li>الدرس <span class="lessonLink" data-lesson="1">1</span> - الدرس <span class="lessonLink" data-lesson="14">14</span></li></ul>
				</section>
				<section>
					<h3>باب الاستطابة</h3><ul><li>الدرس <span class="lessonLink" data-lesson="15">15</span> - الدرس <span class="lessonLink" data-lesson="18">18</span></li></ul>
				</section>
				<section>
					<h3>باب السواك</h3><ul><li>الدرس <span class="lessonLink" data-lesson="19">19</span></li></ul>
				</section>
				<section>
					<h3>باب المسح على الخفين</h3><ul><li>الدرس <span class="lessonLink" data-lesson="20">20</span> - الدرس <span class="lessonLink" data-lesson="22">22</span></li></ul>
				</section>
				<section>
					<h3>باب في المذي وغيره</h3><ul><li>الدرس <span class="lessonLink" data-lesson="23">23</span> - الدرس <span class="lessonLink" data-lesson="27">27</span></li></ul>
				</section>
				<section>
					<h3>باب الغسل من الجنابة</h3><ul><li>الدرس <span class="lessonLink" data-lesson="28">28</span> - الدرس <span class="lessonLink" data-lesson="34">34</span></li><li>الدرس <span class="lessonLink" data-lesson="35">35</span></li><li>الدرس <span class="lessonLink" data-lesson="36">36</span> - الدرس <span class="lessonLink" data-lesson="40">40</span></li></ul>
				</section>
				<section>
					<h3>باب التيمم</h3><ul><li>الدرس <span class="lessonLink" data-lesson="41">41</span></li><li>الدرس <span class="lessonLink" data-lesson="42">42</span> - الدرس <span class="lessonLink" data-lesson="49">49</span></li><li>الدرس <span class="lessonLink" data-lesson="50">50</span></li><li>الدرس <span class="lessonLink" data-lesson="51">51</span> - الدرس <span class="lessonLink" data-lesson="52">52</span></li></ul>
				</section>`

                document.querySelectorAll('.lessonLink').forEach(item => 
                    {
                        item.addEventListener('click', event => 
                        {
                            const lessonNumber = event.target.dataset.lesson;
                            goToPage(lessonNumber - 1)
                    
                            sideModal.style.display = "none";
                        });
                    });
        }
        // populateDatalist();
        console.log("filled data", audios.length)
    })
    .catch(error => console.error("Error loading audio data:", error));

audioElement.addEventListener("ended", async () => 
{
    if (autoPlay && isNaturalTimeUpdate) 
    {
        goToPage(currentIndex + 1);
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

//######################################################################

function populateDatalist()
{
    if (!audios.length) return; // Ensure audios is loaded  

    const datalist = document.getElementById("page-suggestions");
    datalist.innerHTML = ""; // Clear existing options  

    for (let i = 1; i <= audios.length; i++)
    {
        let option = document.createElement("option");
        option.value = i;
        datalist.appendChild(option);
    }
}


audioElement.addEventListener("loadedmetadata", function ()
{
    isNaturalTimeUpdate = false;
    const lastTime = localStorage.getItem(`audio-time-${currentIndex}-${jsonFileNames[currentPlaylistIndex]}`) || 0;

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

    localStorage.setItem(`audio-time-${currentIndex}-${jsonFileNames[currentPlaylistIndex]}`, audioElement.currentTime);

    const percent = (audioElement.currentTime / audioElement.duration) * 100;
    const currentProgress = parseFloat(progress.style.width) || 0;

    if (Math.abs(currentProgress - percent) > 0) // Small threshold to avoid micro-adjustments
    {
        updateSlider();
    }
};

function updateAudioPlayer()
{
    const audio = audios[currentIndex];
    if (!audio)
    {
        console.error("No audio found at index:", currentIndex);
        return;
    }

    localStorage.setItem("lastLesson"+jsonFileNames[currentPlaylistIndex], currentIndex);

    document.getElementById("audioTitle").textContent = audio.title;

    downloadLink.href = filePrefixes[currentPlaylistIndex] + audio.file;
    downloadLink.download = audio.file;

    //document.getElementById("description").innerHTML = audio.description;

    audioElement.src = filePrefixes[currentPlaylistIndex] + audio.file;
}

function updatePaginationInput(index)
{
    document.getElementById("pagination-spinbox").value = index; // Current page (1-based)
}

function goToPageFromSpinbox()
{
    if (paginationSpinbox.validity.valid)
    {
        let selectedPage = parseInt(paginationSpinbox.value);
        goToPage(selectedPage - 1);
    }
    else
    {
        if (paginationSpinbox.value === "")
        {
            paginationSpinbox.value = currentIndex + 1
        }
    }
}

function goToPage(index)
{
    if (index >= 0 && index < audios.length)
    {
        currentIndex = index;
        updateAudioPlayer();
        updatePaginationInput(currentIndex + 1);
    }
    else
    {
        console.log("invalid");
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
    loadingIcon.style.display =  "none";
}

function showPauseIcon()
{
    playIcon.style.display = "none";
    pauseIcon.style.display = "inline";
    loadingIcon.style.display =  "none";
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
document.getElementById("first").onclick = () => goToPage(0);
document.getElementById("last").onclick = () => goToPage(audios.length - 1);
document.getElementById("prev").onclick = () => goToPage(currentIndex - 1);
document.getElementById("next").onclick = () => goToPage(currentIndex + 1);

if ("mediaSession" in navigator) 
{
    navigator.mediaSession.metadata = new MediaMetadata(
        {
            title: `درس ${currentIndex + 1}`,
            artist: "دروس جامع مسائل العقيدة الصحيحة"
        });

    navigator.mediaSession.setActionHandler("nexttrack", goToPage(currentIndex + 1));
    navigator.mediaSession.setActionHandler("previoustrack", goToPage(currentIndex - 1));

    navigator.mediaSession.setActionHandler("seekbackward", seekBackward);
    navigator.mediaSession.setActionHandler("seekforward", seekForward);
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