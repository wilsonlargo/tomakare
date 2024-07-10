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
        this.clsEvidencias = [];
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

    addEvidencias(Evidencias) {
        this.clsEvidencias.push(Evidencias);
    }
    deleteEvidencias(id) {
        this.clsEvidencias.splice(id, 1);
    }

    makerHTMLProyeccion(area, linea, programa) {
        //Iniciamos colocando los titulos de esta sección y limpiando el escritorio

        document.getElementById("conteneder-bar-proyectos").hidden = true
        const cEscritorio = document.getElementById("panel-escritorio")
        cEscritorio.innerHTML = ''

        //Colocamos el ttulo de la consejería
        const Título = document.createElement('div');
        Título.className = "ps-2 bg-secondary text-white fw-bold"
        Título.style.fontSize="18px"
        Título.textContent = this.parent.nombre
        cEscritorio.appendChild(Título)

        //Colocamos el título de la línea
        const Título2 = document.createElement('div');
        Título2.className = "ps-2 bg-secondary text-warning fw-medium"
        Título2.style.fontSize="16px"
        Título2.textContent = this.nombre
        cEscritorio.appendChild(Título2)

        //Colocamos el título del programa
        const Título3 = document.createElement('div');
        Título3.className = "ps-2 bg-secondary text-info"
        Título3.style.fontSize="15px"
        Título3.textContent = this.nombre
        cEscritorio.appendChild(Título3)

        //Colocamos el título del proyecto
        const Título4 = document.createElement('div');
        Título4.className = "pe-4 pb-2 bg-secondary shadow text-white text-end border border-top border-1 border-white sticky-top"
        Título4.style.fontSize="16px"
        Título4.textContent = this.nombre
        cEscritorio.appendChild(Título4)

        const barraNavegar = document.getElementById("navbarplan")
         barraNavegar.innerHTML = `
            <a class="col-auto nav-link m-2 fw-bold"  href="#">PANEL PROYECTOS / </a>
            <a class="col-auto nav-link m-2"  href="#" id="lnkArea">Area / </a>
            <a class="col-auto nav-link m-2"  href="#" id="lnkLinea">Linea / </a>
            <a class="col-auto nav-link m-2"  href="#" id="lnkPrograma">Programa / </a>
            <a class="col-auto nav-link m-2" href="#" id="lnkVisor"> <i class="bi bi-eyeglasses me-2"></i>Visor / </a>
            <a class="col-auto nav-link m-2" data-bs-toggle="offcanvas" href="#offcanvasNotas" role="button"
                aria-controls="offcanvasExample" id="linkNotas">
                <i class="bi bi-sticky me-2"></i> Notas
            </a>
    
        `
        const linkArea = document.getElementById("lnkArea")
        linkArea.onclick = () => {
            area.makerHtmlAreasItem()
        }

        const linkLinea = document.getElementById("lnkLinea")
        linkLinea.onclick = () => {
            linea.parent = area
            linea.makerHTMLLineaPanel()
        }
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
        labelFree.className = "labelorg-orange-light text-secondary border border-1 border-warning mt-3"
        labelFree.textContent = "Nombre del proyecto"
        cEscritorio.appendChild(labelFree)


        const intNombre = document.createElement("input")
        intNombre.className = "form-control mb-2 ms-2"
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
        labelFree2.className = "labelorg-orange-light text-secondary border border-1 border-warning"
        labelFree2.textContent = "Nombre administrador / coordinador"
        cEscritorio.appendChild(labelFree2)


        const intAdministrador = document.createElement("input")
        intAdministrador.className = "form-control mb-2 ms-2"
        cEscritorio.appendChild(intAdministrador)


        intAdministrador.addEventListener('input', () => {
            this.nombre = intNombre.value
            GuardarVigencia()

        });
        intAdministrador.value = this.manager;

        //===================================================
        //===================================================
        let labelFree3 = document.createElement("label")
        labelFree3.className = "labelorg-orange-light text-secondary border border-1 border-warning"
        labelFree3.textContent = "Objetivo General"
        cEscritorio.appendChild(labelFree3)


        const intObjetivo = document.createElement("textarea")
        intObjetivo.className = "form-control mb-2 ms-2"
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
        labelFree4.className = "labelorg-orange-light text-secondary border border-1 border-warning"
        labelFree4.textContent = "Mandato"
        cEscritorio.appendChild(labelFree4)


        const intMandato = document.createElement("textarea")
        intMandato.className = "form-control mb-2 ms-2"
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
        labelFree5.className = "labelorg-orange-light text-secondary border border-1 border-warning"
        labelFree5.textContent = "Aclaraciones"
        cEscritorio.appendChild(labelFree5)


        const intAclaraciones = document.createElement("textarea")
        intAclaraciones.className = "form-control mb-2 ms-2 bg-warning-subtle"
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
        labelFree7.className = "labelorg-orange-light text-secondary border border-1 border-warning"
        labelFree7.textContent = "Porcentaje en el programa"
        cEscritorio.appendChild(labelFree7)

        const inputIndicadorProy = document.createElement("input")
        inputIndicadorProy.className = "form-control mb-2 ms-2 fs-4 text-success"
        cEscritorio.appendChild(inputIndicadorProy)

        inputIndicadorProy.addEventListener('input', () => {
            this.indicador = refinputIndicadorProy.value;
            GuardarVigencia()
        });
        inputIndicadorProy.value = this.indicador
        //===================================================
        //===================================================
        let labelFree8 = document.createElement("label")
        labelFree8.className = "labelorg-orange-light text-secondary border border-1 border-warning"
        labelFree8.textContent = "Porcentaje cumplimiento"
        cEscritorio.appendChild(labelFree8)

        const inputCumplimientoProy = document.createElement("input")
        inputCumplimientoProy.className = "form-control mb-2 fs-4 ms-2"
        cEscritorio.appendChild(inputCumplimientoProy)

        inputCumplimientoProy.addEventListener('input', () => {
            this.cumplimiento = inputCumplimientoProy.value;
            GuardarVigencia()
        });
        inputCumplimientoProy.value = this.cumplimiento
        //===================================================

        //Collapse para articulacion / versión simplificada
        const collapseArticulacion = HTML.collapseControl1("Articulación con Consejerías y mandatos", 
        "cArticulacionCollapse", "articulacion", 
        'bi-arrow-left-right',"text-white collapse-org bg-primary bg-gradient shadow-sm mt-2")
        cEscritorio.appendChild(collapseArticulacion)

        const Título5 = document.createElement('div');
        Título5.className = "text-white collapse-org bg-warning shadow-sm mt-2"
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


        //Collapse para evidencias / versión simplificada
        const collapseEvidenicias = HTML.collapseControl1("Evidencias / Anexos", "cEvidenciasCollapse", "libreria",
            "bi-journals", "text-white collapse-org bg-primary bg-gradient shadow-sm mt-2")
        cEscritorio.appendChild(collapseEvidenicias)
        const cEvidencias = document.getElementById("cEvidenciasCollapse")
        //Agregar un boton para agregar un documento
        const btAgregarLibro = document.createElement("button")
        btAgregarLibro.className = "btn btn-outline-secondary m-1"
        btAgregarLibro.innerHTML = `<i class="bi bi-plus"></i> Agregar documento`
        btAgregarLibro.onclick = () => {
            const evidencia = new Evidencia('Nuevo documento', "texto", "Palabras clave", "#", "Descripcion", 0, this)
            this.addEvidencias(evidencia)
            GuardarVigencia()


        }
        document.getElementById("divlibreriabutton").appendChild(btAgregarLibro)

        
        cEvidencias.innerHTML = ''
        let doc = 0;
        this.clsEvidencias.forEach(evidencia => {

            evidencia.id = doc++
            evidencia.parentId = this
            evidencia.makerHtmlEvidencia(evidencia);
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

class Evidencia {
    constructor(nombre, tipo, keys, link, descripcion, id, parentId) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.keys = keys;
        this.link = link;
        this.descripcion = descripcion;
        this.id = id
        this.parentId = parentId
    }
    makerHtmlEvidencia(libro) {

        const tiposDoc = {
            "texto": () => {
                const icono = "bi bi-file-earmark-text-fill fs-4 me-2"
                return icono
            },
            "calculo": () => {
                const icono = "bi-file-earmark-spreadsheet-fill fs-4 me-2"
                return icono
            },
            "video": () => {
                const icono = "bi-file-earmark-play-fill fs-4 me-2"
                return icono
            },
            "presentacion": () => {
                const icono = "bi bi-file-earmark-easel-fill fs-4 me-2"
                return icono
            },
            "audio": () => {
                const icono = "bi bi-file-earmark-music-fill fs-4 me-2"
                return icono
            },
            "web": () => {
                const icono = "bi bi-filetype-html fs-4 me-2"
                return icono
            },
            "imagen": () => {
                const icono = "bi bi-file-image-fill fs-4 me-2"
                return icono
            },
            "pdf": () => {
                const icono = "bi bi-file-earmark-pdf-fill fs-4 me-2"
                return icono
            }


        }

        const collaseLibros = document.getElementById("cEvidenciasCollapse")
        const item = document.createElement("ol")
        item.className = "list-group list-group-numbered"
        item.innerHTML = `
        <div class="">
            <div class="row justify-content-between">
                <div class="col-10 fw-bold text-start" data-bs-toggle="collapse" href="#collapseLibro${libro.id}"
                    role="button" aria-controls="collapseLibro${libro.id}">
                    <div id="tituloLibro${libro.id}"><i class="bi bi-file-earmark-text-fill fs-4 me-2" id="icoPrincipal${libro.id}"></i>${libro.id + 1}. ${libro.nombre}</div>
                </div>
                <div class="col-2 text-end">
                    <a id="btnLinkPrincipal${libro.id}" class="nav-link active fs-3 text-primary" aria-current="page"
                        href="#" target="_blank"><i class="bi bi-link-45deg"></i></a>
                </div>
            </div>
            <div class="collapse" id="collapseLibro${libro.id}">
                <div class="card card-body">
                    <div class="form-floating mb-2">
                        <textarea class="form-control" id="int-Nombre-Documento${libro.id}"
                            style="height: 50px"></textarea>
                        <label for="int-Nombre-Documento${libro.id}">Título del documento</label>
                    </div>
                    <div class="form-floating mb-2">
                        <textarea class="form-control" id="int-keys-Documento${libro.id}"
                            style="height: 50px"></textarea>
                        <label for="int-keys-Documento${libro.id}">Palabras claves / categorias</label>
                    </div>
                    <div class="form-floating mb-2">
                    <textarea class="form-control" id="int-descripcion-Documento${libro.id}"
                        style="height: 50px"></textarea>
                    <label for="int-descripcion-Documento${libro.id}">Descripción / Tema del documento</label>
                    </div>
                    <div class="input-group mb-2">
                        <textarea class="form-control" aria-label="With textarea" id="int-link-Documento${libro.id}" placeholder="Vínculo o enlace del documento"></textarea>
                        <span class="input-group-text">
                            <a id="btnLinkSecundario${libro.id}" class="nav-link active fs-5" aria-current="page"
                            href="#" target="_blank"><i class="bi bi-link-45deg"></i>
                        </a>
                    </span>
                      </div>
                    <div class="dropdown">
                        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="btntipo${libro.id}">
                          Tipo de archivo
                        </button>
                        <ul class="dropdown-menu">
                          <li id="btnTexto${libro.id}"><a class="dropdown-item"><i class="bi bi-file-earmark-text-fill me-2 fs-4"></i>Documento texto</a></li>
                          <li id="btnCalculo${libro.id}"><a class="dropdown-item"><i class="bi bi-file-earmark-spreadsheet-fill me-2 fs-4"></i>Hoja cálculo</a></li>
                          <li id="btnVideo${libro.id}"><a class="dropdown-item"><i class="bi bi-file-earmark-play-fill me-2 fs-4"></i>Video</a></li>
                          <li id="btnAudio${libro.id}"><a class="dropdown-item"><i class="bi bi-file-earmark-music-fill me-2 fs-4"></i>Audio</a></li>
                          <li id="btnPresentacion${libro.id}"><a class="dropdown-item"><i class="bi bi-file-earmark-easel-fill me-2 fs-4"></i>Presentación</a></li>
                          <li id="btnImagen${libro.id}"><a class="dropdown-item"><i class="bi bi-file-image-fill me-2 fs-4"></i>Imagen</a></li>
                          <li id="btnWeb${libro.id}"><a class="dropdown-item"><i class="bi bi-filetype-html me-2 fs-4"></i>Página web</a></li>
                          <li id="btnPdf${libro.id}"><a class="dropdown-item"><i class="bi bi-file-earmark-pdf-fill me-2 fs-4"></i>Documento pdf</a></li>
                        </ul>
                        <button type="button" class="btn btn-outline-danger" id="btnEliminarLink${libro.id}">Eliminar vínculo</button>
                    </div>
                   
                </div>
            </div>
        </div>`

        collaseLibros.appendChild(item)
        //Configuración nombre del libro
        const ref_nombre_libro = document.getElementById(`int-Nombre-Documento${libro.id}`)
        //document.getElementById(`tituloLibro${libro.id}`)
        //Se vincula y actualiza el nombre del libro, junto al título del control y en la DB
        ref_nombre_libro.oninput = () => {
            libro.nombre = ref_nombre_libro.value
            //Actualiza el título sin perder el numerador y el ícono
            document.getElementById(`tituloLibro${libro.id}`).innerHTML = `<i class="bi bi-file-earmark-text-fill fs-4 me-2"></i>${libro.id + 1}. ${ref_nombre_libro.value}`
            GuardarVigencia()
        }
        ref_nombre_libro.value = libro.nombre


        //Configuración palabras clave del libro
        const ref_keys_libro = document.getElementById(`int-keys-Documento${libro.id}`)
        ref_keys_libro.oninput = () => {
            libro.keys = ref_keys_libro.value
            GuardarVigencia()
        }
        ref_keys_libro.value = libro.keys


        //Configuración descripcion del libro
        const ref_descripcion_libro = document.getElementById(`int-descripcion-Documento${libro.id}`)
        ref_descripcion_libro.oninput = () => {
            libro.descripcion = ref_descripcion_libro.value
            GuardarVigencia()
        }
        ref_descripcion_libro.value = libro.descripcion

        //Configuración enlace del libro
        const ref_link_libro = document.getElementById(`int-link-Documento${libro.id}`)
        ref_link_libro.oninput = () => {
            libro.link = ref_link_libro.value
            //actualiza los enlaces para abrir en otro documento
            document.getElementById(`btnLinkPrincipal${libro.id}`).href = ref_link_libro.value
            document.getElementById(`btnLinkSecundario${libro.id}`).href = ref_link_libro.value
            GuardarVigencia()
        }
        ref_link_libro.value = libro.link
        //Cuando carga la clase actualiza los enlaces para abrir en una página aparte
        document.getElementById(`btnLinkPrincipal${libro.id}`).href = libro.link
        document.getElementById(`btnLinkSecundario${libro.id}`).href = libro.link

        //Según sea la selección en el menú tipo, así msimo le asigna un valor a cada evento
        //El cambio de tipo actualiza en la BD y cambia el icono de cada archivo

        document.getElementById(`btnTexto${libro.id}`).onclick = () => {
            document.getElementById(`icoPrincipal${libro.id}`).className = tiposDoc.texto()
            libro.tipo = "texto"
            document.getElementById(`btntipo${libro.id}`).textContent = "Documento tipo " + libro.tipo
        }
        document.getElementById(`btnCalculo${libro.id}`).onclick = () => {
            document.getElementById(`icoPrincipal${libro.id}`).className = tiposDoc.calculo()
            libro.tipo = "calculo"
            document.getElementById(`btntipo${libro.id}`).textContent = "Documento tipo " + libro.tipo
        }
        document.getElementById(`btnVideo${libro.id}`).onclick = () => {
            document.getElementById(`icoPrincipal${libro.id}`).className = tiposDoc.video()
            libro.tipo = "video"
            document.getElementById(`btntipo${libro.id}`).textContent = "Documento tipo " + libro.tipo
        }

        document.getElementById(`btnAudio${libro.id}`).onclick = () => {
            document.getElementById(`icoPrincipal${libro.id}`).className = tiposDoc.audio()
            libro.tipo = "audio"
            document.getElementById(`btntipo${libro.id}`).textContent = "Documento tipo " + libro.tipo
        }
        document.getElementById(`btnPresentacion${libro.id}`).onclick = () => {
            document.getElementById(`icoPrincipal${libro.id}`).className = tiposDoc.presentacion()
            libro.tipo = "presentacion"
            document.getElementById(`btntipo${libro.id}`).textContent = "Documento tipo " + libro.tipo
        }
        document.getElementById(`btnImagen${libro.id}`).onclick = () => {
            document.getElementById(`icoPrincipal${libro.id}`).className = tiposDoc.imagen()
            libro.tipo = "imagen"
            document.getElementById(`btntipo${libro.id}`).textContent = "Documento tipo " + libro.tipo
        }
        document.getElementById(`btnWeb${libro.id}`).onclick = () => {
            document.getElementById(`icoPrincipal${libro.id}`).className = tiposDoc.web()
            libro.tipo = "web"
            document.getElementById(`btntipo${libro.id}`).textContent = "Documento tipo " + libro.tipo
        }
        document.getElementById(`btnPdf${libro.id}`).onclick = () => {
            document.getElementById(`icoPrincipal${libro.id}`).className = tiposDoc.pdf()
            libro.tipo = "pdf"
            document.getElementById(`btntipo${libro.id}`).textContent = "Documento tipo " + libro.tipo
        }

        //Actualzia el texto del boton tipo en relación a la BD
        document.getElementById(`btntipo${libro.id}`).textContent = "Documento tipo " + libro.tipo
        //Si al mirar la BD hay un error en el tipo de documento, deja por defecto texto
        try {
            document.getElementById(`icoPrincipal${libro.id}`).className = tiposDoc[libro.tipo]()
        } catch (error) {
            document.getElementById(`icoPrincipal${libro.id}`).className = tiposDoc.texto()
            libro.tipo = "texto"
        }

        //Agrega evento al boton borrar link
        document.getElementById(`btnEliminarLink${libro.id}`).onclick = () => {
            this.parentId.deleteLibreria(libro.id)
            GuardarVigencia()
            const cLibros = document.getElementById("divlibreriacollapse")
            cLibros.innerHTML = ''
            let i = 0;
            this.parentId.cslLibrerias.forEach(libro => {
                libro.id = i++
                libro.parentId = this.parentId
                libro.makerHtmlLibro(libro);
            })
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
