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

    makerIndice(data)

    const consejerias = data.clsAreas

    let c = 1
    for (id in consejerias) {
        const data = consejerias[id]
        const tit2 = newEl("div")


        tit2.textContent = "CONSEJERÍA " + consejerias[id].nombre
        tit2.id = "consejeria" + c
        c++

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
function makerIndice(data) {
    const divIndice = document.createElement("div")
    divIndice.className = "ms-5"
    divIndice.style.breakAfter = "page"
    divIndice.textContent = "CONTENIDO"
    const divDocumento = byId("body-print")

    const consejerias = data.clsAreas

    let c = 1
    for (id in consejerias) {
        const nivel1 = document.createElement("div")
        consejerias[id].id = c
        nivel1.innerHTML = `
        <div class="row">
            <div class="col-auto fw-bold" style="width: 40px;">
                ${c}.
            </div>
            <div class="col fw-bold"> 
                <a class="nav-link" href="#consejeria${c}">
                    ${consejerias[id].nombre}
                </a>
            </div>  
        </div>
        `
        divIndice.appendChild(nivel1)


        const lineas = consejerias[id].cslLineas
        let l = 1
        for (id in lineas) {
            const nivel2 = document.createElement("div")
            nivel2.innerHTML = `
            <div class="row ms-1">
                <div class="col-auto" style="width: 40px;">
                    ${c}.${l}.
                </div>
                <div class="col"> 
                    <a class="nav-link" href="#linea${c}${l}">
                        ${lineas[id].nombre}
                    </a>
                </div>  
            </div>
            `
            divIndice.appendChild(nivel2)

            const programas = lineas[id].clsPrograma
            let p = 1
            for (id in programas) {
                const nivel3 = document.createElement("div")
                nivel3.innerHTML = `
                    <div class="row ms-3">
                        <div class="col-auto" style="width: 40px;">
                            ${c}.${l}.${p}
                        </div>
                        <div class="col"> 
                            <a class="nav-link" href="#programa${programas[id].nombre}">
                                ${programas[id].nombre}
                            </a>
                        </div>  
                    </div>
                    `
                divIndice.appendChild(nivel3)

                const proyectos = programas[id].clsGestion
                let g = 1
                for (id in proyectos) {
                    const nivel4 = document.createElement("div")
                    nivel4.innerHTML = `
                        <div class="row ms-5">
                            <div class="col-auto" style="width: 50px;">
                                ${c}.${l}.${p}.${g}.
                            </div>
                            <div class="col"> 
                                <a class="nav-link" href="#proyectos${proyectos[id].nombre}">
                                    ${proyectos[id].nombre}
                                </a>
                            </div>  
                        </div>
                        `
                    divIndice.appendChild(nivel4)
                    g++
                }
                p++
            }
            l++
        }
        c++
    }

    divDocumento.appendChild(divIndice)

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
    let l = 1
    for (id in lineas) {

        const linea = document.createElement("div")
        lineas[id].id=l
        linea.className = "treport-4 ms-2"
        linea.id = "linea" + `${data.id}${l}`
        linea.textContent = lineas[id].nombre
        l++
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
        programa.id="programa" + `${programas[id].nombre}`
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

        const tit3_proyectos = newEl("div")
        tit3_proyectos.textContent = "PROYECTOS"
        tit3_proyectos.className = "treport-5 bg-primary-subtle ps-2"
        divDocumento.appendChild(tit3_proyectos)

        proyectos(programas[id])
    }


}
function proyectos(data) {
    const divDocumento = byId("body-print")
    const proyectos = data.clsGestion

    for (id in proyectos) {
        const data_proyecto = proyectos[id]
        const proyecto = document.createElement("div")
        proyecto.id=`proyectos${proyectos[id].nombre}`
        proyecto.className = "treport-5 ms-3"
        proyecto.textContent = data_proyecto.nombre
        divDocumento.appendChild(proyecto)

        const div0 = document.createElement("div")
        div0.className = "ms-4 mb-2"
        div0.innerHTML = `
             <div class="row">
                 <div class="col-auto fw-bold" style="width: 120px;">
                     Coordinador:
                 </div>
                 <div class="col report-justify">
                  ${data_proyecto.manager}
                 </div>  
             </div>
             `
        divDocumento.appendChild(div0)

        const divobjetivo = document.createElement("div")

        const parrObjetivo0 = data_proyecto.ogeneral.replace(".", "\n")
        const parrObjetivo = parrObjetivo0.split("\n")
        const divLinesObjetivo = newEl("div")
        parrObjetivo.forEach(line => {
            const div = newEl("div")
            div.className = "tparagraph0"
            div.textContent = line
            divLinesObjetivo.appendChild(div)
        })



        divobjetivo.className = "ms-4 mb-2"
        divobjetivo.innerHTML = `
             <div class="row">
                 <div class="col-auto fw-bold" style="width: 120px;">
                     Objetivo:
                 </div>
                 <div class="col report-justify">
                  ${divLinesObjetivo.innerHTML}
                 </div>  
             </div>
             `
        divDocumento.appendChild(divobjetivo)


        const parrMandato0 = data_proyecto.mandato.replace(".", "\n")
        const parrMandato = parrMandato0.split("\n")
        const divLinesMandato = newEl("div")
        parrMandato.forEach(line => {
            const div = newEl("div")
            div.className = "tparagraph0"
            div.textContent = line
            divLinesMandato.appendChild(div)
        })

        const divmandato = document.createElement("div")
        divmandato.className = "ms-4 mb-2"
        divmandato.innerHTML = `
             <div class="row">
                 <div class="col-auto fw-bold" style="width: 120px;">
                     Mandato:
                 </div>
                 <div class="col report-justify">
                  ${divLinesMandato.innerHTML}
                 </div>  
             </div>
             `
        divDocumento.appendChild(divmandato)

        const divaclaraciones = document.createElement("div")
        divaclaraciones.className = "ms-4 mb-2"
        divaclaraciones.innerHTML = `
             <div class="row">
                 <div class="col-auto fw-bold" style="width: 120px;">
                     Aclaraciones:
                 </div>
                 <div class="col report-justify">
                  ${data_proyecto.aclaraciones
            }
                 </div>  
             </div>
             `
        divDocumento.appendChild(divaclaraciones)



        //Agregamos indicadores y metas
        const div = document.createElement("div")
        div.className = "ms-4 mb-3"
        div.innerHTML = `
             <div class="row">
                 <div class="col-auto fw-bold" style="width: 100px;">
                     META
                 </div>
                 <div class="col report-justify">
                  ${data_proyecto.indicador}%
                 </div>  
             </div>
             <div class="row">
                 <div class="col-auto fw-bold" style="width: 100px;">
                     AVANCE
                 </div>
                 <div class="col report-justify">
                  ${data_proyecto.cumplimiento}%
                 </div>  
             </div>
             `
        divDocumento.appendChild(div)

        const tit3_articulaciones = newEl("div")
        tit3_articulaciones.textContent = "Articulación con consejerías"
        tit3_articulaciones.className = "treport-5 text-secondary ms-3"
        divDocumento.appendChild(tit3_articulaciones)

        const articulaciones = data_proyecto.cslArticulacionPrj

        for (id in articulaciones) {
            const divArt = document.createElement("div")
            divArt.className = "ms-5 mb-3"
            divArt.innerHTML = `
                 <div class="row ms-2">
                     <div class="col-auto fw-bold" style="width: 100px;">
                         Consejería
                     </div>
                     <div class="col report-justify">
                      ${articulaciones[id].consejeria}
                     </div>  
                 </div>
                 <div class="row ms-2">
                     <div class="col-auto fw-bold" style="width: 100px;">
                         Mandato:
                     </div>
                     <div class="col report-justify">
                      ${articulaciones[id].mandatos}
                     </div>  
                 </div>
                 `
            divDocumento.appendChild(divArt)
        }



        const tit3_especificos = newEl("div")
        tit3_especificos.textContent = "Objetivos específicos"
        tit3_especificos.className = "treport-5 text-secondary ms-3"
        divDocumento.appendChild(tit3_especificos)
        const especificos = data_proyecto.clsEspecificos

        let i = 1
        for (id in especificos) {
            const divArt = document.createElement("div")
            divArt.className = "mb-2"
            divArt.innerHTML = `
                 <div class="row ms-2">
                     <div class="col-auto fw-bold" >
                         ${i}.
                     </div>
                     <div class="col report-justify">
                       ${especificos[id].nombre}
                     </div>  
                 </div>
                 `
            divDocumento.appendChild(divArt)
            i++
        }

        const tit3_evidencias = newEl("div")
        tit3_evidencias.textContent = "Evidencias"
        tit3_evidencias.className = "treport-5 text-secondary ms-3"
        divDocumento.appendChild(tit3_evidencias)


        try {

            const evidencias = data_proyecto.clsEvidencias

            let e = 1
            for (id in evidencias) {
                const divEvi = document.createElement("div")
                divEvi.className = "mb-2"
                divEvi.innerHTML = `
                 <div class="row ms-2">
                     <div class="col-auto fw-bold" >
                         ${e}.
                     </div>
                     <div class="col report-justify">
                       ${evidencias[id].nombre}
                     </div>  
                 </div>
                <div class="row ms-2">
                     <div class="col-auto fw-bold text-white" >
                          ${e}.
                     </div>
                     <div class="col report-justify fst-italic">
                       <b>Descripción: </b>${evidencias[id].descripcion}
                     </div>  
                 </div>
                    <div class="row ms-2">
                     <div class="col-auto fw-bold text-white" >
                          ${e}.
                     </div>
                     <div class="col report-justify fst-italic">
                        <b>Objetivo: </b>${evidencias[id].objetivo}
                     </div>  
                 </div>
                <div class="row ms-2">
                     <div class="col-auto fw-bold text-white" >
                          ${e}.
                     </div>
                     <div class="col report-justify fst-italic">
                      
                      <a class="nav-link" href="${evidencias[id].link}">
                        <b>enlace: </b>${evidencias[id].link}
                      </a>
                       
                     </div>  
                 </div>
                 `
                divDocumento.appendChild(divEvi)
                i++
            }


        } catch (error) {
            //console.log(proyectos)
        }

        console.log(proyectos[0])


    }



}



