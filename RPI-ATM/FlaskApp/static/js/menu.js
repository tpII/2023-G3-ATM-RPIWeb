// constantes
API_REQUEST_URL = "menu/select_option"

// UI elements
datetimeText = document.getElementById("datetime")

// listeners
function consultar_saldo(){
    select_option(1)
}

function ingresar_dinero(){
    select_option(2)
}

function retirar_dinero(){
    select_option(3)
}

function realizar_transaccion(){
    select_option(4)
}

function finish_session(){
    select_option(5)
}

async function select_option(option_number){
    const response = await fetch(API_REQUEST_URL, {
        method: 'POST',
        body: JSON.stringify({ option_number: option_number }),
        headers: { "Content-type": "application/json; charset=UTF-8"}
    });

    const data = await response.json()
    window.location.replace(data.result)
}

async function update_datetime(){
    const response = await fetch("datetime")
    const data = await response.json()
    datetimeText.innerText = data.text
}

// main program
update_datetime()
setInterval(update_datetime, 30000)

// keyboard listener
document.addEventListener("keydown", event => {
    const name = event.key

    if (name.length == 1 && name.charAt(0) >= '0' && name.charAt(0) <= '5'){
        select_option(parseInt(name))
    }
})