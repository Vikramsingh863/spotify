let currentSong = new Audio();
let songs;
let currfolder;
async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index]
        if (element.href.endsWith("mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
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
    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currfolder}/` + track

    if (!pause) {
        currentSong.play()
        play.src = "svg/pause.svg"
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

    await getSongs("songs/favourite")
    playMusic(songs[0], true)

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "svg/pause.svg"
        }
        else {
            currentSong.pause();
            play.src = "svg/play.svg"
        }
    })
    //timeupdate listen 
    currentSong.addEventListener("timeupdate", () => {
        a = parseInt((currentSong.currentTime / currentSong.duration) * 100);
        a = "-" + `${100 - a}` + "%";

        document.getElementById("circle").style.left = `${a}`
    })
    //Seekbar filling
    document.getElementsByClassName("seekbar")[0].addEventListener("click", e => {
        console.log(e.offsetX, e.target.getBoundingClientRect().width)
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.getElementById("circle").style.left = percent + "%";

        currentSong.currentTime = (currentSong.duration * percent) / 100
    })

    //Play Next previous Song 
    document.getElementById("previous").addEventListener("click", () => {

        a = currentSong.src.split("/").slice(-1)[0]
        let index = songs.indexOf(a);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    document.getElementById("next").addEventListener("click", () => {

        a = currentSong.src.split("/").slice(-1)[0]
        let index = songs.indexOf(a);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {


        let a = (1 / 100) * e.target.value
        currentSong.volume = a;
    })

    //load playlist whenever clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {

        e.addEventListener("click", async item => {
            console.log(item.target, item.currentTarget.dataset)
            songs = await getSongs(`Songs/${item.currentTarget.dataset.folder}`)

        })
    })
}
main()

let humburgers = document.getElementsByClassName("hamburger")
Array.from(humburgers).forEach(function (humburger) {
    humburger.addEventListener("click", () => {

        if (document.getElementsByClassName("left")[0].style.left != "0%") {

            document.getElementsByClassName("left")[0].style.left = "0%"
            

        }
        else {
            document.getElementsByClassName("left")[0].style.left = "-110%"
            
        }

    })
})
















