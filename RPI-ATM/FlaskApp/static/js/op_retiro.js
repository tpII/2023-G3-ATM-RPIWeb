import { isKeyDigit } from './utils.js'

const valueText = document.getElementById("value")
let monto = 0.00

function updateText(){
    valueText.innerText = "$" + monto.toFixed(2)
}

document.addEventListener("keydown", e => {
    if (isKeyDigit(e.key)){
        monto *= 10
        monto += parseInt(e.key)
        updateText()
    } else if (e.key == "Backspace"){
        monto = Math.floor(monto / 10)
        updateText()
    }
})