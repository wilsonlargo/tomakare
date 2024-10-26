let data_riesgos
let indices = []
let active_ind = 0
function randomStr(len, arr) {
    let ans = '';
    for (let i = len; i > 0; i--) {
        ans +=
            arr[(Math.floor(Math.random() * arr.length))];
    }
    return ans

}

function list_indices() {
    indices = []
    for (id in data_riesgos.registros) {
        indices.push(id)
    }
}

function count_registrosStr() {
    const cont = document.getElementById("cont_reg")

    let i = 0

    for (id in data_riesgos.registros) {
        i++
        data_riesgos.registros[id].id = i
    }
    if (i !== 0) {
        cont.textContent = (active_ind + 1) + "/" + i

    } else {
        cont.textContent = "Sin registros"
    }



}
async function opendata() {
    data_riesgos = GLOBAL.state.riesgos[0]
    try {


        count_registrosStr()
        load_listas()
        document.getElementById("tool_registros").hidden = false
        document.getElementById("panel_formulario").hidden = false

        list_indices()
        if ((indices.length) == 0) {
            document.getElementById("panel_formulario").hidden = true
        } else {
            goto_registro("ini")
            goto_registro("fin")
            document.getElementById("panel_formulario").hidden = false
        }




    } catch (error) {
        console.log("Cargando datos...")
    }

}

function load_listas() {
    const int_departamento = document.getElementById("int_departamento")

    departamentos.forEach(dep => {
        const option = document.createElement("option")
        option.value = dep.departamento
        option.textContent = dep.departamento.toUpperCase()
        int_departamento.append(option)
    })

}

function guardar_registro() {
    const id = GLOBAL.firestore.updateRiesgos(data_riesgos)
}
function crear_registro() {
    document.getElementById("panel_formulario").hidden = false
    const idR = randomStr(10, '123456789abcdefghijklmnzx');
    const hoy = Date.now();
    const fecha = new Date(hoy);
    const newRegistro = {
        id: 0,
        fecha_reporte: `${fecha.getDay()}/${fecha.getMonth()}/${fecha.getFullYear()}`,
        vigencia: fecha.getFullYear(),
        departamento: "Sin determinar",
        municipio: "",
        vereda: "",
        direccion: "",
        sector: "",
        comunidad: "",
        detalle: "",
        nombres: "",
        documento: "",
        telefono: "",
        email: "",
        fecha_evento: "",
        tipo: "",
        nombre_tipo: "",
    }

    data_riesgos.registros[idR + fecha.getFullYear()] = newRegistro
    guardar_registro()
    count_registrosStr()
    goto_registro("fin")

}
function delete_registro(id) {
    delete data_riesgos.registros[indices[active_ind]]



    if ((indices.length - 1) == 0) {
        document.getElementById("panel_formulario").hidden = true
    } else {
        goto_registro("ini")
        document.getElementById("panel_formulario").hidden = false
    }

    guardar_registro()
    count_registrosStr()


}

function goto_registro(option) {
    list_indices()
    if (option == "ini") {
        active_ind = 0
        show_registro(data_riesgos.registros[indices[0]])
    } else if (option == "fin") {
        show_registro(data_riesgos.registros[indices[indices.length - 1]])
        active_ind = indices.length - 1
    } else if (option == "back") {
        if (active_ind <= 0) {
            active_ind = 0

        } else {
            active_ind = active_ind - 1
            show_registro(data_riesgos.registros[indices[active_ind]])
        }
    }
    else if (option == "next") {
        if (active_ind < indices.length - 1) {
            active_ind = active_ind + 1
            show_registro(data_riesgos.registros[indices[active_ind]])
        } else {
        }
    }
    count_registrosStr(data_riesgos.registros)
}

function show_registro(registro) {
    const int_fecha = document.getElementById("int_fecha")
    int_fecha.value = registro.fecha_evento
    int_fecha.oninput = () => {
        registro.fecha_evento = int_fecha.value
        guardar_registro()
    }

    const int_departamento = document.getElementById("int_departamento")
    const int_municipio = document.getElementById("int_municipio")

    int_departamento.value = registro.departamento
    int_departamento.oninput = () => {
        registro.departamento = int_departamento.value
        guardar_registro()
        int_municipio.innerHTML = ""
        const lugares_filtered = lugares.filter(mun => mun.departamento == int_departamento.value)
        for (id in lugares_filtered) {
            const lugar = lugares_filtered[id]
            const option = document.createElement("option")
            option.value = lugar.lugar
            option.textContent = lugar.lugar
            int_municipio.appendChild(option)
        }

    }


    int_municipio.innerHTML = ""
    const lugares_filtered = lugares.filter(mun => mun.departamento == int_departamento.value)
    for (id in lugares_filtered) {
        const lugar = lugares_filtered[id]
        const option = document.createElement("option")
        option.value = lugar.lugar
        option.textContent = lugar.lugar
        int_municipio.appendChild(option)
    }

    int_municipio.value = registro.municipio
    int_municipio.oninput = () => {
        registro.municipio = int_municipio.value
        guardar_registro()
    }

    const int_vereda = document.getElementById("int_vereda")
    int_vereda.value = ""
    int_vereda.value = registro.vereda
    int_vereda.oninput = () => {
        registro.vereda = int_vereda.value
        guardar_registro()
    }


    const int_direccion = document.getElementById("int_direccion")
    int_direccion.value = ""
    int_direccion.value = registro.direccion
    int_direccion.oninput = () => {
        registro.direccion = int_direccion.value
        guardar_registro()
    }

    const int_sector = document.getElementById("int_sector")
    int_sector.value = ""
    int_sector.value = registro.sector
    int_sector.oninput = () => {
        registro.sector = int_sector.value
        guardar_registro()
    }

    const int_comunidad = document.getElementById("int_comunidad")
    int_comunidad.value = ""
    int_comunidad.value = registro.comunidad
    int_comunidad.oninput = () => {
        registro.comunidad = int_comunidad.value
        guardar_registro()
    }

    const int_detalle = document.getElementById("int_detalle")
    int_detalle.value = ""
    int_detalle.value = registro.detalle
    int_detalle.oninput = () => {
        registro.detalle = int_detalle.value
        guardar_registro()
    }

    const int_tipo = document.getElementById("int_tipo")
    const int_nombre_tipo = document.getElementById("int_nombre_tipo")
    int_tipo.value = ""
    int_tipo.value = registro.tipo
    int_tipo.oninput = () => {
        registro.tipo = int_tipo.value
        guardar_registro()
        int_nombre_tipo.innerHTML = ""
        const evento_tipos= tipo_evento.filter(tip => tip.nombre == int_tipo.value)
        for (id in evento_tipos) {
            const evento = evento_tipos[id]
            const option = document.createElement("option")
            option.value = evento.tipo
            option.textContent = evento.tipo
            int_nombre_tipo.appendChild(option)
        }
    }


    const evento_tipos= tipo_evento.filter(tip => tip.nombre == int_tipo.value)
    for (id in evento_tipos) {
        const evento = evento_tipos[id]
        const option = document.createElement("option")
        option.value = evento.tipo
        option.textContent = evento.tipo
        int_nombre_tipo.appendChild(option)
    }

    int_nombre_tipo.value = registro.nombre_tipo
    int_nombre_tipo.oninput = () => {
        registro.nombre_tipo = int_nombre_tipo.value
        guardar_registro()
    }




}