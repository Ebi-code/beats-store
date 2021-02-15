(function () {
    // Set Attributes function
    function setAttributes(elem, attrs) {
        for (let key in attrs) {
            elem.setAttribute(key, attrs[key]);
        }
    }

    // Select Elements
    const videoItems = [...document.querySelectorAll(".video-item")],
        videoWrapper = document.querySelector(".video-player-wrapper"),
        videoPlayerHoldor = document.querySelector(".video-player"),
        videoBannerImg = document.querySelector(".media-player"),
        videoPlayBtn = document.getElementById("video-play-btn"),
        videoList = document.querySelector(".video-list"),
        videoControls = document.querySelector(".video-controls");

    // Create Elements
    const mediaPlayer = document.createElement("video"),
        playPause = document.createElement("button"),
        volumesElement = document.createElement("span"),
        volumeRange = document.createElement("input"),
        volumeButton = document.createElement("button"),
        setting = document.createElement("button"),
        fullScreen = document.createElement("button"),
        progress = document.createElement("div"),
        progressBarBg = document.createElement("div"),
        progressBar = document.createElement("span"),
        timeState = document.createElement("span");

    let progressHeight, interval, percentage, mediaPlayerWidth;

    // Select Elements Attributes
    const videoSrc = videoBannerImg.getAttribute("data-src");

    // Create attribute 
    setAttributes(volumeRange, {
        "type": "range",
        "name": "volume",
        "class": "range-value",
        "min": 0,
        "max": 100,
        "step": 2,
        "value": 50
    });
    setAttributes(playPause, {
        "class": videoPlayBtn.getAttribute("class"),
        "id": "play-btn"
    });
    setAttributes(progressBar, {
        "id": "progress-bar",
        "min": 0,
        "max": 100,
        "value": 0,
        "class": "progress-player"
    });

    let playerIndex = 0;
    let playerArray = [];

    // Add class to media buttons
    volumeButton.classList.add("media-btn");
    setting.classList.add("media-btn");
    fullScreen.classList.add("media-btn");
    progressBarBg.classList.add("progress-bg");
    progress.classList.add("progress");
    timeState.classList.add("time-state");

    // Insert HTML in Elements Button
    volumeButton.innerHTML = "&#128362;";
    fullScreen.innerHTML = "&#9974;";
    setting.innerHTML = "&#9881;";


    class Videos {
        constructor() {
            this.init();
        }

        init() {
            mediaPlayer.controls = false;
            this.eventListeners();
            this.getvideoItems();
            this.getAllMedia();
        }
        
        initialiseControls() {
            videoWrapper.addEventListener("mouseout", this.hideControls.bind(this));
            interval = setInterval(this.progressBarUpdate.bind(this), 10);
            setTimeout(this.hideControls.bind(this), 2000);
            mediaPlayerWidth = mediaPlayer.style.width = "100%";
            mediaPlayer.style.height = "auto";
            progress.style.width = mediaPlayerWidth;
            videoList.style.width = mediaPlayerWidth;
        }
        
        eventListeners() {
            videoPlayBtn.addEventListener("click", this.getVideoSource.bind(this));
            playPause.addEventListener("click", this.togglePlayPause.bind(this));
            mediaPlayer.addEventListener("click", this.togglePlayPause.bind(this));
            volumeRange.addEventListener("click", this.changeVolume.bind(this));
            volumeButton.addEventListener("click", this.muteVolume.bind(this));
            fullScreen.addEventListener("click", this.getFullScreen.bind(this));
            progressBarBg.addEventListener("click", this.clickProgressBar.bind(this));
            videoWrapper.addEventListener("mouseover", this.showControls.bind(this));
            videoWrapper.addEventListener("mousemove", this.showControls.bind(this));
            videoList.addEventListener("mouseover", this.showControls.bind(this));
        }

        appentElements() {
            // Append Elements in Elements
            videoBannerImg.after(mediaPlayer);
            mediaPlayer.after(playPause);
            videoControls.appendChild(volumesElement);
            volumesElement.appendChild(volumeButton);
            volumesElement.appendChild(volumeRange);
            videoControls.appendChild(setting);
            videoControls.appendChild(fullScreen);
            videoList.before(progress);
            progress.appendChild(progressBarBg);
            progress.appendChild(timeState);
            progressBarBg.appendChild(progressBar);

            mediaPlayer.classList.remove("d-none");
            videoBannerImg.classList.add("d-none");
            // mediaPlayer.classList.remove("d-none");
            videoPlayBtn.classList.add("d-none");
        }

        getVideoSource(e) {
            // Create attributes for Elements
            setAttributes(mediaPlayer, {
                "src": videoSrc,
                "class": "d-none media-player"
            });
            this.appentElements();
            this.togglePlayPause();
            e.preventDefault();
        }

        getvideoItems() {
            videoItems.forEach((item, index) => {
                item.addEventListener("click", (event) => {
                    let elem = event.target;
                    if (elem.classList.contains("video-item")) {
                        this.currentMedia(index);
                    }
                }, false)
            })
        }

        getAllMedia() {
            videoItems.forEach((item, index) => {
                playerArray.push({
                    mediaItem: item,
                    mediaIndex: index
                })
            });
        }

        currentMedia(index) {
            playerIndex = index;
            playerArray.forEach((item, itemIndex) => {
                if (playerIndex === itemIndex) {
                    setAttributes(mediaPlayer, {
                        "src": `${item.mediaItem.getAttribute("data-src")}`,
                        "type": "video/mp4",
                    });
                    this.togglePlayPause();
                    this.appentElements();
                }
            })
        }

        showControls() {
            playPause.classList.remove("fade-hide");
            playPause.classList.add("fade-show");
            videoList.style.bottom = progressHeight;
            timeState.style.display = "block";
        }

        hideControls() {
            playPause.classList.remove("fade-show");
            playPause.classList.add("fade-hide");
            videoList.style.bottom = "-100%";
            timeState.style.display = "none";
        }

        progressBarUpdate() {
            progressHeight = progress.style.height = "20px";
            progressBarBg.style.height = progressHeight;
            // videoList.style.bottom = progressHeight;
            percentage = Math.abs((100 / mediaPlayer.duration) * mediaPlayer.currentTime);
            progressBar.style.cssText = `width: ${percentage}%;`;
            this.updatePlayTime();
        }

        updatePlayTime() {
            let minutes = Math.floor(mediaPlayer.currentTime / 60 % 60);
            let seconds = Math.floor(mediaPlayer.currentTime % 60);
            if (seconds < 10) {
                seconds = `0${seconds}`;
            }
            if (minutes < 10) {
                minutes = `0${minutes}`;
            }
            timeState.innerHTML = `${minutes}:${seconds}`;
            timeState.style.left = `${percentage - 3}%`;
        }

        clickProgressBar(e) {
            if (!mediaPlayer.paused && !mediaPlayer.ended || mediaPlayer.played) {
                let mouseX = e.offsetX;
                let newTime = mouseX * mediaPlayer.duration / progressBarBg.clientWidth;
                mediaPlayer.currentTime = newTime;
                progressBar.style.cssText = `width: ${mouseX}px;`;
            }
        }

        togglePlayPause() {
            if (mediaPlayer.paused) {
                mediaPlayer.play();
                this.initialiseControls();
                playPause.classList.remove("play");
                playPause.classList.add("pause");

            } else {
                mediaPlayer.pause();
                playPause.classList.add("play");
                playPause.classList.remove("pause");
            }
            mediaPlayer.onended = () => {
                this.stopVideo();
            }
        }

        changeVolume() {
            mediaPlayer.volume = volumeRange.value / 100;
            mediaPlayer.muted = false;
            volumeButton.innerHTML = "&#128362;";
            if (mediaPlayer.volume === 0) {
                volumeButton.innerHTML = "&#128360;";
                mediaPlayer.muted = true;
            }
        }

        muteVolume() {
            if (mediaPlayer.muted) {
                mediaPlayer.muted = false;
                volumeButton.innerHTML = "&#128362;";
            } else {
                mediaPlayer.muted = true;
                volumeButton.innerHTML = "&#128360;";
            }
        }

        getFullScreen() {
            mediaPlayer.requestFullscreen().catch((e) => console.error(e));
            if (mediaPlayer.requestFullscreen) {
                mediaPlayer.requestFullscreen();
            } else if (mediaPlayer.webkitRequestFullscreen) {
                mediaPlayer.webkitRequestFullscreen();
            } else if (mediaPlayer.mozRequestFullscreen) {
                mediaPlayer.mozRequestFullscreen();
            } else if (mediaPlayer.msRequestFullscreen) {
                mediaPlayer.msRequestFullscreen();
            } else {
                mediaPlayer.addEventListener("dblclick", function () {
                    mediaPlayer.requestFullscreen;
                });
            }
            return mediaPlayer.fullscreenElement ||
                mediaPlayer.webkitfullscreenElement ||
                mediaPlayer.webkitfullscreenElement ||
                mediaPlayer.mozfullscreenElement;
        }

        stopVideo() {
            clearInterval(interval);
            mediaPlayer.pause();
            playPause.classList.add("play");
            playPause.classList.remove("pause");
            progressBar.style.width = 0;
            mediaPlayer.currentTime = 0;
            timeState.innerText = "00:00"
            timeState.style.display = "none";
        }
    }
    new Videos();
})()