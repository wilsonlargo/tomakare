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
    inputTextArea(parent, idInput, label) {
        const controlHTML = document.createElement("form")
        controlHTML.className = "form-floating mb-2"
        controlHTML.innerHTML = `
            <TextArea type="text" class="form-control" id="${idInput}" value="${parent.nombre}">
            <label for="${idInput}">${label}</label>
        `
        return controlHTML
    },

    cardAreas(nombre, texto, comandDel, comandShow) {
        const controlHTML = document.createElement("div")
        controlHTML.style.width="300px"
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
                    <i class="bi bi-pencil"></i>
            </button>
            `
            const btnCircleMostrar = document.createElement("button")
            btnCircleMostrar.className = "btn bg-primary text-white rounded-circle shadow-sm m-1"
            btnCircleMostrar.type = "button"
            btnCircleMostrar.innerHTML = `<i class="bi bi-eye"></i>`
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


