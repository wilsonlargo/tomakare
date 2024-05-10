//ESta es la continuación de las clases componentes
//se desarrolla aparte pues tien otros elementos qu eharían grande este componente

//const { doc } = require("firebase/firestore");

class Gestion {
    constructor(nombre, ogeneral, manager, financiado, fuente, valor, id, partenid) {
        this.nombre = nombre;
        this.ogeneral = ogeneral;
        this.manager = manager;
        this.financiado = financiado;
        this.fuente = fuente;
        this.valor = valor;
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

        //Colocamos el título del programa
        const Título4 = document.createElement('div');
        Título4.className = "ms-4 mb-5 fs-6 text-success border-bottom border-4 w-60 border-success"
        Título4.textContent = this.nombre
        cEscritorio.appendChild(Título4)


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


        const inputTextObjetivo = HTML.inputTextArea2(this.id, "ObjetivoGeneral", 'InputTextObjetivo')
        cEscritorio.appendChild(inputTextObjetivo)

        const refObjetivoGe = document.getElementById(this.id + "InputTextObjetivo")
        refObjetivoGe.addEventListener('input', () => {
            this.ogeneral = refObjetivoGe.value
            GuardarVigencia()
        });
        refObjetivoGe.value = this.ogeneral;


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
            if(this.financiado==false){
                inputvalorProy.hidden=true
                inputfuenteProy.hidden=true
            }else{
                inputvalorProy.hidden=false
                this.valor=""
                refinputvalorProy.value=""
                inputfuenteProy.hidden=false
                this.fuente=""
                refinputfuenteProy.value=""
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
                <label for="input-gestion-administrador">Fuente financiación</label>
                `
        cEscritorio.appendChild(inputvalorProy)

        const refinputvalorProy = document.getElementById("input-gestion-valor")
        refinputvalorProy.oninput = () => {
            this.valor = refinputvalorProy.value;
            GuardarVigencia()
        }
        refinputvalorProy.value = this.valor

        if(this.financiado==false){
            inputvalorProy.hidden=true
            inputfuenteProy.hidden=true
        }else{
            inputvalorProy.hidden=false
            inputfuenteProy.hidden=false
        }



        //Agregamos un boton borrar gestion
        const btnBorrarGestion = document.createElement("button")
        btnBorrarGestion.className = "btn btn-outline-danger mt-5 m-1"
        btnBorrarGestion.innerHTML = `<i class="bi bi-trash3"></i> Eliminar proyecto`

        btnBorrarGestion.onclick = () => {
            parentid.deleteGestion(this.id)
            mostrar_escritorio()

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