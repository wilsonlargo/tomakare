let data_vigencia;
let active_data;
function load_vigencias() {
    data_vigencia = GLOBAL.state.calendarios
    ver_vigencias()

}
function crear_Calendario() {

}
async function ver_vigencias() {
    document.getElementById("mn-vigencias").innerHTML = ""
    //Identifica las propiedades de la capa
    for (const vigenciaid in data_vigencia) {
        const li = document.createElement("li")
        const a = document.createElement("a")
        a.className = "dropdown-item"
        a.href = "#"
        a.textContent = data_vigencia[vigenciaid]["vigencia"]["vigencia"]
        a.onclick = () => {
            mostrar_panel_vigencias(data_vigencia[vigenciaid])
        }
        li.appendChild(a)
        document.getElementById("mn-vigencias").appendChild(li)
    }
}
function crear_vigencia() {
    try {
        const data = GLOBAL.firestore.addCalendario(vigencia_contol)
        ver_vigencias()

        //mostrar_panel_vigencias(data.id)

    } catch (error) {
        mensajes("Aún cargando datos")
    }
}

function mostrar_panel_vigencias(data) {
    //mensajes(data_vigencia[id]["datos"]["vigencia"],"orange")
    byId("panel-escritorio").hidden = false
    active_data = data

    const intNombre = byId("intNombre")
    intNombre.value = data.vigencia.nombre
    intNombre.onchange = () => {
        data.vigencia.nombre = intNombre.value
        Guardar()
    }

    const intVigencia = byId("intVigencia")
    intVigencia.value = data.vigencia.vigencia
    intVigencia.onchange = () => {
        data.vigencia.vigencia = intVigencia.value
        Guardar()
    }

    const fecha = new Date()
    byId("selmesini").value = fecha.getMonth()
    const mes = fecha.toLocaleString('default', { month: 'long' })
    byId("fecha-ini").textContent = ` ${mes}, ${fecha.getDay()}`



}
async function Guardar() {
    const id = GLOBAL.firestore.updateCalendario(active_data)
}
function Mostrar_Calendario(control) {
    const diasSem = [
        "domingo",
        "lunes",
        "martes",
        "miercoles",
        "jueves",
        "viernes",
        "sabado",

    ]
    const fecha = new Date()
    const num_dias = new Date(fecha.getFullYear(), control.value + 1, 0).getDate()

const contenedor = document.getElementById("panel-calendario")
contenedor.innerHTML=""

    for (var i = 0; i < num_dias; i++) {
        const fehaA = new Date(fecha.getFullYear(), control.value, i+1)


        const divfecha = document.createElement("div")
        divfecha.className="div-fecha"
        divfecha.textContent= diasSem[fehaA.getDay()] + " " +fehaA
        contenedor.appendChild(divfecha)

    }



}


