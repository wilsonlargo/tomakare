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
    }

    //Funciones internas para crear áreas
    addArea(Area) {
        this.clsAreas.push(Area);
    }
    deleteArea(id) {
        this.clsAreas.splice(id, 1);
        GuardarVigencia()
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
        intNombre.addEventListener('input', () => {
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
            document.getElementById("btnVig" + this.id).textContent = this.vigencia
            GuardarVigencia()
        });
        intVigencia.value = this.vigencia;








        //Evidencia cuantas areas hay en el proyecto y las muestra
        const cAreas = document.getElementById("panel-areas")

        let i = 0;
        cAreas.innerHTML = ''
        this.clsAreas.forEach(area => {

            area.id = i++
            //Este es el contenedor general del área
            const component = document.createElement('li')
            component.className = "w-100 border-bottom border-4"
            component.innerHTML = `
                <a href="#" class="nav-link px-0 text-white" id="${"btnArea" + area.id}">
                     ${area.id + 1}.
                    <span class="d-none d-sm-inline text-white" id="${"btnArealabel" + area.id}">
                        ${area.nombre}
                    </span>
            
                 </a>  
                `
            document.getElementById("panel-areas").appendChild(component)


            component.onclick = () => {

                area.makerHtmlAreasItem();

            }

        });

        //Lector de elementos para contadores
        let contadorLineas = 0
        let contadorPrograma = 0
        this.clsAreas.forEach(area => {
            contadorLineas = contadorLineas + area.cslLineas.length
            area.cslLineas.forEach(linea =>{
                contadorPrograma= contadorPrograma + linea.clsPrograma.length


            })
        });




        const ContContadores = document.createElement("div")
        ContContadores.className = "row"

        //Agregar contadores por vigencia
        const ContConsejerias = document.createElement("div")
        ContConsejerias.className = "col-sm-12 col-md-6 col-lg-4 col-xl-2 border border-1 m-2"
        ContConsejerias.innerHTML = `
                 <p class="text-secondary tex-org-big-gris">${this.clsAreas.length}</p>
                    <p class="bg-success text-white p-2 text-center text-foot-foto">CONSEJERÍAS
                </p>
                `
        ContContadores.appendChild(ContConsejerias)

        //Agregar contadores por vigencia
        const ContLineas = document.createElement("div")
        ContLineas.className = "col-sm-12 col-md-6 col-lg-4 col-xl-2 border border-1 m-2"
        ContLineas.innerHTML = `
                         <p class="text-secondary tex-org-big-gris">${contadorLineas}</p>
                            <p class="bg-success text-white p-2 text-center text-foot-foto">LÍNEAS
                        </p>
                        `
        ContContadores.appendChild(ContLineas)

        //Agregar contadores por vigencia
        const ContProgramas = document.createElement("div")
        ContProgramas.className = "col-sm-12 col-md-6 col-lg-4 col-xl-2 border border-1 m-2"
        ContProgramas.innerHTML = `
                                 <p class="text-secondary tex-org-big-gris">${contadorPrograma}</p>
                                    <p class="bg-success text-white p-2 text-center text-foot-foto">PROGRAMAS
                                </p>
                                `
        ContContadores.appendChild(ContProgramas)





        contenedor.appendChild(ContContadores)


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

        document.getElementById("conteneder-bar-proyectos").hidden = true
        document.getElementById("panel-inicio").hidden = true
        const cEscritorio = document.getElementById("panel-escritorio")
        cEscritorio.innerHTML = ''

        //Colocamos el t+itulo de la consejería
        const Título = document.createElement('div');
        Título.className = "mb-5 fs-3 fw-bold text-secondary border-bottom border-4 border-success"
        Título.textContent = this.nombre

        cEscritorio.appendChild(Título)



        //Creamos ahora los input, información del área
        const nombreArea = HTML.inputContol(this, this.id + "nombreArea", "Nombre del área")
        document.getElementById("panel-escritorio").appendChild(nombreArea)
        //Configuramos el control de entrada para que se actualice, con un metodo oninput
        const intNomArea = document.getElementById(this.id + "nombreArea")
        intNomArea.addEventListener('input', () => {
            this.nombre = intNomArea.value
            const btAreaLabel = document.getElementById("btnArealabel" + this.id)
            btAreaLabel.textContent = intNomArea.value
            Título.textContent = intNomArea.value
            GuardarVigencia()
        });
        intNomArea.value = this.nombre;

        //Input administrador de área
        const adminArea = HTML.inputContol(this, this.id + "adminArea", "Administrador del área / consejería")
        document.getElementById("panel-escritorio").appendChild(adminArea)
        //Configuramos el control de entrada para que se actualice, con un metodo oninput
        const intAdminArea = document.getElementById(this.id + "adminArea")
        intAdminArea.addEventListener('input', () => {
            this.administrador = intAdminArea.value
            GuardarVigencia()
        });
        intAdminArea.value = this.administrador;

        //Creamos ahora los input, información del área
        const detalleArea = HTML.inputTextArea(this.id + "detalleArea", "Descripción del área")
        document.getElementById("panel-escritorio").appendChild(detalleArea)
        //Configuramos el control de entrada para que se actualice, con un metodo oninput
        const intDetArea = document.getElementById(this.id + "detalleArea")
        intDetArea.addEventListener('input', () => {
            this.detalle = intDetArea.value
            GuardarVigencia()
        });
        intDetArea.value = this.detalle;


        //Input funciones
        const funcionesArea = HTML.inputTextArea(this.id + "funcionesArea", "Funciones del área/consejería")
        document.getElementById("panel-escritorio").appendChild(funcionesArea)
        //Configuramos el control de entrada para que se actualice, con un metodo oninput
        const intFuntionsArea = document.getElementById(this.id + "funcionesArea")
        intFuntionsArea.addEventListener('input', () => {
            this.funciones = intFuntionsArea.value
            GuardarVigencia()
        });
        intFuntionsArea.value = this.funciones;




        const collapseMandatos = document.createElement("div")
        collapseMandatos.innerHTML = `
            <a class="nav-link mb-3 fs-4 text-secondary border-bottom border-4" 
            data-bs-toggle="collapse" href="#collapseMandatos" 
            role="button" aria-expanded="false" 
            aria-controls="collapseMandatos">
                + Mandatos
            </a>
                <div class="collapse" id="collapseMandatos">
                <div id="divmandatosbutton">
                        
                </div>
                <div id="divmandatoscollapse">
                        
                </div>
                </div>
            `
        cEscritorio.appendChild(collapseMandatos)


        //con esto identifica en que área está y agrega un indice
        const btnAgregarMandato = document.createElement("button")
        btnAgregarMandato.className = "btn btn-outline-secondary m-2"
        btnAgregarMandato.innerHTML = `<i class="bi bi-plus"></i> Agregar mandato`


        btnAgregarMandato.onclick = () => {
            AgregarMandato(this.id)
        }


        document.getElementById("divmandatosbutton").appendChild(btnAgregarMandato)
        let i = 0;
        this.cslMandatos.forEach(mandato => {
            mandato.id = i++
            mandato.parentId = this.id
            mandato.makerHtmlMandato(document.getElementById("divmandatoscollapse"));
            document.getElementById("divmandatoscollapse").appendChild(mandato.component);
            mandato.makerComandos()
        })

        const collapseLineas = document.createElement("div")
        collapseLineas.innerHTML = `
            <a class="nav-link mb-2 fs-4 text-secondary border-bottom border-4" 
            data-bs-toggle="collapse" href="#collapseLineas" 
            role="button" aria-expanded="false" 
            aria-controls="collapseLineas">
                + Líneas de acción
            </a>
                <div class="collapse" id="collapseLineas">
                <div id="divLineasbutton">
                        
                </div>
                <div id="divLineascollapse" class="m-4 list-group m-3 w-50">
                    
                </div>
                </div>
            `

        cEscritorio.appendChild(collapseLineas)

        //Agrega un comando al boton que agrega lineas
        //con esto identifica en que área está y agrega un indice

        const btAgregarLinea = document.createElement("button")
        btAgregarLinea.className = "btn btn-outline-secondary m-1"
        btAgregarLinea.innerHTML = `<i class="bi bi-plus"></i> Agregar línea`

        btAgregarLinea.onclick = () => {
            AgregarLinea(this)
        }

        document.getElementById("divLineasbutton").appendChild(btAgregarLinea)

        //Identificamos en que área estamos pos su id
        const AreaActiva = parent

        const cLineas = document.getElementById("divLineascollapse")
        cLineas.innerHTML = '';

        let l = 0;
        this.cslLineas.forEach(linea => {
            linea.id = l++
            const btLinea = document.createElement('a')
            btLinea.className = "list-group-item list-group-item-action"
            btLinea.textContent = linea.id + 1 + " " + linea.nombre

            cLineas.appendChild(btLinea);

            btLinea.onclick = () => {
                linea.makerHTMLLineaPanel(this)
            }

        })




        //Agregamos un boton borrar consejería
        const btnBorrarArea = document.createElement("button")
        btnBorrarArea.className = "btn btn-outline-danger mt-5 m-1"

        btnBorrarArea.innerHTML = `<i class="bi bi-trash3"></i> Eliminar Área`

        btnBorrarArea.onclick = () => {
            ActiveProyect.deleteArea(this.id)
            GuardarVigencia()
            mostrar_escritorio()

            //Evidencia cuantas areas hay en el proyecto y las muestra
            const cAreas = document.getElementById("panel-areas")
            cAreas.innerHTML = ''
            ActiveProyect.clsAreas.forEach(area => {
                area.makerHtmlAreasItem()
                cAreas.appendChild(area.component);

            });
        }
        cEscritorio.appendChild(btnBorrarArea)



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
        refInputMandato.addEventListener('input', () => {
            this.nombre = refInputMandato.value
            GuardarVigencia()
        });
        refInputMandato.value = this.nombre;

        const refBtnBorrarMandato = document.getElementById(this.id + "btnBorrarMandato")
        refBtnBorrarMandato.addEventListener('click', () => {
            ActiveProyect.clsAreas[this.parentId].deleteMandato(this.id)
            //Recarga los mandatos
            const AreaActiva = ActiveProyect.clsAreas[this.parentId]
            const cMandatos = document.getElementById("divmandatoscollapse")
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


    makerHTMLLineaPanel(parent) {
        document.getElementById("conteneder-bar-proyectos").hidden = true
        const cEscritorio = document.getElementById("panel-escritorio")
        cEscritorio.innerHTML = ''

        //Colocamos el t+itulo de la consejería
        const Título = document.createElement('div');
        Título.className = "fs-3 fw-bold text-secondary"
        Título.textContent = parent.nombre
        cEscritorio.appendChild(Título)

        //Colocamos el t+itulo de la línea
        const Título2 = document.createElement('div');
        Título2.className = "ms-2 mb-5 fs-4 text-secondary border-bottom border-4 border-success"
        Título2.textContent = this.nombre

        cEscritorio.appendChild(Título2)

        const inputLineaNombre = document.createElement("form")
        inputLineaNombre.className = "form-floating mb-2"
        inputLineaNombre.innerHTML = `
            <input type="text" class="form-control" id="${this.id + "input-line-nombre"}" value="${this.nombre}">
            <label for="${this.id + "input-line-nombre"}">Nombre línea</label>
        `

        cEscritorio.appendChild(inputLineaNombre)

        //Configuramos el control de entrada para que se actualice, con un metodo oninput
        const refInputLinea = document.getElementById(this.id + "input-line-nombre")
        refInputLinea.addEventListener('input', () => {
            this.nombre = refInputLinea.value
            Título2.textContent = this.nombre
            GuardarVigencia()
        });
        refInputLinea.value = this.nombre;


        const inputText = HTML.inputTextArea2(this.id, "Descripción de la línea", 'InputTextLinea')
        cEscritorio.appendChild(inputText)

        const refDescripLinea = document.getElementById(this.id + "InputTextLinea")
        refDescripLinea.addEventListener('input', () => {
            this.descripcion = refDescripLinea.value
            GuardarVigencia()
        });
        refDescripLinea.value = this.descripcion;


        const Título4 = document.createElement('div');
        Título4.className = "fs-4 text-secondary border-bottom border-4"
        Título4.textContent = "Programas"
        cEscritorio.appendChild(Título4)

        //Agregar botton añadir programas
        const btAgregarPrograma = document.createElement("button")
        btAgregarPrograma.className = "btn btn-outline-secondary m-1"
        btAgregarPrograma.innerHTML = `<i class="bi bi-plus"></i> Agregar programa`

        btAgregarPrograma.onclick = () => {
            const numNew = this.clsPrograma.length
            const programa = new Programa('Nuevo programa', 'Descripción del programa', numNew, this);
            this.addPrograma(programa)
            GuardarVigencia()

            //Muestro de nuevo los programas
            const cProgramas = document.getElementById("lstProyectos")
            cProgramas.innerHTML = '';
            let p = 0;
            this.clsPrograma.forEach(programa => {
                programa.id = p++
                const btPrograma = document.createElement('a')
                btPrograma.className = "list-group-item list-group-item-action"
                btPrograma.textContent = programa.id + 1 + ". " + programa.nombre

                cProgramas.appendChild(btPrograma);

                btPrograma.onclick = () => {
                    programa.makerHTMLProgramaPanel(parent, this)
                }
            })
        }

        cEscritorio.appendChild(btAgregarPrograma)


        //Agregar listador de proyectos
        const listProyectos = document.createElement("div")
        listProyectos.className = "list-group m-3 w-50"
        listProyectos.id = "lstProyectos"
        cEscritorio.appendChild(listProyectos)


        document.getElementById("lstProyectos").innerHTML = ""




        //Verifica todos los programas que hay por linea y los agrega
        const cProgramas = document.getElementById("lstProyectos")
        cProgramas.innerHTML = '';

        let p = 0;
        this.clsPrograma.forEach(programa => {
            programa.id = p++
            const btPrograma = document.createElement('a')
            btPrograma.className = "list-group-item list-group-item-action"
            btPrograma.textContent = programa.id + 1 + ". " + programa.nombre

            cProgramas.appendChild(btPrograma);

            btPrograma.onclick = () => {
                programa.makerHTMLProgramaPanel(parent, this)
            }
        })


        //Agregamos un boton borrar línea
        const btnBorrarLinea = document.createElement("button")
        btnBorrarLinea.className = "btn btn-outline-danger mt-5 m-1"
        btnBorrarLinea.innerHTML = `<i class="bi bi-trash3"></i> Eliminar línea`

        btnBorrarLinea.onclick = () => {
            parent.deleteLinea(this.id)
            console.log(parent.cslLineas)
            GuardarVigencia()
            mostrar_escritorio()
        }
        cEscritorio.appendChild(btnBorrarLinea)

        //Agregamos un boton retornar
        const btnretroceder = document.createElement("button")
        btnretroceder.className = "btn btn-outline-secondary mt-5 m-1"
        btnretroceder.innerHTML = `<i class="bi bi-arrow-return-left"></i> Volver`

        btnretroceder.onclick = () => {
            parent.makerHtmlAreasItem()
        }
        cEscritorio.appendChild(btnretroceder)

    }


}
class Programa {
    constructor(nombre, descripcion, id, parent) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.id = id;
        this.parent = parent;
        this.clsGestion = [];
    }

    addGestion(Gestion) {
        this.clsGestion.push(Gestion);
    }
    deleteGestion(id) {
        this.clsGestion.splice(id, 1);
    }

    makerHTMLProgramaPanel(area, linea) {
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
        Título3.className = "ms-3 mb-5 fs-5 text-secondary border-bottom border-4 w-60 border-success"
        Título3.textContent = this.nombre

        cEscritorio.appendChild(Título3)

        //Control de entrada editable nombre del programa
        const inputProgramaNombre = document.createElement("form")
        inputProgramaNombre.className = "form-floating mb-2"
        inputProgramaNombre.innerHTML = `
            <input type="text" class="form-control" id="${this.id + "input-programa-nombre"}" value="${this.nombre}">
            <label for="${this.id + "input-programa-nombre"}">Nombre programa</label>
        `
        cEscritorio.appendChild(inputProgramaNombre)

        //Configuramos el control de entrada para que se actualice, con un metodo oninput
        const refInputPrograma = document.getElementById(this.id + "input-programa-nombre")
        refInputPrograma.addEventListener('input', () => {
            this.nombre = refInputPrograma.value
            Título3.textContent = refInputPrograma.value
            GuardarVigencia()
        });
        refInputPrograma.value = this.nombre;

        const inputText = HTML.inputTextArea2(this.id, "Descripción de la línea", 'InputTextLinea')
        cEscritorio.appendChild(inputText)

        const refDescripPrograma = document.getElementById(this.id + "InputTextLinea")
        refDescripPrograma.addEventListener('input', () => {
            this.descripcion = refDescripPrograma.value
            GuardarVigencia()
        });
        refDescripPrograma.value = this.descripcion;

        const Título4 = document.createElement('div');
        Título4.className = "fs-4 text-secondary border-bottom border-4"
        Título4.textContent = "Proyectos"
        cEscritorio.appendChild(Título4)

        //Agregar botton añadir proyectos
        const btAgregarGestion = document.createElement("button")
        btAgregarGestion.className = "btn btn-outline-secondary m-1"
        btAgregarGestion.innerHTML = `<i class="bi bi-plus"></i> Agregar proyecto`


        btAgregarGestion.onclick = () => {
            const gestion = new Gestion('Nueva proyección', 'Objetivo general', 'Administrador', false, "", 0, 0, this)
            this.addGestion(gestion)
            GuardarVigencia()

            document.getElementById("lstProyectos").innerHTML = ""

            let g = 0;
            this.clsGestion.forEach(gestion => {
                gestion.id = g++
                const btGestion = document.createElement('a')
                btGestion.className = "list-group-item list-group-item-action"
                btGestion.textContent = gestion.id + 1 + " " + gestion.nombre

                document.getElementById("lstProyectos").appendChild(btGestion);

                btGestion.onclick = () => {
                    gestion.makerHTMLProyeccion(area, linea, this.nombre)
                }
            })
        }
        cEscritorio.appendChild(btAgregarGestion)
        //Agregar listador de proyectos
        const listProyectos = document.createElement("div")
        listProyectos.className = "list-group m-3"
        listProyectos.id = "lstProyectos"
        cEscritorio.appendChild(listProyectos)


        document.getElementById("lstProyectos").innerHTML = ""

        //Cargar las gestiones
        let g = 0;
        this.clsGestion.forEach(gestion => {
            gestion.id = g++
            const btGestion = document.createElement('a')
            btGestion.className = "list-group-item list-group-item-action"
            btGestion.textContent = gestion.id + 1 + ". " + gestion.nombre

            document.getElementById("lstProyectos").appendChild(btGestion);

            btGestion.onclick = () => {

                gestion.makerHTMLProyeccion(area, linea, this.nombre, this)
            }
        })


        //Agregamos un boton borrar programa
        const btnBorrarPrograma = document.createElement("button")
        btnBorrarPrograma.className = "btn btn-outline-danger mt-5 m-1"
        btnBorrarPrograma.innerHTML = `<i class="bi bi-trash3"></i> Eliminar programa`

        btnBorrarPrograma.onclick = () => {
            this.parent.deletePrograma(this.id)
            GuardarVigencia()
            mostrar_escritorio()
        }
        cEscritorio.appendChild(btnBorrarPrograma)


        //Agregamos un boton borrar gestion
        const btnretroceder = document.createElement("button")
        btnretroceder.className = "btn btn-outline-secondary mt-5 m-1"
        btnretroceder.innerHTML = `<i class="bi bi-arrow-return-left"></i> Volver`

        btnretroceder.onclick = () => {
            linea.makerHTMLLineaPanel(area)
        }
        cEscritorio.appendChild(btnretroceder)

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


            cargarProyectos()
            GuardarVigencia()
            mensajes("Proyecto creado", "green")



        } catch (error) {
            mensajes("No ha iniciado sesión", "red")
            console.log(error)
        }

    }

}
async function cargarProyectos() {
    document.getElementById("conteneder-bar-proyectos").hidden = false
    document.getElementById("panel-inicio").hidden = true
    document.getElementById("panel-escritorio").innerHTML = ""
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



            let i = 1
            proyectos.forEach(vigencia => {

                const component = document.createElement('li')
                component.className = "w-100"
                component.innerHTML = `
                <a href="#" class="nav-link px-0 text-white" id="${"btnVig" + vigencia.id}"> 
                    <span
                        class="d-none d-sm-inline text-white">${vigencia.vigencia}
                    </span> 
                    (${i++})
                </a>  
                `
                Contenedor.appendChild(component)

                document.getElementById("btnVig" + vigencia.id).onclick = () => showVigencia(vigencia)

            });

        }
    } catch (error) {
        console.log(error)
    }



}

async function showVigencia(vigencia) {
    ActiveProyect = clsProyecto.loadAsInstance(vigencia);
    ActiveProyect.makerHtml()
    document.getElementById("conteneder-bar-proyectos").hidden = false
    document.getElementById("panel-inicio").hidden = true


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



}

//Esta función cita la función interna de proyecto para crear una nueva área
async function AgregarArea() {
    ActiveProyect.addArea(new Area("Nombre área", "Descripción del área", "Administrador", "Funciones"))
    GuardarVigencia()

    //Evidencia cuantas areas hay en el proyecto y las muestra
    const cAreas = document.getElementById("panel-areas")
    cAreas.innerHTML = ''
    ActiveProyect.clsAreas.forEach(area => {
        area.makerHtmlAreasItem()
        cAreas.appendChild(area.component);
    });
    mensajes("Elemento creado", "Green")
}



async function AgregarMandato(parentId) {
    const AreaActiva = ActiveProyect.clsAreas[parentId]
    //Se agrega uan neuva clase mandato, ojo- se marca indice del elemento y el indice del padre, apra mirar los
    //elementos anidados
    const mandato = new Mandato('Nuevo mandato', 0, parentId);
    AreaActiva.addMandato(mandato)

    const cMandatos = document.getElementById("divmandatoscollapse")
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

    //Creamos un anueva línea de acción dentro de la clase Area
    const linea = new Linea('Nueva linea', 'Descripción de la línea', 0, parent);
    AreaActiva.addLinea(linea)

    const cLineas = document.getElementById("divLineascollapse")
    cLineas.innerHTML = '';

    let i = 0;
    AreaActiva.cslLineas.forEach(linea => {
        linea.id = i++

        const btLinea = document.createElement('a')
        btLinea.className = "mb-1 list-group-item list-group-item-action"
        btLinea.textContent = linea.id + 1 + ". " + linea.nombre
        cLineas.appendChild(btLinea);

        btLinea.onclick = () => {
            linea.makerHTMLLineaPanel(parent)
        }

    })
    GuardarVigencia()
    mensajes("Se creó una nueva línea", "green")
}

function mostrar_escritorio() {
    document.getElementById("conteneder-bar-proyectos").hidden = true
    document.getElementById("panel-inicio").hidden = false
    document.getElementById("panel-escritorio").innerHTML = ""

}

