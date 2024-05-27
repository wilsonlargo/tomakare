//ESta es la continuación de las clases componentes
//se desarrolla aparte pues tien otros elementos qu eharían grande este componente

class Gestion {
    constructor(nombre, ogeneral, mandato, manager, financiado, fuente, valor, indicador, cumplimiento, aclaraciones, id, dominio) {
        this.nombre = nombre;
        this.ogeneral = ogeneral;
        this.mandato = mandato;
        this.manager = manager;
        this.financiado = financiado;
        this.fuente = fuente;
        this.valor = valor;
        this.indicador = indicador;
        this.cumplimiento = cumplimiento;
        this.aclaraciones = aclaraciones
        this.id = id;
        this.parent = dominio;
        this.cslArticulacionPrj = [];
        this.clsEspecificos = [];
    }

    addEspecificos(Especifico) {
        this.clsEspecificos.push(Especifico);
    }
    deleteEspecificos(id) {
        this.clsEspecificos.splice(id, 1);
    }
    addArticulacion(Articulacion) {
        this.cslArticulacionPrj.push(Articulacion);
    }
    deleteArticulacion(id) {
        this.cslArticulacionPrj.splice(id, 1);
    }

    makerHTMLProyeccion(area, linea, programa) {
        //Iniciamos colocando los titulos de esta sección y limpiando el escritorio


        document.getElementById("conteneder-bar-proyectos").hidden = true
        const cEscritorio = document.getElementById("panel-escritorio")
        cEscritorio.innerHTML = ''

        //Colocamos el ttulo de la consejería
        const Título = document.createElement('div');
        Título.className = "fs-3 fw-bold text-secondary"
        Título.textContent = area.nombre
        cEscritorio.appendChild(Título)

        //Colocamos el título de la línea
        const Título2 = document.createElement('div');
        Título2.className = "ms-2 fs-4 text-secondary"
        Título2.textContent = linea.nombre

        cEscritorio.appendChild(Título2)

        //Colocamos el título del programa
        const Título3 = document.createElement('div');
        Título3.className = "ms-3 fs-5 text-secondary"
        Título3.textContent = programa.nombre
        cEscritorio.appendChild(Título3)

        //Colocamos el título del proyecto
        const Título4 = document.createElement('div');
        Título4.className = "ms-4 mb-1 fs-6 text-success border-bottom border-4 w-60 border-success"
        Título4.textContent = this.nombre
        cEscritorio.appendChild(Título4)

        const barraNavegar = document.createElement("nav")
        barraNavegar.className = "navbar navbar-expand-lg bg-secondary"
        barraNavegar.innerHTML = `
        <div class="navbar-nav">
        <a class="navbar-brand text-white ms-3" href="#">PANEL PROYECTOS</a>
            <a class="nav-link text-white" href="#" id="lnkArea">Area / </a>
            <a class="nav-link text-white" href="#" id="lnkLinea">Linea / </a>
            <a class="nav-link text-white" href="#" id="lnkPrograma">Programa / </a>
            <a class="nav-link text-white" href="#" id="lnkVisor">Visor / </a>
            <a class="nav-link text-white" data-bs-toggle="offcanvas" href="#offcanvasNotas" role="button"
                aria-controls="offcanvasExample" id="linkNotas">
                Notas
            </a>
        </div>
        `
        cEscritorio.appendChild(barraNavegar)
        const linkArea = document.getElementById("lnkArea")
        linkArea.onclick = () => {
            area.makerHtmlAreasItem()
        }

        const linkLinea = document.getElementById("lnkLinea")
        linkLinea.onclick = () => {
            linea.parent = area
            linea.makerHTMLLineaPanel()
        }
        cEscritorio.appendChild(barraNavegar)
        const linkPrograma = document.getElementById("lnkPrograma")
        linkPrograma.onclick = () => {
            this.parent.makerHTMLProgramaPanel(area, linea)
        }
        const linkVisor = document.getElementById("lnkVisor")
        linkVisor.onclick = () => {
            parametrizador(area)
        }

        const linkNotas = document.getElementById("linkNotas")
        linkNotas.onclick = () => {
            //Asigna la función onclick al botón para relacionarlo con el área actual
            document.getElementById("btnAgregarNotaConsultor").onclick = () => {
                agregar_nota_consultor(area, `${area.id}-${linea.id}-${programa.id}-${this.id}`)
            }
            //Carga las notas del área activa
            cargar_notas_consultor(area)
        }

        cEscritorio.appendChild(barraNavegar)
        //============================================================


        //Ahora los input de cada dato
        //Creamos un input para el nombre del proyecto con retorno de valores
        const inputGestionNombre = document.createElement("form")
        inputGestionNombre.className = "form-floating mb-2"
        inputGestionNombre.innerHTML = `
            <input type="text" class="form-control" id="${this.id + "input-gestion-nombre"}" value="${this.nombre}">
            <label for="${this.id + "input-programa-nombre"}">Nombre proyecto</label>
        `


        //===================================================
        let labelFree = document.createElement("label")
        labelFree.className = "form-label mb-2 fw-medium text-success mt-3"
        labelFree.textContent = "Nombre del proyecto"
        cEscritorio.appendChild(labelFree)

        const intNombre = document.createElement("input")
        intNombre.className = "form-control mb-2"
        cEscritorio.appendChild(intNombre)


        intNombre.addEventListener('input', () => {
            this.nombre = intNombre.value
            Título4.textContent = intNombre.value
            GuardarVigencia()
        });
        intNombre.value = this.nombre;
        //===================================================


        //===================================================
        let labelFree2 = document.createElement("label")
        labelFree2.className = "form-label mb-2 fw-medium text-success"
        labelFree2.textContent = "Nombre administrador / coordinador"
        cEscritorio.appendChild(labelFree2)


        const intAdministrador = document.createElement("input")
        intAdministrador.className = "form-control mb-2"
        cEscritorio.appendChild(intAdministrador)


        intAdministrador.addEventListener('input', () => {
            this.nombre = intNombre.value
            GuardarVigencia()

        });
        intAdministrador.value = this.manager;

        //===================================================
        //===================================================
        let labelFree3 = document.createElement("label")
        labelFree3.className = "form-label mb-2 fw-medium text-success"
        labelFree3.textContent = "Objetivo General"
        cEscritorio.appendChild(labelFree3)


        const intObjetivo = document.createElement("textarea")
        intObjetivo.className = "form-control mb-2"
        intObjetivo.rows = 3
        cEscritorio.appendChild(intObjetivo)

        intObjetivo.addEventListener('input', () => {
            this.ogeneral = intObjetivo.value
            GuardarVigencia()

        });
        intObjetivo.value = this.ogeneral;

        //===================================================
        //===================================================
        let labelFree4 = document.createElement("label")
        labelFree4.className = "form-label mb-2 fw-medium text-success"
        labelFree4.textContent = "Mandato"
        cEscritorio.appendChild(labelFree4)


        const intMandato = document.createElement("textarea")
        intMandato.className = "form-control mb-2"
        intMandato.rows = 6
        cEscritorio.appendChild(intMandato)

        intMandato.addEventListener('input', () => {
            this.mandato = intMandato.value
            GuardarVigencia()

        });
        intMandato.value = this.mandato;

        //===================================================
        //===================================================
        let labelFree5 = document.createElement("label")
        labelFree5.className = "form-label mb-2 fw-medium text-success"
        labelFree5.textContent = "Aclaraciones"
        cEscritorio.appendChild(labelFree5)


        const intAclaraciones = document.createElement("textarea")
        intAclaraciones.className = "form-control mb-2 bg-warning-subtle"
        intAclaraciones.rows = 6
        cEscritorio.appendChild(intAclaraciones)

        intAclaraciones.addEventListener('input', () => {
            this.aclaraciones = intAclaraciones.value
            GuardarVigencia()

        });
        intAclaraciones.value = this.aclaraciones;

        //===================================================

        //Selector financiador
        const inputFinanciadoProy = document.createElement("div")
        inputFinanciadoProy.className = "form-check form-switch mb-2"
        inputFinanciadoProy.innerHTML = `
                <input class="form-check-input" type="checkbox" role="switch" id="input-financiado-proy">
                <label class="form-check-label fw-medium" for="input-financiado-proy">Proyecto financiado</label>
        `
        cEscritorio.appendChild(inputFinanciadoProy)
        const valFinanciador = document.getElementById("input-financiado-proy")
        valFinanciador.checked = this.financiado
        valFinanciador.onchange = () => {
            this.financiado = valFinanciador.checked
            if (this.financiado == false) {
                inputvalorProy.hidden = true
                inputfuenteProy.hidden = true
            } else {
                inputvalorProy.hidden = false
                this.valor = ""
                refinputvalorProy.value = ""
                inputfuenteProy.hidden = false
                this.fuente = ""
                refinputfuenteProy.value = ""
            }
            GuardarVigencia()
        }

        //Entrada de fuente nombre
        const inputfuenteProy = document.createElement("form")
        inputfuenteProy.className = "form-floating mb-2"
        inputfuenteProy.innerHTML = `
        <input type="text" class="form-control" id="input-gestion-fuente" value="${this.fuente}">
        <label for="input-gestion-administrador">Fuente financiación</label>
        `
        cEscritorio.appendChild(inputfuenteProy)

        const refinputfuenteProy = document.getElementById("input-gestion-fuente")
        refinputfuenteProy.oninput = () => {
            this.fuente = refinputfuenteProy.value;
            GuardarVigencia()
        }
        refinputfuenteProy.value = this.fuente

        //Entrada de fuente valor
        const inputvalorProy = document.createElement("form")
        inputvalorProy.className = "form-floating mb-2"
        inputvalorProy.innerHTML = `
                <input type="text" class="form-control" id="input-gestion-valor" value="${this.valor}">
                <label for="input-gestion-administrador">Valor</label>
                `
        cEscritorio.appendChild(inputvalorProy)

        const refinputvalorProy = document.getElementById("input-gestion-valor")
        refinputvalorProy.oninput = () => {
            this.valor = refinputvalorProy.value;
            GuardarVigencia()
        }
        refinputvalorProy.value = this.valor

        if (this.financiado == false) {
            inputvalorProy.hidden = true
            inputfuenteProy.hidden = true
        } else {
            inputvalorProy.hidden = false
            inputfuenteProy.hidden = false
        }



        //===================================================
        let labelFree7 = document.createElement("label")
        labelFree7.className = "form-label mb-2 fw-medium text-success mt-3"
        labelFree7.textContent = "Porcentaje en el programa"
        cEscritorio.appendChild(labelFree7)

        const inputIndicadorProy = document.createElement("input")
        inputIndicadorProy.className = "form-control mb-2 fs-4 text-success"
        cEscritorio.appendChild(inputIndicadorProy)

        inputIndicadorProy.addEventListener('input', () => {
            this.indicador = refinputIndicadorProy.value;
            GuardarVigencia()
        });
        inputIndicadorProy.value = this.indicador
        //===================================================
        //===================================================
        let labelFree8 = document.createElement("label")
        labelFree8.className = "form-label mb-2 fw-medium text-success mt-3"
        labelFree8.textContent = "Porcentaje cumplimiento"
        cEscritorio.appendChild(labelFree8)

        const inputCumplimientoProy = document.createElement("input")
        inputCumplimientoProy.className = "form-control mb-2 fs-4"
        cEscritorio.appendChild(inputCumplimientoProy)

        inputCumplimientoProy.addEventListener('input', () => {
            this.cumplimiento = inputCumplimientoProy.value;
            GuardarVigencia()
        });
        inputCumplimientoProy.value = this.cumplimiento
        //===================================================

        //Collapse para articulacion / versión simplificada
        const collapseArticulacion = HTML.collapseControl1("Articulación con Consejerías y mandatos", "cArticulacionCollapse", "articulacion", 'bi-arrow-left-right')
        cEscritorio.appendChild(collapseArticulacion)

        const Título5 = document.createElement('div');
        Título5.className = "ms-1 mt-4 mb-2 fs-4 border-bottom border-2 border-secondary fw-medium text-success"
        Título5.textContent = "Objetivos específicos"
        cEscritorio.appendChild(Título5)
        const btAgregarArticulacion = document.createElement("button")
        btAgregarArticulacion.className = "btn btn-outline-secondary m-1"
        btAgregarArticulacion.innerHTML = `<i class="bi bi-plus"></i> Agregar consejeria`
        btAgregarArticulacion.onclick = () => {
            const articulacion = new ArticulacionPrj("Consejería", "Mandato", 0, this)
            this.addArticulacion(articulacion)
            GuardarVigencia()

            document.getElementById("divarticulacioncollapse").innerHTML = ""

            let ar = 0
            this.cslArticulacionPrj.forEach(articulacion => {
                articulacion.id = ar++
                articulacion.parentId = this
                articulacion.makerHtmlArticulacion(this)

            })

        }
        document.getElementById("divarticulacionbutton").appendChild(btAgregarArticulacion)
        //=======================================================
        //Cargar las articulaciones con consejerias o mandatos
        document.getElementById("divarticulacioncollapse").innerHTML = ""
        let ar = 0
        this.cslArticulacionPrj.forEach(articulacion => {
            articulacion.id = ar++
            articulacion.parent = this
            articulacion.makerHtmlArticulacion(this)
        })



        //Agregar botton añadir objetivos específicos al proyecto
        const btAgregarEspecificos = document.createElement("button")
        btAgregarEspecificos.className = "btn btn-outline-secondary mt-2 mb-3"
        btAgregarEspecificos.innerHTML = `<i class="bi bi-plus"></i> Agregar objetivo`
        cEscritorio.appendChild(btAgregarEspecificos)

        //Agregamos un contendor de listad de específicos
        const divObjetivos_Específicos = document.createElement("div")
        divObjetivos_Específicos.id = "lstEspecificos"

        cEscritorio.appendChild(divObjetivos_Específicos)

        //Configuramos el botón agregar objetivos
        btAgregarEspecificos.onclick = () => {
            const ospecifico = new oespecificos('Objetivo específico', 0, 0, 0,this)
            this.addEspecificos(ospecifico)
            GuardarVigencia()

            divObjetivos_Específicos.innerHTML = ""
            let e = 0;
            this.clsEspecificos.forEach(especifico => {
                especifico.id = e++
                especifico.parent = this
                especifico.makerHTMLEspecificos(this)
            })
           
        }

        //Cargar todos los específicos
        divObjetivos_Específicos.innerHTML = ""
        console.log(this.clsEspecificos)
        let e = 0;
        this.clsEspecificos.forEach(especifico => {
            especifico.id = e++
            especifico.parent = this
            especifico.makerHTMLEspecificos(this)
        })



        //Agregamos un boton borrar gestion
        const btnBorrarGestion = document.createElement("button")
        btnBorrarGestion.className = "btn btn-outline-danger mt-5 m-1"
        btnBorrarGestion.innerHTML = `<i class="bi bi-trash3"></i> Eliminar proyecto`

        btnBorrarGestion.onclick = () => {
            modal.modalDelete(
                () => {
                    programa.deleteGestion(this.id)
                    programa.makerHTMLProgramaPanel(area, linea)
                }
            )


        }
        cEscritorio.appendChild(btnBorrarGestion)
        //=============================================

        //Cargamos los objetivos específicos



        //Agregamos un boton volver
        const btnretroceder = document.createElement("button")
        btnretroceder.className = "btn btn-outline-secondary mt-5 m-1"
        btnretroceder.innerHTML = `<i class="bi bi-arrow-return-left"></i> Volver`

        btnretroceder.onclick = () => {
            this.parent.makerHTMLProgramaPanel(area, linea)
        }
        cEscritorio.appendChild(btnretroceder)



    }




}
class ArticulacionPrj {
    constructor(consejeria, mandatos, id, parentId) {
        this.consejeria = consejeria;
        this.mandatos = mandatos;
        this.id = id
        this.parentId = parentId
    }
    makerHtmlArticulacion(dominio) {
        const collapseArticulacion = document.getElementById("divarticulacioncollapse")
        const item = document.createElement("ol")
        item.className = "list-group list-group-numbered"
        item.innerHTML = `
        <div class="">
            <div class="row justify-content-between">
                <div class="col-10 fw-bold text-start" data-bs-toggle="collapse" href="#collapseArticulacion${this.id}"
                    role="button">
                    <div id="tituloArticulacion${this.id}"><i class="bi bi-people-fill fs-4 me-2"></i>${this.id + 1}. ${this.consejeria}</div>
                </div>
            </div>
            <div class="collapse" id="collapseArticulacion${this.id}">
                <div class="card card-body">
                    <div class="form-floating mb-2">
                        <textarea class="form-control" id="int-Consejeria-Articulacion${this.id}"
                            style="height: 50px"></textarea>
                        <label for="int-Consejeria-Articulacion${this.id}">Consejeria</label>
                    </div>
                    <div class="form-floating mb-2">
                        <textarea class="form-control" id="int-Mandatos-Articulacion${this.id}"
                            style="height: 100px"></textarea>
                        <label for="int-Mandatos-Documento${this.id}">Mandatos</label>
                    </div>
                    <button type="button" class="btn btn-outline-danger" id="btnEliminarArticulacion${this.id}" style="width: 200px;">
                    <i class="bi bi-file-earmark-x me-2"></i>
                    Eliminar mandato</button>                 
                </div>
            </div>
        </div>`

        collapseArticulacion.appendChild(item)

        //Configuración nombre de la consejeria en articulación
        const ref_nombre_consejeria = document.getElementById(`int-Consejeria-Articulacion${this.id}`)
        //Se vincula y actualiza el nombre de la consejeria, junto al título del control y en la DB
        ref_nombre_consejeria.oninput = () => {
            this.consejeria = ref_nombre_consejeria.value
            //Actualiza el título sin perder el numerador y el ícono
            document.getElementById(`tituloArticulacion${this.id}`).innerHTML = `<i class="bi bi-people-fill fs-4 me-2"></i>${this.id + 1}. ${ref_nombre_consejeria.value}`
            GuardarVigencia()
        }
        ref_nombre_consejeria.value = this.consejeria

        //Configuración nombre del mandato en articulación
        const ref_mandato_consejeria = document.getElementById(`int-Mandatos-Articulacion${this.id}`)
        //Se vincula y actualiza el nombre de la consejeria, junto al título del control y en la DB
        ref_mandato_consejeria.oninput = () => {
            this.mandatos = ref_mandato_consejeria.value
            GuardarVigencia()
        }
        ref_mandato_consejeria.value = this.mandatos

        //Agrega evento al boton borrar articulacion
        document.getElementById(`btnEliminarArticulacion${this.id}`).onclick = () => {
            dominio.deleteArticulacion(this.id)
            GuardarVigencia()
            const cArticulacion = document.getElementById("divarticulacioncollapse")
            cArticulacion.innerHTML = ''
            let i = 0;
            dominio.cslArticulacionPrj.forEach(articulacion => {
                articulacion.id = i++
                articulacion.parentId = dominio
                articulacion.makerHtmlArticulacion(dominio);
            })
        }

    }
}

class oespecificos {
    constructor(nombre, meta, avance, id, dominio) {
        this.nombre = nombre;
        this.meta = meta;
        this.avance = avance;
        this.id = id;
        this.parent = dominio;
    }
    makerHTMLEspecificos(dominio) {
        const contenedor = document.getElementById("lstEspecificos")

        const item = document.createElement("div")
        item.className = "input-group mb-2"
        contenedor.appendChild(item)

        const span1 = document.createElement("span")
        span1.className = "input-group-text bg-secondary fw-bold text-white"
        span1.textContent = (this.id + 1) + "."
        item.appendChild(span1)

        const textArea = document.createElement("textarea")
        textArea.className = "form-control"
        textArea.value = this.nombre
        item.appendChild(textArea)
        textArea.oninput = () => {
            this.nombre = textArea.value
            GuardarVigencia()
        }

        const span2 = document.createElement("span")
        span2.className = "input-group-text bg-warning fw-bold"
        span2.innerHTML = `
        <a class="nav-link" href="#">
            <i class="bi bi-pencil"></i>
        </a>
        `
        item.appendChild(span2)

        const span3 = document.createElement("span")
        span3.className = "input-group-text bg-warning fw-bold"
        span3.innerHTML = `
        <a class="nav-link">
            <i class="bi bi-trash3"></i>
        </a>
        `
        item.appendChild(span3)


        span2.onclick = () => {

        }
        span3.onclick = () => {
            modal.modalDelete(
                () => {
                    dominio.deleteEspecificos(this.id)
                    GuardarVigencia()
                    console.log(dominio.clsEspecificos)
                    contenedor.innerHTML = ""
                    let e = 0;
                    dominio.clsEspecificos.forEach(especifico => {
                        especifico.id = e++
                        especifico.parent = dominio
                        especifico.makerHTMLEspecificos(dominio)
                    })
                }
            )

        }




    }


}



function listarGestiones() {
    document.getElementById("conteneder-bar-proyectos").hidden = true
    document.getElementById("panel-escritorio").innerHTML = ""

    //Colocamos el título del programa
    const Título5 = document.createElement('div');
    Título5.className = "ms-1 mt-4 mb-2 fs-5 text-secondary border-bottom border-1 border-secondary"
    Título5.textContent = "Lista de proyectos de esta vigencia"
    document.getElementById("panel-escritorio").appendChild(Título5)

    const contenedor_listas = document.createElement("ol")
    contenedor_listas.className = "list-group"
    document.getElementById("panel-escritorio").appendChild(contenedor_listas)

    let i = 0
    let g = 1
    ActiveProyect.clsAreas.forEach(area => {
        area.cslLineas.forEach(linea => {
            linea.clsPrograma.forEach(programa => {

                programa.clsGestion.forEach(gestion => {

                    const item = document.createElement("li")
                    item.className = "list-group-item d-flex justify-content-between align-items-start"

                    const porcentajeReal = (gestion.cumplimiento * 100) / gestion.indicador
                    let color;
                    if (porcentajeReal <= 30) {
                        color = "text-bg-danger"
                    } else if (porcentajeReal >= 90) {
                        color = "text-bg-success"
                    } else if (porcentajeReal <= 80) {
                        color = "text-bg-warning"
                    }
                    else if (porcentajeReal <= 50) {
                        color = "text-bg-warning-subtle"
                    }


                    item.innerHTML = `
                    <span class="input-group-text bg-warning"><i class="bi bi-file-earmark-text-fill"></i></span>
                    <div class="ms-2 me-auto">
                        <div class=""> <b>${area.nombre}</b> / ${linea.nombre} / ${programa.nombre}</div>
                        ${g++}. ${gestion.nombre}
                    </div>
                    <span class="badge ${color} rounded-pill ms-2 p-2"> (A) ${Math.trunc(porcentajeReal)} %</span>  

                    `
                    contenedor_listas.appendChild(item)

                    item.onclick = () => {
                        const elemento = ActiveProyect.clsAreas[area.id].cslLineas[linea.id].clsPrograma[programa.id].clsGestion[gestion.id]
                        //console.log(ActiveProyect.clsAreas[area.id].cslLineas[linea.id].clsPrograma)
                        elemento.makerHTMLProyeccion(area, linea, programa)

                    }


                })
            })
        })
    });

}
