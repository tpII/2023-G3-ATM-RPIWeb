// retornar a menu
setTimeout(() => {
    window.location.replace("forward")
}, 4000)

fetch("api/monto").then(response => {
    response.json().then(data => {
        if (data.success == "0") document.getElementById("title").innerText = data.msg
        else document.getElementById("value").innerText = "$".concat(data.value)
    })
})
