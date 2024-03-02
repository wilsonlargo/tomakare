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
        //Esta acción carga las actividades que están en firebase y la sube convierte en 
        //un objeto que llena la lista de areas 
        const loadActividades = (clsAreas, parent) => {
            return clsAreas.map(Areas => {
                const areaObj = new Area(Areas.nombre, Areas.detalle, Areas.administrador, parent);
                return areaObj;
            })
        }

        //Crea una nueva clase proyecto
        const proyecto = new clsProyecto(objProyecto.nombre, objProyecto.vigencia);
        //Lo carga en uan variable global
        GLOBAL.state.proyecto = proyecto;
        //Identifica el marcador único ID
        proyecto.id = objProyecto.id;

        proyecto.clsAreas = loadActividades(objProyecto.clsAreas, proyecto);
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

    //Funciones internas para crear áreas
    addArea(Area) {
        this.clsAreas.push(Area);
    }
    deleteArea(id) {
        this.clsAreas.splice(id, 1);
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


        //Evidencia cuantas areas hay en el proyecto y las muestra
        const cTarjetas = document.getElementById("contenedor-tarjetas")
        let i = 0;
        cTarjetas.innerHTML = ''
        this.clsAreas.forEach(area => {

            area.id = i++
            area.makerHtmlCards();
            cTarjetas.appendChild(area.component);
        });



    }

}

//Clase que contiene la configuración de cada área/consejería de la vigencia
class Area {
    //constructor(nombre, detalle, administrador, parent) // aquí una version previa con parent, para ahcer las consultas
    //en restropectiva con el objeto parent
    constructor(nombre, detalle, administrador, id) {
        this.nombre = nombre;
        this.detalle = detalle;
        this.administrador = administrador;
        this.mandatos = [];
        this.id = id
        //this.parent=parent
    }

    makerHtmlCards() {
        //Este es el contenedor general del área
        const component = document.createElement('div')
        //Crea un control tarjeta con botones
        const cCards = HTML.cardAreas(this.nombre, this.detalle,
            //Esta función incrustada asigna el comando al boton borrar área
            () => {
                ActiveProyect.deleteArea(this.id)
                ActiveProyect.GuardarProyecto()
                showVigencia(ActiveProyect)
            },
            //Esta función incrustada asigna el comando al boton ver
            () => {
                document.getElementById('contenedor-area').hidden = false
                document.getElementById("contenedor-vigencia").hidden = true
                document.getElementById('contenedor-tarjetas').innerHTML = ''
                document.getElementById("contenedor-bar-areas").hidden = false
                const bRetorno = document.getElementById("btRetornarArea")
                bRetorno.onclick = () => showVigencia(ActiveProyect)

                this.makerHtmlArea()
            })
        component.appendChild(cCards)

        this.component = component;
    }

    makerHtmlArea() {

        document.getElementById("contenedor-area").innerHTML = ''

        //Creamos ahora los input, información del área
        const nombreArea = HTML.inputContol(this, this.id + "nombreArea", "Nombre del área")
        document.getElementById("contenedor-area").appendChild(nombreArea)
        //Configuramos el control de entrada para que se actualice, con un metodo oninput
        const intNomArea = document.getElementById(this.id + "nombreArea")
        intNomArea.addEventListener('input', () => this.nombre = intNomArea.value);
        intNomArea.value = this.nombre;

        //Creamos ahora los input, información del área
        const detalleArea = HTML.inputTextArea(this, this.id + "detalleArea", "Descripción del área")
        document.getElementById("contenedor-area").appendChild(detalleArea)
        //Configuramos el control de entrada para que se actualice, con un metodo oninput
        const intDetArea = document.getElementById(this.id + "detalleArea")
        intDetArea.addEventListener('input', () => this.detalle = intDetArea.value);
        intDetArea.value = this.detalle;





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
        document.getElementById("contenedor-tarjetas").hidden = true
        document.getElementById("contenedor-area").hidden = true
        document.getElementById("contenedor-bar-areas").hidden = true

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
                    <li class="list-group-item list-group bg-primary text-white">${vigencia.nombre} (${vigencia.vigencia})</li>
                </a>
                `
                newItem.onclick = () => showVigencia(vigencia)
                Contenedor.appendChild(newItem)
            });



        }
    } catch (error) {
        console.log(error)
    }


    let filteredUsers = aUsers.filter(user => user.usuario == activeEmail);
    if (filteredUsers.length == 0) {
        mensajes("Usuario visitante", "orange")
        readOnlyControls(true)
    } else {
        mensajes("Usuario administrador", "blue")
        readOnlyControls(false)
    }

}

async function showVigencia(vigencia) {
    document.getElementById("paneListlVigencias").hidden = true
    document.getElementById("contenedor-vigencia").hidden = false
    document.getElementById("contenedor-tarjetas").hidden = true
    document.getElementById("contenedor-area").hidden = true
    document.getElementById("contenedor-bar-areas").hidden = true


    mensajes("Vigencia abierta: " + vigencia.nombre, "green")
    ActiveProyect = clsProyecto.loadAsInstance(vigencia);
    ActiveProyect.makerHtml()
}
async function GuardarVigencia() {
    try {
        ActiveProyect.GuardarProyecto();
        //mensajes("La información ha sido guardada", "green")
    } catch (error) {
        mensajes("Se ha presentadoun problema: " + error.code, "red")
    }
}


function readOnlyControls(estado) {
    document.getElementById("conteneder-bar-proyectos").hidden = estado

}


async function BorrarVigencia() {

    let filteredUsers = aUsers.filter(user => user.usuario == activeEmail);
    if (filteredUsers.length == 0) {
        mensajes("Usted no tiene permisos de administrador", "orange")
    } else {
        mensajes("Usuario administrador", "blue")
        document.getElementById("PanelDel").hidden = false
    }




}
async function BorrarVigenciaFinal() {
    ActiveProyect.BorrarProyecto();
    mensajes("La vigencia ha sido eliminada", "blue")
    document.getElementById("PanelDel").hidden = "true"

}

//Esta función cita la función interna de proyecto para crear una nueva área
async function AgregarArea() {
    ActiveProyect.addArea(new Area("Nueva área", "Descripción del área", "Administrador"))
    GuardarVigencia()

    //Evidencia cuantas areas hay en el proyecto y las muestra
    const cTarjetas = document.getElementById("contenedor-tarjetas")
    cTarjetas.innerHTML = ''
    ActiveProyect.clsAreas.forEach(area => {
        area.makerHtml();
        cTarjetas.appendChild(area.component);
    });

    mensajes("Elemento creado", "Green")
}

