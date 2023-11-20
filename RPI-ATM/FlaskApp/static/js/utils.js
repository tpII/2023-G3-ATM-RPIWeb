export function isKeyDigit(keyName){
    return keyName.charAt(0) >= '0' && keyName.charAt(0) <= '9'
}

export function keydownSound(){
    const sound = new Audio("/static/audio/keydown.mp3")
    sound.play()
}