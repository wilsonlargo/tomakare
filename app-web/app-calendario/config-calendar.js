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
    byId("fecha-ini").textContent = ` ${mes}, ${fecha.getDate()}`

    Mostrar_Calendario(fecha.getMonth() + 1)

}
async function Guardar() {
    const id = GLOBAL.firestore.updateCalendario(active_data)
}
function Mostrar_Calendario(m) {
    const diasSem = [
        ["domingo", 0, 0],
        ["lunes", 1, 1],
        ["martes", 2, 2],
        ["miercoles", 3, 3],
        ["jueves", 4, 4],
        ["viernes", 5, 5],
        ["sabado", 6, 6],
    ]

    const fecha = new Date()
    const año = fecha.getFullYear()
    const mes = m


    const tbody = document.getElementById("tbody-calendario")
    tbody.innerHTML = ""

    //Creamos la filas para cada semana
    const num_dias = new Date(año, mes, 0)
    let dia = 0
    for (var i = 0; i < 6; i++) {
        const tr = document.createElement("tr")
        for (var d = 0; d < 7; d++) {
            const fehaA = new Date(año, mes - 1, d)
            const td = document.createElement("td")
            td.id = `td_${dia}`
            dia++
            tr.appendChild(td)
        }
        tbody.appendChild(tr)
    }


    let ttt = parseInt(num_dias.getDate())
    const j = new Date(año, mes - 1, 0)
    const l = j.getDay()
    let p = 1
    for (var h = l; h < ttt + l; h++) {
        const fehaA = new Date(año, mes - 1, (p))
        try {
            p++
            const divEvento = document.createElement("div")
            divEvento.className = "div-fecha border-info"
            divEvento.textContent = p - 1
            if (fehaA.getDay() == 0) {
                divEvento.style.background = "gray"
                divEvento.style.color="white"
            } else {
                divEvento.style.background = "white"
                divEvento.style.color="gray"
            }
            document.getElementById(`td_${h + 1}`).appendChild(divEvento)
        } catch {

        }



    }







}


