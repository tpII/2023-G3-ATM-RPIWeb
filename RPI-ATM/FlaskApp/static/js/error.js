setTimeout(() => {
    window.location.replace("forward")
}, 4000)

const sound = new Audio("/static/audio/error2-trim.mp3")
sound.play()