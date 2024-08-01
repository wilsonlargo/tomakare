let data_vigencia;
let active_data;
function load_vigencias() {
    data_vigencia = GLOBAL.state.calendarios
    ver_vigencias()


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
            byId("panel-cronograma").hidden = true
            byId("panel-calendario").hidden = false
        }
        li.appendChild(a)
        document.getElementById("mn-vigencias").appendChild(li)
    }
    byId("liCrearCalendario").hidden = false
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
    byId("selmesini").value = fecha.getMonth() + 1

    const mes = fecha.toLocaleString('default', { month: 'long' })
    byId("fecha-ini").textContent = ` ${mes}, ${fecha.getDate()}`

    Mostrar_Calendario(fecha.getMonth() + 1)

}
async function Guardar() {
    const id = GLOBAL.firestore.updateCalendario(active_data)
}
function Mostrar_Calendario(m) {
    const diasSem = [
        ["domingo", 0],
        ["lunes", 1],
        ["martes", 2],
        ["miercoles", 3],
        ["jueves", 4],
        ["viernes", 5],
        ["sabado", 6],
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
        const fechaA = new Date(año, mes - 1, (p))
        const nombremes = fechaA.toLocaleString('default', { month: 'long' })
        p++
        const dateInfo = {
            "vigencia": año,
            "mes": fechaA.getMonth(),
            "dia": p - 1,
            "diaSemana": fechaA.getDay(),
            "agenda": active_data.id,
        }
        const ref = `${dateInfo.vigencia}${dateInfo.mes}${dateInfo.dia}`
        let contador=0
        let ocupado=false
        for (const evento in active_data.calendario){
            const ref1=active_data.calendario[evento].ref
            if(ref1==ref){
                console.log(active_data.calendario[evento].ref)
                ocupado = true
                contador= contador+1
            }
        }


        //console.log(Object.values(active_data.calendario).length)
        crear_dia(dateInfo, `td_${h + 1}`,ocupado,contador)
    }
}
function crear_dia(dateInfo, id,ocupado,neventos) {

    const divEvento = document.createElement("div")
    divEvento.className = "div-fecha border-info"


    divEvento.onclick = () => {
        //byId("fecha-ini").textContent = `${dateInfo.mes}, ${dateInfo.dia} de ${dateInfo.vigencia}`
        byId("panel-cronograma").hidden = false
        byId("panel-calendario").hidden = true
        let mesAgenda= new Date
        let a=mesAgenda.getMonth(dateInfo.mes)


        const nombremes = a.toLocaleString('default', { month: 'long' })
        byId("tl1").textContent = `AGENDA ${nombremes}, ${dateInfo.dia} de ${dateInfo.vigencia}`
        byId("btn_nuevoevento").onclick = () => { add_evento(dateInfo) }
        listar_eventos(`${dateInfo.vigencia}${dateInfo.mes}${dateInfo.dia}`)
    }
    //alert(dateInfo.diaSemana)
    if (dateInfo.diaSemana == 0) {
        divEvento.style.background = "gray"
        divEvento.style.color = "white"
    } else {
        divEvento.style.background = "white"
        divEvento.style.color = "gray"
    }
    document.getElementById(id).appendChild(divEvento)

    const bartitulo = cEl("div")
    bartitulo.className = "row align-items-center"
    divEvento.appendChild(bartitulo)

    const colDia = cEl("div")
    colDia.className = "col text-start"
    colDia.textContent = dateInfo.dia
    bartitulo.appendChild(colDia)

    const divInfo = cEl("div")
    
    divEvento.appendChild(divInfo)
    if(ocupado==true){
        divInfo.textContent=`Con ${neventos} eventos`
        divInfo.className = "div-fecha-info"
        
    }




}
function listar_eventos(referencia) {
    const calendario = active_data.calendario
    const tbody = byId("tbodyEventos")
    tbody.innerHTML = ""

    for (const evento in calendario) {
        if (referencia == calendario[evento].ref) {
            tbody.appendChild(newLine(calendario[evento]))
        }
    }
    function newLine(evento) {
        const tr = cEl("tr")

        //Indicador de hora
        const th = cEl("th")
        th.scope = "row"
        th.textContent = evento.hora
        tr.appendChild(th)
        //Verificamso si la hora ya pasó
        let fecha = new Date()
        let tiempoActual = fecha.getHours()
        let formatHora = evento.hora.split(":")
        let tiempoAgenda = formatHora[0]
        console.log(tiempoAgenda, tiempoActual)

        if (tiempoAgenda > tiempoActual) {
            th.style.color = "green"
        } else {
            th.style.color = "orange"
        }

        const td_detalle = cEl("td")
        td_detalle.textContent = evento.actividad
        td_detalle.style.width = "500px"
        tr.appendChild(td_detalle)

        const td_area = cEl("td")
        td_area.textContent = evento.area
        tr.appendChild(td_area)

        const td_estado = cEl("td")
        td_estado.textContent = evento.estado
        tr.appendChild(td_estado)

        const td_editar = cEl("td")
        tr.appendChild(td_editar)

        //Crear neuvo evento
        const a = cEl("a")
        a.className = "nav-link active tooltip-container"
        a.href = "#"
        tooltip(a,"Editar evento","gray")
        td_editar.appendChild(a)

        const i = cEl("i")
        i.className = "bi bi-pencil-square"
        a.appendChild(i)
        a.onclick=()=>{
            modalCalendario.modalEdit(
               ()=> {
                    Guardar()
                    listar_eventos(evento.ref)
                }
            )
            byId("in_detalle_evento").value=evento.actividad
            byId("in_detalle_evento").oninput=()=>{
                evento.actividad=byId("in_detalle_evento").value
            }

            byId("in_area_evento").value=evento.area
            byId("in_area_evento").oninput=()=>{
                evento.area=byId("in_area_evento").value
            }

            byId("sel_estado_evento").value=evento.estado
            byId("sel_estado_evento").onchange=()=>{
                evento.estado=byId("sel_estado_evento").value
            }

            byId("in_tiempo_evento").value=evento.hora
            byId("in_tiempo_evento").onchange=()=>{
                evento.hora=byId("in_tiempo_evento").value
            }
        }

        const a2 = cEl("a")
        a2.className = "nav-link active tooltip-container"
        a2.href = "#"
        tooltip(a2,"Borrar evento","orange")
        td_editar.appendChild(a2)

        const i2 = cEl("i")
        i2.className = "ms-3 bi bi-trash3"
        a2.appendChild(i2)

        a2.onclick=()=>{
            delete active_data.calendario[evento.id]
            listar_eventos(evento.ref)
            Guardar()
        }


        return tr
    }


}
function add_evento(data) {
    byId("titulo_evento").textContent="Crear evento"
    byId("btn_crear_evento").textContent="Crear"
    byId("btn_crear_evento").onclick = () => {
        let index = Math.random().toString(36).slice(2) + data.mes + data.dia
        const evento = evento_control.evento
        evento.id = index
        evento.ref = `${data.vigencia}${data.mes}${data.dia}`
        evento.actividad = byId("in_detalle_evento").value
        evento.area = byId("in_area_evento").value
        evento.estado = byId("sel_estado_evento").value
        evento.hora = byId("in_tiempo_evento").value
        active_data.calendario[evento.id] = evento
        Guardar()
        listar_eventos(evento.ref)
    }
}
function remove_vigencia() {
    GLOBAL.firestore.borrarCalendario(active_data.id)
    ver_vigencias()
    byId("panel-escritorio").hidden = true
}
function retornar_calendario() {
    byId("panel-cronograma").hidden = true
    byId("panel-calendario").hidden = false
    Mostrar_Calendario(1) 
    let fecha= new Date()
    Mostrar_Calendario(fecha.getMonth() + 1)
    byId("selmesini").value=fecha.getMonth() + 1
}
function tooltip(control,texto,color){
const tooltip = cEl("span")
tooltip.className="tooltip-text"
tooltip.textContent=(texto)
tooltip.style.background=color
control.appendChild(tooltip)


}

const modalCalendario = {

    modalEdit(comando) {
        const modal = new bootstrap.Modal(document.getElementById('modal_nuevo_evento'));
        const texto = document.getElementById("titulo_evento")
        texto.textContent = "Editar evento"

        modal.show();
        const btn = document.getElementById('btn_crear_evento')
        btn.textContent="Actualizar"
        btn.onclick = comando

    }
}

