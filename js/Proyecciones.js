//ESta es la continuación de las clases componentes
//se desarrolla aparte pues tien otros elementos qu eharían grande este componente

//const { doc } = require("firebase/firestore");

class Gestion {
    constructor(nombre, ogeneral, mandato, manager, financiado, fuente, valor, indicador, cumplimiento, id, partenid) {
        this.nombre = nombre;
        this.ogeneral = ogeneral;
        this.mandato = mandato;
        this.manager = manager;
        this.financiado = financiado;
        this.fuente = fuente;
        this.valor = valor;
        this.indicador = indicador;
        this.cumplimiento = cumplimiento;
        this.id = id;
        this.partenid = partenid;

        this.clsEspecificos = [];
    }

    addEspecificos(Especifico) {
        this.clsEspecificos.push(Especifico);
    }
    deleteEspecificos(id) {
        this.clsEspecificos.splice(id, 1);
    }

    makerHTMLProyeccion(area, linea, programa, parentid) {
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
        Título3.textContent = programa
        cEscritorio.appendChild(Título3)

        //Colocamos el título del proyecto
        const Título4 = document.createElement('div');
        Título4.className = "ms-4 mb-1 fs-6 text-success border-bottom border-4 w-60 border-success"
        Título4.textContent = this.nombre
        cEscritorio.appendChild(Título4)

        const barraNavegar = document.createElement("nav")
        barraNavegar.className="navbar navbar-expand-lg bg-body-tertiary ms-3"
        barraNavegar.innerHTML=`
        <div class="navbar-nav">
            <a class="nav-link" href="#" id="lnkArea">Area / </a>
            <a class="nav-link" href="#" id="lnkLinea">Linea / </a>
            <a class="nav-link" href="#" id="lnkPrograma">Programa / </a>
            <a class="nav-link" href="#" id="lnkVisor">Visor</a>
        </div>
        `
        cEscritorio.appendChild(barraNavegar)
        const linkArea= document.getElementById("lnkArea")
        linkArea.onclick=()=>{
            area.makerHtmlAreasItem()
        }

        const linkLinea= document.getElementById("lnkLinea")
        linkLinea.onclick=()=>{
            linea.makerHTMLLineaPanel(linea)
        }
        cEscritorio.appendChild(barraNavegar)
        const linkPrograma= document.getElementById("lnkPrograma")
        linkPrograma.onclick=()=>{
            this.partenid.makerHTMLProgramaPanel(area,linea)
        }
        const linkVisor= document.getElementById("lnkVisor")
        linkVisor.onclick=()=>{
            parametrizador(area)
        }

        cEscritorio.appendChild(barraNavegar)












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
        Título5.className = "ms-1 mt-4 mb-2 fs-6 text-secondary border-bottom border-2 border-secondary"
        Título5.textContent = "Objetivos específicos"
        cEscritorio.appendChild(Título5)





        //Agregamos un boton borrar gestion
        const btnBorrarGestion = document.createElement("button")
        btnBorrarGestion.className = "btn btn-outline-danger mt-5 m-1"
        btnBorrarGestion.innerHTML = `<i class="bi bi-trash3"></i> Eliminar proyecto`

        btnBorrarGestion.onclick = () => {
            modal.modalDelete(
                () => {
                    parentid.deleteGestion(this.id)
                    parentid.makerHTMLProgramaPanel(area, linea)
                }
            )


        }
        cEscritorio.appendChild(btnBorrarGestion)


        //Agregamos un boton borrar gestion
        const btnretroceder = document.createElement("button")
        btnretroceder.className = "btn btn-outline-secondary mt-5 m-1"
        btnretroceder.innerHTML = `<i class="bi bi-arrow-return-left"></i> Volver`

        btnretroceder.onclick = () => {
            parentid.makerHTMLProgramaPanel(area, linea)

        }
        cEscritorio.appendChild(btnretroceder)


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
    let g=1
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
                        elemento.makerHTMLProyeccion(area, linea, programa.nombre, programa)

                    }


                })
            })
        })
    });

}
