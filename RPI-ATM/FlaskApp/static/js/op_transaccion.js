import { isKeyDigit, keydownSound } from './utils.js'

const titleText = document.getElementById("title")
const valueText = document.getElementById("value")
let cbu = 0
let posted = false

function updateText(){
    valueText.innerText = cbu.toString()
    keydownSound()
}

function post(){
    fetch("api/consultar-cbu", {
        method: 'POST',
        body: JSON.stringify({cbu: cbu}),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then(res => res.json().then(data => {
        if (data.success == 0) titleText.innerText = data.msg
        else {
            titleText.innerText = "El CBU corresponde a la siguiente persona"
            valueText.innerText = data.msg
        }
    }))
}

document.addEventListener("keydown", e => {
    if (isKeyDigit(e.key)){
        cbu *= 10
        cbu += parseInt(e.key)
        updateText()
    } else if (e.key == "Backspace"){
        cbu = Math.floor(cbu / 10)
        updateText()
    } else if (e.key == "Enter"){
        if (cbu == 0) window.location.replace("forward")
        else {
            posted = true
            post()
        }
    }
})