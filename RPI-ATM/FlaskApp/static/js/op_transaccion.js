import { isKeyDigit, keydownSound } from './utils.js'

const titleText = document.getElementById("title")
const valueText = document.getElementById("value")
let value = 0
let primera_vez = true
let info_showed = false
let transferido = false

function updateText(){
    if (info_showed) {
        if (!primera_vez) valueText.innerText = "$" + value.toFixed(2)
    } else valueText.innerText = value.toString()
    keydownSound()
}

function post_1(){
    fetch("api/consultar-cbu", {
        method: 'POST',
        body: JSON.stringify({cbu: value}),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then(res => res.json().then(data => {
        if (data.success == 0) {
            titleText.innerText = data.msg
            transferido = true
        } else {
            titleText.innerText = "El CBU corresponde a la siguiente persona"
            valueText.innerText = data.msg
            info_showed = true
        }
    }))
}

function post_2(){
    fetch("api/transferir", {
        method: 'POST',
        body: JSON.stringify({monto: value}),
        headers: {"Content-type": "application/json; charset=UTF-8"}
    }).then(res => res.json().then(data => {
        transferido = true

        if (data.success == 0) titleText.innerText = "Saldo insuficiente en cuenta. Operación no realizada"
        else {
            titleText.innerText = "Tu nuevo saldo en cuenta es"
            valueText.innerText = "$"+data.msg.toFixed(2)
        }
    }))
}

document.addEventListener("keydown", e => {
    if (isKeyDigit(e.key)){
        value *= 10
        value += parseInt(e.key)
        updateText()
    } else if (e.key == "Backspace"){
        value = Math.floor(value / 10)
        updateText()
    } else if (e.key == "Enter"){
        if (value == 0 || transferido) window.location.replace("forward")
        else {
            if (info_showed){
                if (primera_vez){
                    value = 0
                    titleText.innerText = "Ingrese monto a transferir a " + valueText.innerText
                    valueText.innerText = "$0.00"
                    primera_vez = false
                } else {
                    post_2()
                }
            } else {
                post_1()
            }
            
        }
    }
})