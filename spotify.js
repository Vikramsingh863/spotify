let currentSong = new Audio();

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")

    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index]
        if (element.href.endsWith("mp3")) {
            songs.push(element.href.split("/songs")[1])
        }
    }
    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = "/songs/" + track
    if (!pause) {
        currentSong.play()
    }
    console.log(track)
    document.querySelector(".songinfo").innerHTML = decodeURI(track)


    currentSong.addEventListener("timeupdate", () => {
        function formatTime(timeInSeconds) {
            let minutes = Math.floor(timeInSeconds / 60);
            let seconds = Math.floor(timeInSeconds % 60);

            let formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
            let formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

            return `${formattedMinutes}:${formattedSeconds}`;
        }


        let formattedCurrentTime = formatTime(currentSong.currentTime);
        let formattedDuration = formatTime(currentSong.duration);

        // console.log("Current Time: " + formattedCurrentTime);
        // console.log("Duration: " + formattedDuration);
        document.querySelector(".songtime").innerHTML = `${formattedCurrentTime} / ${formattedDuration}`

    })
}
async function main() {

    let songs = await getSongs()
    playMusic(songs[0], true)

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]

    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>                         
        <img class="invert" src="./svg/music.svg" alt="">
                            <div class="info">
                                <div>${decodeURI(song).replace("/", " ")}</div>
                                <div>Song Artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="/svg/playbtn.svg" alt="">
                            </div>
                        </li>    
        </li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();

        }
        else {
            currentSong.pause();
        }

    })
    currentSong.addEventListener("timeupdate", () => {
        a = parseInt((currentSong.currentTime / currentSong.duration) * 100);
        a = "-" + `${100 - a}` + "%";
        console.log(a)
        document.getElementById("circle").style.left = `${a}`
    })

    document.getElementsByClassName("seekbar")[0].addEventListener("click", e => {
        // console.log(document.getElementById("circle").e.target.getBoundingClientRect())
    
        
            console.log(e.offsetX, e.target.getBoundingClientRect().width)
            let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
            document.getElementById("circle").style.left = percent + "%";
    
            currentSong.currentTime = (currentSong.duration * percent) / 100
    
    })
}
main()
















