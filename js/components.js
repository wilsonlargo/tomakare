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
        const loadAreas = (fromClsAreas) => {
            return fromClsAreas.map(Areas => {
                const areaNew = new Area(Areas.nombre, Areas.detalle, Areas.administrador, Areas.funciones);
                areaNew.cslMandatos = loadMandatos(Areas.cslMandatos);
                areaNew.cslLineas = loadLineas(Areas.cslLineas);

                return areaNew;
            })
        }

        const loadMandatos = (fromClsMandatos) => {
            return fromClsMandatos.map(mandato => {
                const mandatoNew = new Mandato(mandato.nombre);
                return mandatoNew;
            });
        }

        const loadLineas = (fromClsLineas) => {
            return fromClsLineas.map(linea => {
                const lineaNew = new Linea(linea.nombre, linea.descripcion, linea.id, linea.parent);
                lineaNew.clsPrograma = loadProgramas(linea.clsPrograma, lineaNew);
                return lineaNew;
            });
        }

        const loadProgramas = (fromClsProgramas, lineaNew) => {
            return fromClsProgramas.map(programa => {
                const ProgramaNew = new Programa(programa.nombre, programa.descripcion, programa.id, lineaNew);
                ProgramaNew.clsGestion = loadGestion(programa.clsGestion, ProgramaNew)
                return ProgramaNew;
            });
        }

        const loadGestion = (fromClsGestiones, ProgramaNew) => {
            return fromClsGestiones.map(gestion => {
                const GestionNew = new Gestion(
                    gestion.nombre,
                    gestion.ogeneral,
                    gestion.manager,
                    gestion.financiado,
                    gestion.fuente,
                    gestion.valor,

                    gestion.id,
                    ProgramaNew);
                return GestionNew;
            });
        }




        //Crea una nueva clase proyecto
        const proyecto = new clsProyecto(objProyecto.nombre, objProyecto.vigencia);
        //Lo carga en uan variable global
        GLOBAL.state.proyecto = proyecto;
        //Identifica el marcador único ID
        proyecto.id = objProyecto.id;
        proyecto.clsAreas = loadAreas(objProyecto.clsAreas);
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
        const contenedor = document.getElementById("panel-escritorio")
        contenedor.innerHTML = ""

        //Con la función utils.js/html.inputControl creo un nuevo control de entrada
        const cNombre = HTML.inputContol(this, "inVigenciaNombre", "Nombre vigencia")
        contenedor.appendChild(cNombre)
        //Configuramos el control de entrada para que se actualice, con un metodo onclick
        const intNombre = document.getElementById("inVigenciaNombre")
        intNombre.addEventListener('input', () => 
        {
            this.nombre = intNombre.value
            GuardarVigencia()
        });
        intNombre.value = this.nombre;

        const cVigencia = HTML.inputContol(this, "inVigenciaVigencia", "Vigencia")
        contenedor.appendChild(cVigencia)
        //Configuramos el control de entrada para que se actualice, con un metodo onclick
        const intVigencia = document.getElementById("inVigenciaVigencia")
        intVigencia.addEventListener('input', () => {
            this.vigencia = intVigencia.value
            document.getElementById("btnVig" + this.id).textContent=this.vigencia
            GuardarVigencia()
        });
        intVigencia.value = this.vigencia;

        

        //Evidencia cuantas areas hay en el proyecto y las muestra
        const cAreas = document.getElementById("panel-areas")
        let i = 0;
        cAreas.innerHTML = ''
        this.clsAreas.forEach(area => {
            area.id = i++
            area.makerHtmlAreasItem();
            cAreas.appendChild(area.component);
        });
    }

}

//Clase que contiene la configuración de cada área/consejería de la vigencia
class Area {
    //constructor(nombre, detalle, administrador, parent) // aquí una version previa con parent, para ahcer las consultas
    //en restropectiva con el objeto parent
    constructor(nombre, detalle, administrador, funciones, id) {
        this.nombre = nombre;
        this.detalle = detalle;
        this.administrador = administrador;
        this.funciones = funciones;
        this.id = id
        this.cslMandatos = [];
        this.cslLineas = [];

        //this.parent=parent
    }

    addMandato(Mandato) {
        this.cslMandatos.push(Mandato);
    }
    deleteMandato(id) {
        this.cslMandatos.splice(id, 1);
    }

    addLinea(Linea) {
        this.cslLineas.push(Linea);
    }
    deleteLinea(id) {
        this.cslLineas.splice(id, 1);
    }



    makerHtmlAreasItem() {
        //Este es el contenedor general del área
        const component = document.createElement('button')
        component.className = "btn btn-outline-secondary w-100 mt-1"
        component.textContent = this.nombre

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

        //Input administrador de área
        const adminArea = HTML.inputContol(this, this.id + "adminArea", "Administrador del área / consejería")
        document.getElementById("contenedor-area").appendChild(adminArea)
        //Configuramos el control de entrada para que se actualice, con un metodo oninput
        const intAdminArea = document.getElementById(this.id + "adminArea")
        intAdminArea.addEventListener('input', () => this.administrador = intAdminArea.value);
        intAdminArea.value = this.administrador;

        //Creamos ahora los input, información del área
        const detalleArea = HTML.inputTextArea(this.id + "detalleArea", "Descripción del área")
        document.getElementById("contenedor-area").appendChild(detalleArea)
        //Configuramos el control de entrada para que se actualice, con un metodo oninput
        const intDetArea = document.getElementById(this.id + "detalleArea")
        intDetArea.addEventListener('input', () => this.detalle = intDetArea.value);
        intDetArea.value = this.detalle;

        //Input funciones
        const funcionesArea = HTML.inputTextArea(this.id + "funcionesArea", "Funciones del área/consejería")
        document.getElementById("contenedor-area").appendChild(funcionesArea)
        //Configuramos el control de entrada para que se actualice, con un metodo oninput
        const intFuntionsArea = document.getElementById(this.id + "funcionesArea")
        intFuntionsArea.addEventListener('input', () => this.funciones = intFuntionsArea.value);
        intFuntionsArea.value = this.funciones;

        //Agrega un comando al boton que agrega mandatos
        //con esto identifica en que área está y agrega un indice
        const btnAgregarMandato = document.getElementById("btAgregarMandato")
        btnAgregarMandato.onclick = () => {
            AgregarMandato(this.id)
        }

        //Agrega un comando al boton que agrega lineas
        //con esto identifica en que área está y agrega un indice
        const btAgregarLinea = document.getElementById("btAgregarLinea")
        btAgregarLinea.onclick = () => {
            AgregarLinea(this)
        }

        this.reloadComandos()
    }

    reloadComandos() {

        const cMandatos = document.getElementById("contenedor-mandatos")
        cMandatos.innerHTML = ''
        let i = 0;

        this.cslMandatos.forEach(mandato => {
            mandato.id = i++
            mandato.parentId = this.id
            mandato.makerHtmlMandato(cMandatos);
            cMandatos.appendChild(mandato.component);
            mandato.makerComandos()
        })

        const cLineas = document.getElementById("contenedor-lineas")
        cLineas.innerHTML = ''
        let l = 0;

        this.cslLineas.forEach(linea => {
            const btOpen = document.createElement('a')
            btOpen.innerHTML = `  
            <a class="btn btn-primary h4" data-bs-toggle="collapse"
            id="${l}btnOpeLinea"  
            href="#${l}collapseLine" 
            role="button" 
            aria-expanded="false" 
            aria-controls="${l}collapseLine">(${l + 1}) ${linea.nombre}</a>`
            cLineas.appendChild(btOpen);

            linea.id = l++
            linea.parentId = this.id
            linea.makerHtmlLinea(cLineas);
            cLineas.appendChild(linea.component);
            linea.makerComandos()
        })


    }
}

class Mandato {
    constructor(nombre, id, parentId) {
        this.nombre = nombre;
        this.id = id
        this.parentId = parentId
    }
    makerHtmlMandato() {
        //document.getElementById("contenedor-area").innerHTML = ''
        const component = HTML.inputSpan(this.id, this.nombre)
        this.component = component;
    }
    makerComandos() {
        //Configuramos el control de entrada para que se actualice, con un metodo oninput
        const refInputMandato = document.getElementById(this.id + "InputMandato")
        refInputMandato.addEventListener('input', () => this.nombre = refInputMandato.value);
        refInputMandato.value = this.nombre;

        const refBtnBorrarMandato = document.getElementById(this.id + "btnBorrarMandato")
        refBtnBorrarMandato.addEventListener('click', () => {
            ActiveProyect.clsAreas[this.parentId].deleteMandato(this.id)
            //Recarga los mandatos
            const AreaActiva = ActiveProyect.clsAreas[this.parentId]
            const cMandatos = document.getElementById("contenedor-mandatos")
            cMandatos.innerHTML = ''
            let i = 0;
            AreaActiva.cslMandatos.forEach(mandato => {
                mandato.id = i++
                mandato.makerHtmlMandato();
                cMandatos.appendChild(mandato.component);

            })
            GuardarVigencia()
        });


    }
}

class Linea {
    constructor(nombre, descripcion, id, parent) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.id = id;
        this.parent = parent;
        this.clsPrograma = []
    }

    addPrograma(Programa) {
        this.clsPrograma.push(Programa);
    }
    deletePrograma(id) {
        this.clsPrograma.splice(id, 1);
    }


    makerHtmlLinea() {
        //Creamso un contenedor de entrada texto para la info de la línea

        const component = document.createElement('div')
        component.className = "collapse mb-4"
        component.id = this.id + 'collapseLine'

        const inputSpan = HTML.inputSpan2(this.id, this.nombre, 'InputLinea')
        const inputText = HTML.inputTextArea2(this.id, "Descripción de la línea", 'InputTextLinea')

        const btnAddPrograma = document.createElement('button');
        btnAddPrograma.className = "btn text-primary"
        btnAddPrograma.innerHTML = `<i class="bi bi-file-plus me-2"></i>Agregar programa`

        const contenedor_programas = document.createElement('div')
        contenedor_programas.className = "ms-3"
        contenedor_programas.id = this.id + 'contenedor-programas'
        contenedor_programas.innerHTML = ""

        //Creamos un boton para agregar gestiones
        const hrProgramas = document.createElement('hr')
        hrProgramas.className = 'fw-bold'
        hrProgramas.textContent = "Programas"


        component.appendChild(inputSpan)
        component.appendChild(inputText)
        component.appendChild(btnAddPrograma)
        component.appendChild(hrProgramas)


        //Evocamos la clase programa y contamos cuantos hay
        let i = 0;
        this.clsPrograma.forEach(programa => {
            const btOpen = document.createElement('a')
            btOpen.innerHTML = `  
                <a class="btn btn-secondary h4" data-bs-toggle="collapse"
                id="${this.id}${i}btnOpenProgram"  
                href="#${this.id}${i}collapseProgram" 
                role="button" 
                aria-expanded="false" 
                aria-controls="${this.id}${i}collapseProgram">${this.id + 1}.${i + 1}. ${programa.nombre}</a>`

            contenedor_programas.appendChild(btOpen)

            programa.id = i++
            programa.makerHTMLPrograma()
            contenedor_programas.appendChild(programa.component)
        })
        //Este botón crea un nuevo programa y lo agrega al contenedor tipo acordeón

        btnAddPrograma.onclick = () => {
            const numNew = this.clsPrograma.length
            const programa = new Programa('Nuevo programa', 'Descripción del programa', numNew, this);
            this.addPrograma(programa)
            const btOpen = document.createElement('a')
            btOpen.innerHTML = `  
                <a class="btn btn-secondary h4" data-bs-toggle="collapse"
                id="${this.id}${numNew}btnOpenProgram" 
                href="#${this.id}${numNew}collapseProgram" 
                role="button" 
                aria-expanded="false" 
                aria-controls="${this.id}${numNew}collapseProgram">${this.id + 1}.${numNew + 1}. ${programa.nombre}</a>`

            contenedor_programas.appendChild(btOpen)

            programa.id = numNew
            programa.makerHTMLPrograma()
            contenedor_programas.appendChild(programa.component)
            GuardarVigencia()
        }
        component.appendChild(contenedor_programas)

        this.component = component;
    }
    makerComandos() {
        //Configuramos el control de entrada para que se actualice, con un metodo oninput
        const refInputLinea = document.getElementById(this.id + "InputLinea")
        refInputLinea.addEventListener('input', () => {

            this.nombre = refInputLinea.value
            const controlOpen = document.getElementById(`${this.id}btnOpeLinea`)
            controlOpen.textContent = `(${this.id + 1}) ${this.nombre}`
        });
        refInputLinea.value = this.nombre;
        const refDescripLinea = document.getElementById(this.id + "InputTextLinea")
        refDescripLinea.addEventListener('input', () => this.descripcion = refDescripLinea.value);
        refDescripLinea.value = this.descripcion;


        const refBtnBorrarLinea = document.getElementById(this.id + "btnBorrarLinea")
        refBtnBorrarLinea.addEventListener('click', () => {
            ActiveProyect.clsAreas[this.parentId].deleteLinea(this.id)
            //Recarga los mandatos
            const AreaActiva = ActiveProyect.clsAreas[this.parentId]
            const cLineas = document.getElementById("contenedor-lineas")
            cLineas.innerHTML = ''
            let i = 0;
            AreaActiva.cslLineas.forEach(linea => {
                const btOpen = document.createElement('a')
                btOpen.innerHTML = `  
                <a class="btn btn-primary h4" data-bs-toggle="collapse" 
                href="#${i}collapseLine" 
                role="button" 
                aria-expanded="false" 
                aria-controls="${i}collapseLine">(${i + 1}) ${linea.nombre}</a>`
                cLineas.appendChild(btOpen);

                linea.id = i++
                linea.makerHtmlLinea();
                cLineas.appendChild(linea.component);
                linea.makerComandos()
            })
            GuardarVigencia()
        });

    }
}
class Programa {
    constructor(nombre, descripcion, id, parentId) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.id = id;
        this.parentId = parentId;
        this.clsGestion = [];
    }

    addGestion(Gestion) {
        this.clsGestion.push(Gestion);
    }
    deleteGestion(id) {
        this.clsGestion.splice(id, 1);
    }


    makerHTMLPrograma() {
        const component = document.createElement('div')
        component.className = "collapse mb-4"
        component.id = `${this.parentId.id}${this.id}collapseProgram`

        const inputSpan = HTML.inputSpan3(this.id, this.parentId.id, this.nombre, `Programa`)
        inputSpan.addEventListener('input', () => {
            const control = document.getElementById(`${this.parentId.id}${this.id}InputPrograma`)
            this.nombre = control.value
            const controldel = document.getElementById(`${this.parentId.id}${this.id}btnOpenProgram`)
            controldel.textContent = `${this.parentId.id + 1}.${this.id + 1}. ${this.nombre}`
        })

        inputSpan.addEventListener('click', () => {

            const refBtnBorrarPrograma = document.getElementById(`${this.parentId.id}${this.id}btnBorrarPrograma`)
            try {
                refBtnBorrarPrograma.addEventListener('click', () => {
                    //Recarga los controles
                    this.parentId.deletePrograma(this.id)
                    this.component.remove()
                    const controldel = document.getElementById(`${this.parentId.id}${this.id}btnOpenProgram`)
                    controldel.remove()
                    GuardarVigencia()
                });
            } catch (error) {

            }

        })

        const inputText = HTML.inputTextArea3(this.id, this.parentId.id, 'Descripción programa', `Programa`, this.descripcion)
        inputText.addEventListener('input', () => {
            const refDescripPrograma = document.getElementById(`${this.parentId.id}${this.id}inputTextPrograma`)
            refDescripPrograma.addEventListener('input', () => this.descripcion = refDescripPrograma.value);
        })

        //Creamos un boton para agregar gestiones
        const hrGestion = document.createElement('hr')
        hrGestion.textContent = "Proyectos"

        const btnGestion = document.createElement('a')
        btnGestion.className = 'btn text-primary'
        btnGestion.innerHTML = `<i class="bi bi-file-plus me-2"></i>Agregar proyecto`

        btnGestion.onclick = () => {
            const gestion = new Gestion('Nueva proyección', 'Objetivo general', 'Administrador', this.clsGestion.length, this)

            gestion.id = this.clsGestion.length
            gestion.makerHTMLProyeccion()
            divGestion.appendChild(gestion.component)
            this.addGestion(gestion)
            GuardarVigencia()
        }

        component.appendChild(inputSpan)
        component.appendChild(inputText)
        component.appendChild(hrGestion)
        component.appendChild(btnGestion)
        component.appendChild(hrGestion)

        //Creamos un contededor de los proyectos
        const divGestion = document.createElement('div')
        divGestion.className = 'ms-3'
        divGestion.id = `${this.parentId.id}${this.id}contendedor-proyecciones`
        component.appendChild(divGestion)

        //Cargar las proyecciones
        let g = 0;
        this.clsGestion.forEach(gestion => {
            gestion.id = g++
            gestion.makerHTMLProyeccion()
            divGestion.appendChild(gestion.component)

        })

        this.component = component
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
            GuardarVigencia()
            

        } catch (error) {
            mensajes("No ha iniciado sesión", "red")
            console.log(error)
        }
        cargarProyectos()
    }

}
async function cargarProyectos() {
    try {


        const proyectos = GLOBAL.state.proyectos;
        if (proyectos.length === 0) {
            mensajes("No hay vigencias creadas", "orange")
        } else {
            //=========================================================================
            //=========Creador de listas de vigencias==================================
            //Identifica el contenedor en la pagina index-app, y lo limpia
            const Contenedor = document.getElementById("panel-vigencias");
            Contenedor.innerHTML = ""
            proyectos.forEach(vigencia => {

                const component = document.createElement('button')
                component.className = "btn btn-outline-secondary w-100 mt-1"
                component.textContent = vigencia.vigencia
                component.id = "btnVig" + vigencia.id
                component.onclick = () => showVigencia(vigencia)
                Contenedor.appendChild(component)
               
                
            });

        }
    } catch (error) {
        console.log(error)
    }



}

async function showVigencia(vigencia) {
    ActiveProyect = clsProyecto.loadAsInstance(vigencia);
    ActiveProyect.makerHtml()
    document.getElementById("conteneder-bar-proyectos").hidden=false
    document.getElementById("panel-inicio").hidden=true

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
    //document.getElementById("conteneder-bar-proyectos").hidden = estado
}


async function BorrarVigencia() {

    let filteredUsers = aUsers.filter(user => user.usuario == activeEmail);
    if (filteredUsers.length == 0) {
        mensajes("Usted no tiene permisos de administrador", "orange")
    } else {
        modal.modalDelete(
            () => {
                //Esta función encrustada borra una vigencia
                ActiveProyect.BorrarProyecto();
                mensajes("La vigencia ha sido eliminada", "blue")       
            }
        )
    }
    GuardarVigencia()
    cargarProyectos()
}

//Esta función cita la función interna de proyecto para crear una nueva área
async function AgregarArea() {
    ActiveProyect.addArea(new Area("Nombre área", "Descripción del área", "Administrador", "Funciones"))
    GuardarVigencia()

    //Evidencia cuantas areas hay en el proyecto y las muestra
    const cTarjetas = document.getElementById("contenedor-tarjetas")
    cTarjetas.className = "d-flex flex-wrap m-3"
    cTarjetas.innerHTML = ''
    ActiveProyect.clsAreas.forEach(area => {
        area.makerHtmlCards()
        cTarjetas.appendChild(area.component);
    });
    mensajes("Elemento creado", "Green")
}
async function AgregarMandato(parentId) {
    const AreaActiva = ActiveProyect.clsAreas[parentId]
    //Se agrega uan neuva clase mandato, ojo- se marca indice del elemento y el indice del padre, apra mirar los
    //elementos anidados
    const mandato = new Mandato('Nuevo mandato', 0, parentId);
    AreaActiva.addMandato(mandato)

    const cMandatos = document.getElementById("contenedor-mandatos")
    cMandatos.innerHTML = ''
    let i = 0;
    AreaActiva.cslMandatos.forEach(mandato => {
        mandato.id = i++
        mandato.makerHtmlMandato();
        cMandatos.appendChild(mandato.component);
        mandato.makerComandos()

    })
    GuardarVigencia()
    mensajes("Se creó un mandato", "green")
}

async function AgregarLinea(parent) {
    //Identificamos en que área estamos pos su id
    const AreaActiva = parent
    console.log(AreaActiva)

    //Creamos un anueva línea de acción dentro de la clase Area
    const linea = new Linea('Nueva linea', 'Descripción de la línea', 0, parent);
    AreaActiva.addLinea(linea)

    const cLineas = document.getElementById("contenedor-lineas")
    cLineas.innerHTML = '';

    let i = 0;
    AreaActiva.cslLineas.forEach(linea => {

        const btOpen = document.createElement('a')
        btOpen.innerHTML = `  
        <a class="btn btn-primary h4" data-bs-toggle="collapse" 
        href="#${i}collapseLine" 
        role="button" 
        aria-expanded="false" 
        aria-controls="${i}collapseLine">(${i + 1}) ${linea.nombre}</a>`
        cLineas.appendChild(btOpen);

        linea.id = i++
        linea.makerHtmlLinea();
        cLineas.appendChild(linea.component);
        linea.makerComandos()

    })
    GuardarVigencia()
    mensajes("Se creó una nueva línea", "green")
}

function mostrar_escritorio(){
    document.getElementById("conteneder-bar-proyectos").hidden=true
    document.getElementById("panel-inicio").hidden=false
    document.getElementById("panel-escritorio").innerHTML=""

}

