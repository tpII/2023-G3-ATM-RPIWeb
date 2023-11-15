const target = 1234
let current_pin = Array(4).fill(-1)
let current_index = 0
let attempts_left = 3

// HTML elements
let pin_text = document.getElementById("pin")

// Keyboard listener
document.addEventListener('keydown', (event) => {
    const name = event.key
    console.log(name)
    
    // detect if it's a number
    if (name.length == 1 && name.charAt(0) >= '0' && name.charAt(0) <= '9'){
        if (current_index == 4) return
        current_pin[current_index++] = name.charAt(0)
        showPin()
        keydownSound()
    } else if (name == 'Backspace') {
        if (current_index == 0) return
        current_pin[--current_index] = -1
        showPin()
        keydownSound()
    } else if (name == 'Enter') {
        current_pin = Array(4).fill(-1)
        current_index = 0
        showPin()
        keydownSound()
    }
})

function showPin(){
    let text = current_pin.map(digit => (digit == -1 ? "-" : "*")).join(' ')
    pin_text.innerText = text
}

function keydownSound(){
    let sound = new Audio("/static/audio/keydown.mp3")
    sound.play()
}