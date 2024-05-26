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

        this.clsEspecificos = [];
    }

    addEspecificos(Especifico) {
        this.clsEspecificos.push(Especifico);
    }
    deleteEspecificos(id) {
        this.clsEspecificos.splice(id, 1);
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
        cEscritorio.appendChild(inputGestionNombre)

        //Configuramos el control de entrada para que se actualice, con un metodo oninput
        const refInputGestion = document.getElementById(this.id + "input-gestion-nombre")
        refInputGestion.addEventListener('input', () => {
            this.nombre = refInputGestion.value
            Título4.textContent = refInputGestion.value
            GuardarVigencia()
        });
        refInputGestion.value = this.nombre;


        const inputAdminProy = document.createElement("form")
        inputAdminProy.className = "form-floating mb-2"
        inputAdminProy.innerHTML = `
            <input type="text" class="form-control" id="input-gestion-administrador" value="${this.manager}">
            <label for="input-gestion-administrador">Nombre administrador / coordiandor</label>
        `
        cEscritorio.appendChild(inputAdminProy)

        const refinputAdminProy = document.getElementById("input-gestion-administrador")
        refinputAdminProy.oninput = () => {
            this.manager = refinputAdminProy.value;
            GuardarVigencia()
        }
        refinputAdminProy.value = this.manager

        //Input para inforamción del proyecto en relación al objetivo
        const inputTextObjetivo = HTML.inputTextArea2(this.id, "Objetivo General", 'InputTextObjetivo')
        cEscritorio.appendChild(inputTextObjetivo)

        const refObjetivoGe = document.getElementById(this.id + "InputTextObjetivo")
        refObjetivoGe.addEventListener('input', () => {
            this.ogeneral = refObjetivoGe.value
            GuardarVigencia()
        });
        refObjetivoGe.value = this.ogeneral;

        //Input para inforamción del proyecto en relación al mandato
        const inputTextMandato = HTML.inputTextArea2(this.id, "Mandato", 'InputTextMandato')
        cEscritorio.appendChild(inputTextMandato)

        const refMandato = document.getElementById(this.id + "InputTextMandato")
        refMandato.addEventListener('input', () => {
            this.mandato = refMandato.value
            GuardarVigencia()
        });
        refMandato.value = this.mandato;
        //================================
        //Input para inforamción del proyecto sobre aclaraciones
        const inputTextAclaraciones = HTML.inputTextArea2(this.id, "Aclaraciones", 'InputTextAclaraciones')
        cEscritorio.appendChild(inputTextAclaraciones)

        const refAclaraciones = document.getElementById(this.id + "InputTextAclaraciones")
        refAclaraciones.addEventListener('input', () => {
            this.aclaraciones = refAclaraciones.value
            GuardarVigencia()
        });
        refAclaraciones.value = this.aclaraciones;
        //================================

        //Selector financiador
        const inputFinanciadoProy = document.createElement("div")
        inputFinanciadoProy.className = "form-check form-switch mb-2"
        inputFinanciadoProy.innerHTML = `
                <input class="form-check-input" type="checkbox" role="switch" id="input-financiado-proy">
                <label class="form-check-label" for="input-financiado-proy">Proyecto financiado</label>
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

        //Entrada de fuente
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

        //Entrada de fuente
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


        //Porcentaje en el proyecto
        const inputIndicadorProy = document.createElement("form")
        inputIndicadorProy.className = "form-floating mb-2"
        inputIndicadorProy.innerHTML = `
            <input type="text" class="form-control" id="input-indicador" value="${this.indicador}">
            <label for="input-indicador">Porcentaje en el programa</label>
        `
        cEscritorio.appendChild(inputIndicadorProy)

        const refinputIndicadorProy = document.getElementById("input-indicador")
        refinputIndicadorProy.oninput = () => {
            this.indicador = refinputIndicadorProy.value;
            GuardarVigencia()
        }
        refinputIndicadorProy.value = this.indicador


        //Porcentaje en el proyecto
        const inputCumplimientoProy = document.createElement("form")
        inputCumplimientoProy.className = "form-floating mb-2"
        inputCumplimientoProy.innerHTML = `
                    <input type="text" class="form-control" id="input-cumplimiento" value="${this.cumplimiento}">
                    <label for="input-cumplimiento">Porcentaje de cumplimiento</label>
                `
        cEscritorio.appendChild(inputCumplimientoProy)

        const refinputCumplimientoProy = document.getElementById("input-cumplimiento")
        refinputCumplimientoProy.oninput = () => {
            this.cumplimiento = refinputCumplimientoProy.value;
            GuardarVigencia()
        }
        refinputCumplimientoProy.value = this.cumplimiento

        const Título5 = document.createElement('div');
        Título5.className = "ms-1 mt-4 mb-2 fs-4 text-secondary border-bottom border-2 border-secondary"
        Título5.textContent = "Objetivos específicos"
        cEscritorio.appendChild(Título5)


        //Agregar botton añadir objetivos específicos al proyecto
        const btAgregarEspecificos = document.createElement("button")
        btAgregarEspecificos.className = "btn btn-outline-secondary m-1"
        btAgregarEspecificos.innerHTML = `<i class="bi bi-plus"></i> Agregar objetivo`
        cEscritorio.appendChild(btAgregarEspecificos)

        //Agregamos un contendor de listad de específicos
        const divObjetivos_Específicos = document.createElement("div")
        divObjetivos_Específicos.id="lstEspecificos"

        cEscritorio.appendChild(divObjetivos_Específicos)

        //Configuramos el botón agregar objetivos
        btAgregarEspecificos.onclick = () => {
            const ospecifico = new oespecificos('Objetivo específico', 0, 0, 0)
            this.addEspecificos(ospecifico)
            GuardarVigencia()

            divObjetivos_Específicos.innerHTML = ""
            let e = 0;
            this.clsEspecificos.forEach(especifico => {
                especifico.id = e++
                especifico.parent = this
                especifico.makerHTMLEspecificos(area,this)
            })
        }

        //Cargar todos los específicos
        divObjetivos_Específicos.innerHTML = ""
        let e = 0;
        this.clsEspecificos.forEach(especifico => {
            especifico.id = e++
            especifico.parent = this
            especifico.makerHTMLEspecificos(area,this)
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

class oespecificos {
    constructor(nombre, meta, avance, id, dominio) {
        this.nombre = nombre;
        this.meta = meta;
        this.avance = avance;
        this.id = id;
        this.parent = dominio;
        this.clsActividades = [];
    }
    makerHTMLEspecificos() {
        const contenedor = document.getElementById("lstEspecificos")

        const item = document.createElement("p")
        item.textContent= this.nombre
        contenedor.appendChild(item)
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
