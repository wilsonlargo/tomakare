//Modulo que administra los proyectos y la construcción de los objetos visibles

//Esta variable guarda el proyecto activo como clase
let ActiveProyect;

class clsProyecto {
    constructor(nombre, vigencia) {
        this.nombre = nombre;
        this.vigencia = vigencia;
        this.clsAreas = []
    };

    //Todo esta clase se deriva a una cadena tipo Json
    convertToJSON() {
        const cache = [];
        return JSON.stringify(this, (key, value) => {
            if (typeof value === 'object' && value !== null) {
                if (cache.includes(value)) return;
                cache.push(value);
            }
            return value;
        });
    }

    //Inicia la transformación del objeto firebase en un objeto para la clase proyecto
    static loadAsInstance(objProyecto) {

        //Crea una nueva clase proyecto
        const proyecto = new clsProyecto(objProyecto.nombre, objProyecto.vigencia);
        //Lo carga en uan variable global
        GLOBAL.state.proyecto = proyecto;
        //Identifica el marcador único ID
        proyecto.id = objProyecto.id;
        //Todo lo devuelve como un objeto clase ay configurado
        return proyecto;
    }

    //Función interna de esta clase para guardar la info dentro de esta clase activa
    GuardarProyecto() {
        const id = GLOBAL.firestore.updateProyecto(
            JSON.parse(ActiveProyect.convertToJSON()))
    }

    BorrarProyecto() {
        //Ejecuro la función global en dataconfig.js
        GLOBAL.firestore.borrarProyecto(this.id);
        document.getElementById("contenedor-vigencia").hidden = true
    }

    makerHtml() {
        //Contendor visual de toda la vigencia, se limpia 
        const contenedor = document.getElementById("ContenedorControls")
        contenedor.innerHTML = ""



        //Con la función utils.js/html.inputControl creo un nuevo control de entrada
        const cNombre = HTML.inputContol(this, "inVigenciaNombre", "Nombre vigencia")
        contenedor.appendChild(cNombre)
        //Configuramos el control de entrada para que se actualice, con un metodo onclick
        const intNombre = document.getElementById("inVigenciaNombre")
        intNombre.addEventListener('input', () => this.nombre = intNombre.value);
        intNombre.value = this.nombre;

        const cVigencia = HTML.inputContol(this, "inVigenciaVigencia", "Vigencia")
        contenedor.appendChild(cVigencia)
        //Configuramos el control de entrada para que se actualice, con un metodo onclick
        const intVigencia = document.getElementById("inVigenciaVigencia")
        intVigencia.addEventListener('input', () => this.vigencia = intVigencia.value);
        intVigencia.value = this.vigencia;



    }

}

//Función externa para crear un proyecto
async function CrearProyecto() {
    //Verifia que el usuario está dentro de la lista de administrador/
    //Si lo está le da funciones abiertas de crear o borrar
    let filteredUsers = aUsers.filter(user => user.usuario == activeEmail);
    if (filteredUsers.length == 0) {
        mensajes("Usted no tiene permisos de administrador", "orange")
    } else {
        mensajes("Usuario administrador", "blue")

        try {
            const Proyecto = new clsProyecto('Nueva vigencia', '0000');
            //Luego agregamos esta clase y la convertimos a una base de datos y la salvamos.
            const id = GLOBAL.firestore.addProyecto(
                JSON.parse(Proyecto.convertToJSON()))

            mensajes("Proyecto creado", "green")

        } catch (error) {
            mensajes("No ha iniciado sesión", "red")
            console.log(error)
        }

    }

}
async function cargarProyectos() {
    try {
        //Oculamos y mostramos los contendores principales
        document.getElementById("paneListlVigencias").hidden = false
        document.getElementById("contenedor-vigencia").hidden = true

        const proyectos = GLOBAL.state.proyectos;
        if (proyectos.length === 0) {
            mensajes("No hay vigencias creadas", "orange")
        } else {
            mensajes("Carga de vigencias completada", "green")
            //=========================================================================
            //=========Creador de listas de vigencias==================================
            //Identifica el contenedor en la pagina index-app, y lo limpia
            const Contenedor = document.getElementById("paneListlVigencias");
            Contenedor.innerHTML = ""
            proyectos.forEach(vigencia => {
                const newItem = document.createElement("a")
                newItem.innerHTML = `
                <a href="#" class="nav-link rounded-2">
                    <li class="list-group-item list-group-org bg-org">${vigencia.nombre} (${vigencia.vigencia})</li>
                </a>
                `
                newItem.onclick = () => showVigencia(vigencia)
                Contenedor.appendChild(newItem)
            });



        }
    } catch (error) {
        console.log(error)
    }

}

async function showVigencia(vigencia) {
    document.getElementById("paneListlVigencias").hidden = true
    document.getElementById("contenedor-vigencia").hidden = false
    //document.getElementById("PanelDel").hidden = true
    mensajes("Vigencia abierta: " + vigencia.nombre, "green")
    ActiveProyect = clsProyecto.loadAsInstance(vigencia);
    ActiveProyect.makerHtml()
}
async function GuardarVigencia() {
    try {
        ActiveProyect.GuardarProyecto();
        mensajes("La información ha sido guardada", "green")
    } catch (error) {
        mensajes("Se ha presentadoun problema: " + error.code, "red")
    }
}

async function BorrarVigencia() {
  
    let filteredUsers = aUsers.filter(user => user.usuario == activeEmail);
    if (filteredUsers.length == 0) {
        mensajes("Usted no tiene permisos de administrador", "orange")
    } else {
        mensajes("Usuario administrador", "blue")
        document.getElementById("PanelDel").hidden=false
    }



    
}
async function BorrarVigenciaFinal(){
      ActiveProyect.BorrarProyecto();
      mensajes("La vigencia ha sido eliminada","blue")
      document.getElementById("PanelDel").hidden="true"

}

