const vy = new Date()
let vigencia_contol = {
    "vigencia": {
        "id": "",
        "nombre": "Nombre de vigencia",
        "vigencia": vy.getFullYear(),
    },
    "calendario": {},
}






const byId = (nombre) => {
    const control = document.getElementById(nombre)
    return control
}
const cEl = (nombre) => {
    const control = document.createElement(nombre)
    return control
}