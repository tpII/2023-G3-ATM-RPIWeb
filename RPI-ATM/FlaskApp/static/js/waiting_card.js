// Chequeo de estado cada 1 segundo
async function handler() {
    const response = await fetch("status")
    const data = await response.json()
    console.log(data)

    if (data.status == 'ready') {
        window.location.replace('pin-input')
    }
}

setInterval(handler, 1000)