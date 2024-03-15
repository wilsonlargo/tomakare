//======================================================================================================
//Este módulo adminstra las acciones secundarias como variables globales de apoyo,
//construtores generales de controles
//Guarda información global de los proyectos cargados, y del proyecto activo
const GLOBAL = {
    state: {
        proyecto: null,
        proyectos: [],
        usuario: null,
        usuarios: [],
    },
    firestore: {},
};

let aUsers = []
let activeEmail;
//Constructor de elementos HTML, como función y sus elementos
const HTML = {
    inputContol(parent, idInput, label) {
        const controlHTML = document.createElement("form")
        controlHTML.className = "form-floating mb-2"
        controlHTML.innerHTML = `
            <input type="text" class="form-control" id="${idInput}" value="${parent.nombre}">
            <label for="${idInput}">${label}</label>
        `
        return controlHTML
    },
    inputTextArea(idInput, label) {
        const controlHTML = document.createElement("form")
        controlHTML.className = "form-floating mb-2"
        controlHTML.innerHTML = `
            <textarea class="form-control" placeholder="Escriba aquí su comentario" id="${idInput}" style="height: 100px"></textarea>
            <label for="${idInput}">${label}</label>            
        `
        return controlHTML
    },

    inputTextArea2(idInput, label, idText) {
        const controlHTML = document.createElement("form")
        controlHTML.className = "form-floating mb-2"
        controlHTML.innerHTML = `
            <textarea class="form-control" 
            placeholder="Escriba aquí su comentario" 
            id="${idInput}${idText}" style="height: 100px">
            spellcheck</textarea>
            <label for="${idInput}${idText}">${label}</label>            
        `
        return controlHTML
    },
    inputTextArea3(id, idParent,label, idtext,value) {
        const controlHTML = document.createElement("form")
        controlHTML.className = "form-floating mb-2"
        controlHTML.innerHTML = `
            <textarea class="form-control" 
            id="${idParent}${id}inputText${idtext}" 
            style="height: 100px"
            spellcheck>${value}</textarea>
            <label for="${idParent}${id}inputText${idtext}">${label}</label>            
        `
        return controlHTML
    },
    inputSpan(id,value) {
        
        const controlHTML = document.createElement("div")
        controlHTML.className = "input-group mb-3"
        controlHTML.innerHTML = `                        
        <span class="input-group-text" id="${id}btnNumeraMandato">
        ${id+1}
        </span>
       <input id="${id}InputMandato" type="text" class="form-control" placeholder="Mandato"
        aria-label="Mandatos" aria-describedby="basic-addon1"
        value="${value}">
        <span class="input-group-text">
            <button class="btn text-warning fw-medium" id="${id}btnBorrarMandato">
                <i class="bi bi-trash3 h4 fw-medium"></i>
            </button>
        </span>
        `

        return controlHTML
    },
    inputSpan2(id,value, idtext) {
        
        const controlHTML = document.createElement("div")
        controlHTML.className = "input-group mb-3"
        controlHTML.innerHTML = `                        
        <span class="input-group-text" id="${id}btnNumeraLinea">
        ${id+1}
        </span>
       <input id="${id}${idtext}" type="text" class="form-control" placeholder=""
        aria-label="Mandatos" aria-describedby="basic-addon1"
        value="${value}">
        <span class="input-group-text">
            <button class="btn text-warning fw-medium" id="${id}btnBorrarLinea">
                <i class="bi bi-trash3 h4 fw-medium"></i>
            </button>
        </span>
        `

        return controlHTML
    },

    inputSpan3(id, idParent,value, idtext) {
        
        const controlHTML = document.createElement("div")
        controlHTML.className = "input-group mb-3"
        controlHTML.innerHTML = `                        
        <span class="input-group-text">
        ${id+1}
        </span>

       <input id="${idParent}${id}Input${idtext}" type="text" class="form-control" placeholder="${idtext}"
        aria-label="${idtext}" aria-describedby="basic-addon1"
        value="${value}">

        <span class="input-group-text">
            <button class="btn text-warning fw-medium" id="${idParent}${id}btnBorrar${idtext}">
                <i class="bi bi-trash3 h4 fw-medium"></i>
            </button>
        </span>
        `
        return controlHTML
    },

    cardAreas(nombre, texto, comandDel, comandShow) {
        const controlHTML = document.createElement("div")
        controlHTML.style.width = "300px"
        controlHTML.className = "card shadow-sm m-2"
        controlHTML.innerHTML = `

        <div class="card-header bg-primary-subtle fw-medium">
            ${nombre}
        </div>
        <div class="card-body bg-org-gray">
            <div class="text-success">${texto}</div>
        </div>
    `
        controlHTML.appendChild(addFotter())

        function addFotter() {
            const cFooter = document.createElement('footer')
            cFooter.className = "card-footer bg-org-gray p-1"
            cFooter.innerHTML = `
             <button type="button" class="btn bg-primary text-white rounded-circle shadow-sm"
             
                    onclick="a()">
                    
                    <i class="bi bi-eye"></i>
            </button>
            `
            const btnCircleMostrar = document.createElement("button")
            btnCircleMostrar.className = "btn bg-primary text-white rounded-circle shadow-sm m-1"
            btnCircleMostrar.type = "button"
            btnCircleMostrar.innerHTML = `<i class="bi bi-pencil"></i>`
            btnCircleMostrar.onclick = comandShow
            cFooter.appendChild(btnCircleMostrar)

            const btnCircleBorrar = document.createElement("button")
            btnCircleBorrar.className = "btn bg-primary text-white rounded-circle shadow-sm m-1"
            btnCircleBorrar.type = "button"
            btnCircleBorrar.innerHTML = `<i class="bi bi-trash3"></i>`
            btnCircleBorrar.onclick = comandDel
            cFooter.appendChild(btnCircleBorrar)

            return cFooter

        }


        return controlHTML
    },
}



//Un control de mensajes configurable, remplaza a alert.
function mensajes(text, color) {
    Toastify({
        text: text,
        duration: 3000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: color,
            color: "white",
        },
        onClick: function () { } // Callback after click
    }).showToast();

}


function hiddePanelBorrar() {
    document.getElementById("PanelDel").hidden = "false"
}


const HiddenControl = {
    hiddetoVigencias() {
        document.getElementById("paneListlVigencias").hidden = true
        document.getElementById("contenedor-area").hidden = true
        document.getElementById("accordionControl").hidden = true
        
        document.getElementById("contenedor-bar-areas").hidden = true
        document.getElementById("ContenedorControls").hidden = false
        document.getElementById("conteneder-bar-proyectos").hidden = false
        
        



        const tj = document.getElementById("contenedor-tarjetas")
        tj.className = ''
        tj.hidden = true
    },
    hiddetoProyectos() {
        document.getElementById("contenedor-vigencia").hidden = true
        document.getElementById("contenedor-area").hidden = true
        document.getElementById("contenedor-bar-areas").hidden = true
        document.getElementById("accordionControl").hidden = true

        const tj = document.getElementById("contenedor-tarjetas")
        tj.className = ''
        tj.hidden = true
    },
    hiddeAllcontrol() {
        document.getElementById("paneListlVigencias").hidden = true
        document.getElementById("conteneder-bar-proyectos").hidden = true
        document.getElementById("contenedor-bar-areas").hidden = true
        document.getElementById("contenedor-area").hidden = true
        document.getElementById("ContenedorControls").hidden = true
        document.getElementById("accordionControl").hidden = true



        //Al parecer contenedores flexibles no se ocultan bien
        //Cambio la clase y luego lo oculto y asi en otro sentido
        const tj = document.getElementById("contenedor-tarjetas")
        tj.className = ''
        tj.hidden = true



    },
    hiddentoArea() {
        document.getElementById("paneListlVigencias").hidden = true
        document.getElementById("conteneder-bar-proyectos").hidden = true
        document.getElementById("ContenedorControls").hidden = true

        const tj = document.getElementById("contenedor-tarjetas")
        tj.className = ''
        tj.hidden = true

        document.getElementById("contenedor-bar-areas").hidden = false
        document.getElementById("accordionControl").hidden = false
    }
}

const modal = {

    modalDelete(comando) {
        const modal = new bootstrap.Modal(document.getElementById('myModal'));
        const texto = document.getElementById("textoModal")
        texto.textContent="¿Está seguro de eliminar este elemento?"

        modal.show();
        const btn = document.getElementById('btnBorrarConfirm')
        btn.onclick = comando

    }


}



