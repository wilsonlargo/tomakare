const vy = new Date()
let vigencia_contol = {
    "vigencia": {
        "id": "",
        "nombre": "Nombre de vigencia",
        "vigencia": vy.getFullYear(),
    },
    "calendario": {},
}

let evento_control={
    "evento":{
        "id":"",
        "ref":"",
        "fecha":["DD","MM","AAAA"],
        "actividad":"Detalle de la actividad",
        "area":"Nombre de área",
        "estado":"activo",
        "hora":"",
    }
}

const byId = (nombre) => {
    const control = document.getElementById(nombre)
    return control
}
const cEl = (nombre) => {
    const control = document.createElement(nombre)
    return control
}