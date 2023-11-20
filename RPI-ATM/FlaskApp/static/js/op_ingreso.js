import { isKeyDigit, keydownSound } from './utils.js'

const titleText = document.getElementById("title")
const valueText = document.getElementById("value")
let monto = 0
let posted = false

function updateText(){
    valueText.innerText = "$" + monto.toFixed(2)
    keydownSound()
}

function post(){
    fetch("api/depositar", {
        method: 'POST',
        body: JSON.stringify({monto: monto.toString()}),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then(res => res.json().then(data => {
        if (data.success === "0") titleText.innerText = data.msg
        else {
            titleText.innerText = "Operación exitosa. Su nuevo saldo es"
            valueText.innerText = "$" + data.value.toFixed(2)
        }
    }))
}

document.addEventListener("keydown", e => {
    if (isKeyDigit(e.key)){
        monto *= 10
        monto += parseInt(e.key)
        updateText()
    } else if (e.key == "Backspace"){
        monto = Math.floor(monto / 10)
        updateText()
    } else if (e.key == "Enter"){
        if (monto == 0 || posted) window.location.replace("forward")
        else {
            posted = true
            post()
        }
    }
})