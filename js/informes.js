let data2report

const byId = (name) => {
    const element = document.getElementById(name)
    return element
}

const newEl = (name) => {
    const element = document.createElement(name)
    return element
}



function openReport() {
    GLOBAL.firestore.getConfigs()
    const idData = GLOBAL.state.configs[0].currentdata
    GLOBAL.firestore.getProyectos()
    const vigencias = GLOBAL.state.proyectos

    for (i in vigencias) {

        if (idData == vigencias[i].id) {
            data2report = vigencias[i]
        }
    }
    makeReport(data2report)


}
function makeReport(data) {
    const divDocumento = byId("body-print")
    const divbotones = byId("divbotones")

    divDocumento.innerHTML = ""

    const consejerias = data.clsAreas

    for (id in consejerias) {
        const data = consejerias[id]
        const tit2 = newEl("div")


        tit2.textContent = "CONSEJERÍA " + consejerias[id].nombre
        tit2.className = "treport-2"
        divDocumento.appendChild(tit2)

        const consejero = newEl("div")
        consejero.textContent = "CONSEJERO (" + consejerias[id].administrador + ")"
        consejero.className = "tlabel-i-1"
        divDocumento.appendChild(consejero)


        let par_infunciones = consejerias[id].funciones.split("\n")
        par_infunciones.forEach(par => {
            const funciones = newEl("p")
            funciones.textContent = par
            funciones.className = "tparagraph"
            divDocumento.appendChild(funciones)
        });

        const tit3_mandatos = newEl("div")
        tit3_mandatos.textContent = "MANDATOS"
        tit3_mandatos.className = "treport-3"
        divDocumento.appendChild(tit3_mandatos)
        mandatos(data)

        const tit3_articulacion = newEl("div")
        tit3_articulacion.textContent = "ARTICULACIÓN CON CONSEJERÍAS"
        tit3_articulacion.className = "treport-3"
        divDocumento.appendChild(tit3_articulacion)
        articulacion(data)

        const tit3_lineas = newEl("div")
        tit3_lineas.textContent = "LÍNEAS DE ACCIÓN"
        tit3_lineas.className = "treport-3"
        divDocumento.appendChild(tit3_lineas)
        lineas(data)


    }


}

function mandatos(mandatos) {
    const divDocumento = byId("body-print")
    const data = mandatos.cslMandatos
    let i = 1
    for (id in data) {
        const item1 = document.createElement("div")
        item1.className = "ms-3 mb-2"
        item1.innerHTML = `
        <div class="row">
            <div class="col-auto fw-bold">
                ${i}
            </div>
            <div class="col report-justify">
             ${data[id].nombre}
            </div>  
        </div>
        `
        i++
        divDocumento.appendChild(item1)
    }

}


function articulacion(articulaciones) {
    const divDocumento = byId("body-print")
    const data = articulaciones.cslArticulacion

    for (id in data) {
        const item1 = document.createElement("div")
        item1.className = "ms-1 fw-bold mb-2"
        item1.textContent = "Consejería: " + data[id].consejeria
        divDocumento.appendChild(item1)

        const item2 = newEl("div")
        item2.className = "ms-2 mb-3 report-justify"
        item2.textContent = "Mandatos: " + data[id].mandatos
        divDocumento.appendChild(item2)
    }
}

function lineas(data) {
    const divDocumento = byId("body-print")
    const lineas = data.cslLineas
    for (id in lineas) {
        const linea = document.createElement("div")
        linea.className = "treport-4 ms-2"
        linea.textContent = lineas[id].nombre
        divDocumento.appendChild(linea)

        const p = document.createElement("div")
        p.className = "tparagraph"
        p.textContent = lineas[id].descripcion
        divDocumento.appendChild(p)

        //Agregamos indicadores y metas
        const div = document.createElement("div")
        div.className = "ms-4"
        div.innerHTML = `
        <div class="row">
            <div class="col-auto fw-bold" style="width: 100px;">
                META
            </div>
            <div class="col report-justify">
             ${lineas[id].meta}%
            </div>  
        </div>
        <div class="row">
            <div class="col-auto fw-bold" style="width: 100px;">
                AVANCE
            </div>
            <div class="col report-justify">
             ${lineas[id].avance}%
            </div>  
        </div>
        `
        divDocumento.appendChild(div)

        const tit3_programas = newEl("div")
        tit3_programas.textContent = "PROGRAMAS"
        tit3_programas.className = "treport-4"
        divDocumento.appendChild(tit3_programas)

        programas(lineas[id])
    }
}
function programas(data) {
    const divDocumento = byId("body-print")
    const programas = data.clsPrograma
    for (id in programas) {
        const programa = document.createElement("div")
        programa.className = "treport-5 ms-3"
        programa.textContent = programas[id].nombre
        divDocumento.appendChild(programa)

        const p = document.createElement("div")
        p.className = "tparagraph"
        try {
            p.textContent = programas[id].descripcion
        } catch (error) {

        }
        
        divDocumento.appendChild(p)

        //Agregamos indicadores y metas
        const div = document.createElement("div")
        div.className = "ms-4"
        div.innerHTML = `
             <div class="row">
                 <div class="col-auto fw-bold" style="width: 100px;">
                     META
                 </div>
                 <div class="col report-justify">
                  ${programas[id].meta}%
                 </div>  
             </div>
             <div class="row">
                 <div class="col-auto fw-bold" style="width: 100px;">
                     AVANCE
                 </div>
                 <div class="col report-justify">
                  ${programas[id].avance}%
                 </div>  
             </div>
             `
        divDocumento.appendChild(div)

        const tit3_proyectos= newEl("div")
        tit3_proyectos.textContent = "PROYECTOS"
        tit3_proyectos.className = "treport-5 bg-primary-subtle ps-2"
        divDocumento.appendChild(tit3_proyectos)

        proyectos(programas[id])
    }
   

}
function proyectos(data){
    const divDocumento = byId("body-print")
    console.log(data)
    const programas = data.clsGestion
}


