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
}

//Un control de mensajes configurable, remplaza a alert.
function mensajes(text,color){
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

function hiddePanelBorrar(){
    document.getElementById("PanelDel").hidden="false"
}
