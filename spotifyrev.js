async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let b = await a.text()


    let div = document.createElement("div")
    div.innerHTML = b;

    songs = []
    let as = div.getElementsByTagName("a")
    // console.log(as)
    for (let index = 0; index < as.length; index++) {
        const element = as[index]
        if (element.href.endsWith("mp3")) {
            songs.push(element.href)

        }
    }

    return songs
}
async function main() {
    let songs = await getSongs()
    console.log(songs)
    var audio = new Audio()
    // audio.play();
}
main()