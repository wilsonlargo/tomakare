//Modulo que administra los proyectos y la construcción de los objetos visibles


//const { doc } = require("firebase/firestore");

//Esta variable guarda el proyecto activo como clase
let ActiveProyect;

class clsProyecto {
    constructor(nombre, vigencia) {
        this.nombre = nombre;
        this.vigencia = vigencia;
        this.clsAreas = []
        this.clsBiblioteca = []
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
                const areaNew = new Area(
                    Areas.nombre,
                    Areas.detalle,
                    Areas.administrador,
                    Areas.funciones,
                    Areas.pueblo,
                    Areas.avance
                );
                areaNew.cslMandatos = loadMandatos(Areas.cslMandatos);
                areaNew.cslLineas = loadLineas(Areas.cslLineas);
                areaNew.cslLibrerias = loadLibrerias(Areas.cslLibrerias);
                areaNew.cslArticulacion = loadArticulacion(Areas.cslArticulacion);
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
                const lineaNew = new Linea(
                    linea.nombre,
                    linea.descripcion,
                    linea.meta,
                    linea.avance,
                    linea.id,
                    linea.parent);
                lineaNew.clsPrograma = loadProgramas(linea.clsPrograma, lineaNew);
                return lineaNew;
            });
        }




        //Carga de la base de datos la clase articulación con todos sus campos
        const loadArticulacion = (fromcslArticulacion) => {
            return fromcslArticulacion.map(articulacion => {
                const ArticulacionNew = new Articulacion(
                    articulacion.consejeria,
                    articulacion.mandatos,
                    articulacion.id,
                    articulacion.parentId
                );
                return ArticulacionNew;
            });
        }

        const loadLibrerias = (fromClsLibrerias) => {
            return fromClsLibrerias.map(libro => {
                const LibreriaNew = new Libro(
                    libro.nombre,
                    libro.tipo,
                    libro.keys,
                    libro.link,
                    libro.descripcion,
                    libro.id,
                    libro.parentId
                );
                return LibreriaNew;
            });
        }

        const loadProgramas = (fromClsProgramas, lineaNew) => {
            return fromClsProgramas.map(programa => {
                const ProgramaNew = new Programa(
                    programa.nombre,
                    programa.descripcion,
                    programa.avance,
                    programa.meta,
                    programa.id,
                    lineaNew);

                ProgramaNew.clsGestion = loadGestion(
                    programa.clsGestion,
                    ProgramaNew)
                return ProgramaNew;
            });
        }

        const loadGestion = (fromClsGestiones, ProgramaNew) => {
            return fromClsGestiones.map(gestion => {
                const GestionNew = new Gestion(
                    gestion.nombre,
                    gestion.ogeneral,
                    gestion.mandato,
                    gestion.manager,
                    gestion.financiado,
                    gestion.fuente,
                    gestion.valor,
                    gestion.indicador,
                    gestion.cumplimiento,

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

        //Colocamos el título de la consejería
        const Título = document.createElement('div');
        Título.className = "mt-5 fs-5 fw-bold text-secondary border-bottom border-4 border-secondary"
        Título.textContent = "Elementos proyectados en esta gestión"

        contenedor.appendChild(Título)

        //Lector de elementos para contadores
        let contadorLineas = 0
        let contadorPrograma = 0
        let contadorProyectos = 0
        this.clsAreas.forEach(area => {
            contadorLineas = contadorLineas + area.cslLineas.length
            area.cslLineas.forEach(linea => {
                contadorPrograma = contadorPrograma + linea.clsPrograma.length
                linea.clsPrograma.forEach(programa => {
                    contadorProyectos = contadorProyectos + programa.clsGestion.length
                })
            })
        });




        const ContContadores = document.createElement("div")
        ContContadores.className = "row"

        //Agregar contadores por vigencia
        const ContConsejerias = document.createElement("div")
        ContConsejerias.className = "col-sm-12 col-md-6 col-lg-4 col-xl-2 border border-1 m-2"
        ContConsejerias.innerHTML = `
                 <p class="text-secondary tex-org-big-gris">${this.clsAreas.length}</p>
                 <a href="#" class="nav-link text-center text-foot-foto bg-success text-white p-2" id="contador-areas">
                 CONSEJERÍAS
             </a>
                </p>
                `
        ContContadores.appendChild(ContConsejerias)



        //Agregar contadores por vigencia
        const ContLineas = document.createElement("div")
        ContLineas.className = "col-sm-12 col-md-6 col-lg-4 col-xl-2 border border-1 m-2"
        ContLineas.innerHTML = `
                         <p class="text-secondary tex-org-big-gris">${contadorLineas}</p>
                         <a href="#" class="nav-link text-center text-foot-foto bg-success text-white p-2">
                         LÍNEAS
                        </a>
                        </p>
                        `
        ContContadores.appendChild(ContLineas)

        //Agregar contadores por vigencia
        const ContProgramas = document.createElement("div")
        ContProgramas.className = "col-sm-12 col-md-6 col-lg-4 col-xl-2 border border-1 m-2"
        ContProgramas.innerHTML = `
                                 <p class="text-secondary tex-org-big-gris">${contadorPrograma}</p>
                                 <a href="#" class="nav-link text-center text-foot-foto bg-success text-white p-2">
                                     PROGRAMAS
                                    </a>
                                </p>
                                `
        ContContadores.appendChild(ContProgramas)


        //Agregar contadores por vigencia
        const Contvigencias = document.createElement("div")
        Contvigencias.className = "col-sm-12 col-md-6 col-lg-4 col-xl-2 border border-1 m-2"
        Contvigencias.innerHTML = `
                                        <p class="text-secondary tex-org-big-gris">${contadorProyectos}</p>
                                            <a href="#" class="nav-link text-center text-foot-foto bg-success text-white p-2" id="contador-gestiones">
                                                PROYECTOS
                                            </a>
                                        </p>
                                        `
        ContContadores.appendChild(Contvigencias)
        contenedor.appendChild(ContContadores)


        const btncontar_gestiones = document.getElementById("contador-gestiones")

        btncontar_gestiones.onclick = () => {

            listarGestiones()
        }

        const btncontar_areas = document.getElementById("contador-areas")

        btncontar_areas.onclick = () => {
            visorAreas()
        }


    }

}

//Clase que contiene la configuración de cada área/consejería de la vigencia
class Area {
    //constructor(nombre, detalle, administrador, parent) // aquí una version previa con parent, para ahcer las consultas
    //en restropectiva con el objeto parent
    constructor(nombre, detalle, administrador, funciones, pueblo, avance, id) {
        this.nombre = nombre;
        this.detalle = detalle;
        this.administrador = administrador;
        this.funciones = funciones;
        this.pueblo = pueblo;
        this.avance = avance;
        this.id = id
        this.cslMandatos = [];
        this.cslLineas = [];
        this.cslArticulacion = [];
        this.cslLibrerias = [];

        //this.parent=parent
    }

    addMandato(Mandato) {
        this.cslMandatos.push(Mandato);
    }
    deleteMandato(id) {
        this.cslMandatos.splice(id, 1);
    }

    //Añadir módulo de biblioteca para anexar documentos 
    addLibreria(Libro) {
        this.cslLibrerias.push(Libro);
    }
    deleteLibreria(id) {
        this.cslLibrerias.splice(id, 1);
    }

    //Añadir módulo de articulación
    addArticulacion(Articulacion) {
        this.cslArticulacion.push(Articulacion);
    }
    deleteArticulacion(id) {
        this.cslArticulacion.splice(id, 1);
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


        //Input pueblo de área
        const puebloArea = HTML.inputContol(this, this.id + "puebloArea", "Pueblo mandatario")
        document.getElementById("panel-escritorio").appendChild(puebloArea)
        //Configuramos el control de entrada para que se actualice, con un metodo oninput
        const intPuebloArea = document.getElementById(this.id + "puebloArea")
        intPuebloArea.addEventListener('input', () => {
            this.pueblo = intPuebloArea.value
            GuardarVigencia()
        });
        intPuebloArea.value = this.pueblo;


        //Creamos ahora los input, detalle
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

        //Sección medidor de avance
        //Identificamos cuantos lineas hay y sumamos esos valores
        //*********************************************************/

        let avance = 0;
        this.cslLineas.forEach(linea => {
            avance = avance + Math.trunc((linea.meta * linea.avance) / 100);
        })

        let colorAvance;
        let colorAvanceTexto;

        if (avance <= 25) {
            colorAvance = "bg-danger"
            colorAvanceTexto = "text-white"
        } else if (avance <= 50) {
            colorAvance = "bg-warning-subtle"
            colorAvanceTexto = "text-dark"
        }
        else if (avance <= 75) {
            colorAvance = "bg-warning"
            colorAvanceTexto = "text-white"

        }
        else if (avance <= 100) {
            colorAvance = "bg-success"
            colorAvanceTexto = "text-white"
        }

        this.avance = avance
        GuardarVigencia()

        const indicadorAvance = document.createElement("div")
        indicadorAvance.className = "border border-2 p-2 ms-1"
        indicadorAvance.style.width = "100px"
        indicadorAvance.innerHTML = `
                <p class="text-center fs-3">${avance}%</p>
                <p class="text-center ${colorAvance} ${colorAvanceTexto} p-2">Avance</p>
        `

        cEscritorio.appendChild(indicadorAvance)
        //*********************************************************/
        //*********************************************************/

        const collapseMandatos = document.createElement("div")
        collapseMandatos.innerHTML = `
            <a class="nav-link mb-3 fs-4 text-secondary border-bottom border-4" 
            data-bs-toggle="collapse" href="#collapseMandatos" 
            role="button" aria-expanded="true" 
            aria-controls="collapseMandatos">
            <i class="bi bi-brightness-high-fill"></i> Mandatos
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
            mandato.makerHtmlMandato();
        })

        const collapseLineas = document.createElement("div")
        collapseLineas.innerHTML = `
            <a class="nav-link mb-2 fs-4 text-secondary border-bottom border-4" 
            data-bs-toggle="collapse" href="#collapseLineas" 
            role="button" aria-expanded="true" 
            aria-controls="collapseLineas">
            <i class="bi bi-bar-chart-steps"></i> Líneas de acción
            </a>
                <div class="collapse" id="collapseLineas">
                <div id="divLineasbutton">
                        
                </div>
                <div id="divLineascollapse" class="m-4 list-group m-3">
                    
                </div>
                </div>
            `
        cEscritorio.appendChild(collapseLineas)

        //Collapse para articulacion / versión simplificada
        const collapseArticulacion = HTML.collapseControl1("Articulación de Consejerías", "cArticulacionCollapse", "articulacion",'bi-arrow-left-right')
        cEscritorio.appendChild(collapseArticulacion)
        //Agregar un boton para agregar un documento
        const btAgregarArticulacion = document.createElement("button")
        btAgregarArticulacion.className = "btn btn-outline-secondary m-1"
        btAgregarArticulacion.innerHTML = `<i class="bi bi-plus"></i> Agregar consejeria`
        btAgregarArticulacion.onclick = () => {
            AgregarArticulación(this)
        }
        document.getElementById("divarticulacionbutton").appendChild(btAgregarArticulacion)

        const cArticulacion = document.getElementById("divarticulacioncollapse")
        cArticulacion.innerHTML = ''
        let art = 0;
        this.cslArticulacion.forEach(articulacion => {
            console.log(articulacion)
            articulacion.id = art++
            articulacion.parentId = this
            articulacion.makerHtmlArticulacion(articulacion);
        })



        //Collapse para libreria / versión simplificada
        const collapseLibros = HTML.collapseControl1("Librería / Anexos", "cLibreriaCollapse", "libreria","bi-journals")
        cEscritorio.appendChild(collapseLibros)
        //Agregar un boton para agregar un documento
        const btAgregarLibro = document.createElement("button")
        btAgregarLibro.className = "btn btn-outline-secondary m-1"
        btAgregarLibro.innerHTML = `<i class="bi bi-plus"></i> Agregar documento`
        btAgregarLibro.onclick = () => {
            AgregarLibreria(this)
        }
        document.getElementById("divlibreriabutton").appendChild(btAgregarLibro)

        const cLibros = document.getElementById("divlibreriacollapse")
        cLibros.innerHTML = ''
        let doc = 0;
        this.cslLibrerias.forEach(libro => {
            console.log(libro)
            libro.id = doc++
            libro.parentId = this
            libro.makerHtmlLibro(libro);
        })





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
            btLinea.innerHTML = `
            <div class="row justify-content-around">
                <div class="col-6">
                <i class="bi bi-file-earmark-text-fill"></i> 
                ${linea.id + 1 + ". " + linea.nombre} 
              </div>
              <div class="col-6">
                <span class="badge bg-dark-subtle text-dark rounded-pill">${"(M) " + linea.meta + "%"}</span>
                <span class="badge bg-secondary text-white rounded-pill">${"(A) " + linea.avance + "%"}</span>
              </div>
            </div>
            `
            document.getElementById("divLineascollapse").appendChild(btLinea);

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
            modal.modalDelete(
                () => {
                    ActiveProyect.deleteArea(this.id)
                    GuardarVigencia()
                    mostrar_escritorio()

                    //Evidencia cuantas areas hay en el proyecto y las muestra
                    const cAreas = document.getElementById("panel-areas")
                    cAreas.innerHTML = ''
                    ActiveProyect.clsAreas.forEach(area => {
                        area.makerHtmlAreasItem()
                        mostrar_escritorio()
                    });
                    mensajes("El área fue eliminada", "blue")
                }
            )

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
        //Creamos el control de entrada para mandatos
        const  cMandato = document.createElement("div")
        cMandato.className="input-group mb-2"
        cMandato.innerHTML=`
        <span class="input-group-text">
        ${this.id + 1}.
        </span>
        <textarea class="form-control" aria-label="With textarea" id="${this.id + "InputMandato"}"></textarea>
        <span class="input-group-text">
            <button class="btn text-danger fw-medium" id="${this.id}btnBorrarMandato">
                <i class="bi bi-trash3 fw-medium"></i>
            </button>
        </span>
        
        `
        document.getElementById("divmandatoscollapse").appendChild(cMandato)

        console.log(this.id + "InputMandato")
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
            })
            GuardarVigencia()
        });
    }

}

class Articulacion {
    constructor(consejeria, mandatos, id, parentId) {
        this.consejeria = consejeria;
        this.mandatos = mandatos;
        this.id = id
        this.parentId = parentId
    }
    makerHtmlArticulacion(Articulacion) {
        const collapseArticulacion = document.getElementById("divarticulacioncollapse")
        const item = document.createElement("ol")
        item.className = "list-group list-group-numbered"
        item.innerHTML = `
        <div class="">
            <div class="row justify-content-between">
                <div class="col-10 fw-bold text-start" data-bs-toggle="collapse" href="#collapseArticulacion${Articulacion.id}"
                    role="button" aria-controls="collapseLibro${Articulacion.id}">
                    <div id="tituloArticulacion${Articulacion.id}"><i class="bi bi-people-fill fs-4 me-2"></i>${Articulacion.id + 1}. ${Articulacion.consejeria}</div>
                </div>
            </div>
            <div class="collapse" id="collapseArticulacion${Articulacion.id}">
                <div class="card card-body">
                    <div class="form-floating mb-2">
                        <textarea class="form-control" id="int-Consejeria-Articulacion${Articulacion.id}"
                            style="height: 50px"></textarea>
                        <label for="int-Consejeria-Articulacion${Articulacion.id}">Consejeria</label>
                    </div>
                    <div class="form-floating mb-2">
                        <textarea class="form-control" id="int-Mandatos-Articulacion${Articulacion.id}"
                            style="height: 100px"></textarea>
                        <label for="int-Mandatos-Documento${Articulacion.id}">Mandatos</label>
                    </div>
                    <button type="button" class="btn btn-outline-danger" id="btnEliminarArticulacion${Articulacion.id}" style="width: 200px;">
                    <i class="bi bi-file-earmark-x me-2"></i>
                    Eliminar mandato</button>                 
                </div>
            </div>
        </div>`

        collapseArticulacion.appendChild(item)

        //Configuración nombre de la consejeria en articulación
        const ref_nombre_consejeria = document.getElementById(`int-Consejeria-Articulacion${Articulacion.id}`)
        //Se vincula y actualiza el nombre de la consejeria, junto al título del control y en la DB
        ref_nombre_consejeria.oninput = () => {
            Articulacion.consejeria = ref_nombre_consejeria.value
            //Actualiza el título sin perder el numerador y el ícono
            document.getElementById(`tituloArticulacion${Articulacion.id}`).innerHTML = `<i class="bi bi-people-fill fs-4 me-2"></i>${Articulacion.id + 1}. ${ref_nombre_consejeria.value}`
            GuardarVigencia()
        }
        ref_nombre_consejeria.value = Articulacion.consejeria

        //Configuración nombre del mandato en articulación
        const ref_mandato_consejeria = document.getElementById(`int-Mandatos-Articulacion${Articulacion.id}`)
        //Se vincula y actualiza el nombre de la consejeria, junto al título del control y en la DB
        ref_mandato_consejeria.oninput = () => {
            Articulacion.mandatos = ref_mandato_consejeria.value
            GuardarVigencia()
        }
        ref_mandato_consejeria.value = Articulacion.mandatos




        //Agrega evento al boton borrar link
        document.getElementById(`btnEliminarArticulacion${Articulacion.id}`).onclick = () => {
            this.parentId.deleteArticulacion(Articulacion.id)
            GuardarVigencia()
            const cArticulacion = document.getElementById("divarticulacioncollapse")
            cArticulacion.innerHTML = ''
            let i = 0;
            this.parentId.cslArticulacion.forEach(articulacion => {
                articulacion.id = i++
                articulacion.parentId = this.parentId
                articulacion.makerHtmlArticulacion(articulacion);
            })
        }

    }
}

class Libro {
    constructor(nombre, tipo, keys, link, descripcion, id, parentId) {
        this.nombre = nombre;
        this.tipo = tipo;
        this.keys = keys;
        this.link = link;
        this.descripcion = descripcion;
        this.id = id
        this.parentId = parentId
    }
    makerHtmlLibro(libro) {

        const tiposDoc = {
            "texto": () => {
                const icono = "bi bi-file-earmark-text-fill fs-4 me-2"
                return icono
            },
            "calculo": () => {
                const icono = "bi-file-earmark-spreadsheet-fill fs-4 me-2"
                return icono
            },
            "video": () => {
                const icono = "bi-file-earmark-play-fill fs-4 me-2"
                return icono
            },
            "presentacion": () => {
                const icono = "bi bi-file-earmark-easel-fill fs-4 me-2"
                return icono
            },
            "audio": () => {
                const icono = "bi bi-file-earmark-music-fill fs-4 me-2"
                return icono
            },
            "web": () => {
                const icono = "bi bi-filetype-html fs-4 me-2"
                return icono
            },
            "imagen": () => {
                const icono = "bi bi-file-image-fill fs-4 me-2"
                return icono
            },
            "pdf": () => {
                const icono = "bi bi-file-earmark-pdf-fill fs-4 me-2"
                return icono
            }


        }

        const collaseLibros = document.getElementById("divlibreriacollapse")
        const item = document.createElement("ol")
        item.className = "list-group list-group-numbered"
        item.innerHTML = `
        <div class="">
            <div class="row justify-content-between">
                <div class="col-10 fw-bold text-start" data-bs-toggle="collapse" href="#collapseLibro${libro.id}"
                    role="button" aria-controls="collapseLibro${libro.id}">
                    <div id="tituloLibro${libro.id}"><i class="bi bi-file-earmark-text-fill fs-4 me-2" id="icoPrincipal${libro.id}"></i>${libro.id + 1}. ${libro.nombre}</div>
                </div>
                <div class="col-2 text-end">
                    <a id="btnLinkPrincipal${libro.id}" class="nav-link active fs-3 text-primary" aria-current="page"
                        href="#" target="_blank"><i class="bi bi-link-45deg"></i></a>
                </div>
            </div>
            <div class="collapse" id="collapseLibro${libro.id}">
                <div class="card card-body">
                    <div class="form-floating mb-2">
                        <textarea class="form-control" id="int-Nombre-Documento${libro.id}"
                            style="height: 50px"></textarea>
                        <label for="int-Nombre-Documento${libro.id}">Título del documento</label>
                    </div>
                    <div class="form-floating mb-2">
                        <textarea class="form-control" id="int-keys-Documento${libro.id}"
                            style="height: 50px"></textarea>
                        <label for="int-keys-Documento${libro.id}">Palabras claves / categorias</label>
                    </div>
                    <div class="form-floating mb-2">
                    <textarea class="form-control" id="int-descripcion-Documento${libro.id}"
                        style="height: 50px"></textarea>
                    <label for="int-descripcion-Documento${libro.id}">Descripción / Tema del documento</label>
                    </div>
                    <div class="input-group mb-2">
                        <textarea class="form-control" aria-label="With textarea" id="int-link-Documento${libro.id}" placeholder="Vínculo o enlace del documento"></textarea>
                        <span class="input-group-text">
                            <a id="btnLinkSecundario${libro.id}" class="nav-link active fs-5" aria-current="page"
                            href="#" target="_blank"><i class="bi bi-link-45deg"></i>
                        </a>
                    </span>
                      </div>
                    <div class="dropdown">
                        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" id="btntipo${libro.id}">
                          Tipo de archivo
                        </button>
                        <ul class="dropdown-menu">
                          <li id="btnTexto${libro.id}"><a class="dropdown-item"><i class="bi bi-file-earmark-text-fill me-2 fs-4"></i>Documento texto</a></li>
                          <li id="btnCalculo${libro.id}"><a class="dropdown-item"><i class="bi bi-file-earmark-spreadsheet-fill me-2 fs-4"></i>Hoja cálculo</a></li>
                          <li id="btnVideo${libro.id}"><a class="dropdown-item"><i class="bi bi-file-earmark-play-fill me-2 fs-4"></i>Video</a></li>
                          <li id="btnAudio${libro.id}"><a class="dropdown-item"><i class="bi bi-file-earmark-music-fill me-2 fs-4"></i>Audio</a></li>
                          <li id="btnPresentacion${libro.id}"><a class="dropdown-item"><i class="bi bi-file-earmark-easel-fill me-2 fs-4"></i>Presentación</a></li>
                          <li id="btnImagen${libro.id}"><a class="dropdown-item"><i class="bi bi-file-image-fill me-2 fs-4"></i>Imagen</a></li>
                          <li id="btnWeb${libro.id}"><a class="dropdown-item"><i class="bi bi-filetype-html me-2 fs-4"></i>Página web</a></li>
                          <li id="btnPdf${libro.id}"><a class="dropdown-item"><i class="bi bi-file-earmark-pdf-fill me-2 fs-4"></i>Documento pdf</a></li>
                        </ul>
                        <button type="button" class="btn btn-outline-danger" id="btnEliminarLink${libro.id}">Eliminar vínculo</button>
                    </div>
                   
                </div>
            </div>
        </div>`

        collaseLibros.appendChild(item)
        //Configuración nombre del libro
        const ref_nombre_libro = document.getElementById(`int-Nombre-Documento${libro.id}`)
        //document.getElementById(`tituloLibro${libro.id}`)
        //Se vincula y actualiza el nombre del libro, junto al título del control y en la DB
        ref_nombre_libro.oninput = () => {
            libro.nombre = ref_nombre_libro.value
            //Actualiza el título sin perder el numerador y el ícono
            document.getElementById(`tituloLibro${libro.id}`).innerHTML = `<i class="bi bi-file-earmark-text-fill fs-4 me-2"></i>${libro.id + 1}. ${ref_nombre_libro.value}`
            GuardarVigencia()
        }
        ref_nombre_libro.value = libro.nombre


        //Configuración palabras clave del libro
        const ref_keys_libro = document.getElementById(`int-keys-Documento${libro.id}`)
        ref_keys_libro.oninput = () => {
            libro.keys = ref_keys_libro.value
            GuardarVigencia()
        }
        ref_keys_libro.value = libro.keys


        //Configuración descripcion del libro
        const ref_descripcion_libro = document.getElementById(`int-descripcion-Documento${libro.id}`)
        ref_descripcion_libro.oninput = () => {
            libro.descripcion = ref_descripcion_libro.value
            GuardarVigencia()
        }
        ref_descripcion_libro.value = libro.descripcion

        //Configuración enlace del libro
        const ref_link_libro = document.getElementById(`int-link-Documento${libro.id}`)
        ref_link_libro.oninput = () => {
            libro.link = ref_link_libro.value
            //actualiza los enlaces para abrir en otro documento
            document.getElementById(`btnLinkPrincipal${libro.id}`).href = ref_link_libro.value
            document.getElementById(`btnLinkSecundario${libro.id}`).href = ref_link_libro.value
            GuardarVigencia()
        }
        ref_link_libro.value = libro.link
        //Cuando carga la clase actualiza los enlaces para abrir en una página aparte
        document.getElementById(`btnLinkPrincipal${libro.id}`).href = libro.link
        document.getElementById(`btnLinkSecundario${libro.id}`).href = libro.link

        //Según sea la selección en el menú tipo, así msimo le asigna un valor a cada evento
        //El cambio de tipo actualiza en la BD y cambia el icono de cada archivo

        document.getElementById(`btnTexto${libro.id}`).onclick = () => {
            document.getElementById(`icoPrincipal${libro.id}`).className = tiposDoc.texto()
            libro.tipo = "texto"
            document.getElementById(`btntipo${libro.id}`).textContent = "Documento tipo " + libro.tipo
        }
        document.getElementById(`btnCalculo${libro.id}`).onclick = () => {
            document.getElementById(`icoPrincipal${libro.id}`).className = tiposDoc.calculo()
            libro.tipo = "calculo"
            document.getElementById(`btntipo${libro.id}`).textContent = "Documento tipo " + libro.tipo
        }
        document.getElementById(`btnVideo${libro.id}`).onclick = () => {
            document.getElementById(`icoPrincipal${libro.id}`).className = tiposDoc.video()
            libro.tipo = "video"
            document.getElementById(`btntipo${libro.id}`).textContent = "Documento tipo " + libro.tipo
        }

        document.getElementById(`btnAudio${libro.id}`).onclick = () => {
            document.getElementById(`icoPrincipal${libro.id}`).className = tiposDoc.audio()
            libro.tipo = "audio"
            document.getElementById(`btntipo${libro.id}`).textContent = "Documento tipo " + libro.tipo
        }
        document.getElementById(`btnPresentacion${libro.id}`).onclick = () => {
            document.getElementById(`icoPrincipal${libro.id}`).className = tiposDoc.presentacion()
            libro.tipo = "presentacion"
            document.getElementById(`btntipo${libro.id}`).textContent = "Documento tipo " + libro.tipo
        }
        document.getElementById(`btnImagen${libro.id}`).onclick = () => {
            document.getElementById(`icoPrincipal${libro.id}`).className = tiposDoc.imagen()
            libro.tipo = "imagen"
            document.getElementById(`btntipo${libro.id}`).textContent = "Documento tipo " + libro.tipo
        }
        document.getElementById(`btnWeb${libro.id}`).onclick = () => {
            document.getElementById(`icoPrincipal${libro.id}`).className = tiposDoc.web()
            libro.tipo = "web"
            document.getElementById(`btntipo${libro.id}`).textContent = "Documento tipo " + libro.tipo
        }
        document.getElementById(`btnPdf${libro.id}`).onclick = () => {
            document.getElementById(`icoPrincipal${libro.id}`).className = tiposDoc.pdf()
            libro.tipo = "pdf"
            document.getElementById(`btntipo${libro.id}`).textContent = "Documento tipo " + libro.tipo
        }

        //Actualzia el texto del boton tipo en relación a la BD
        document.getElementById(`btntipo${libro.id}`).textContent = "Documento tipo " + libro.tipo
        //Si al mirar la BD hay un error en el tipo de documento, deja por defecto texto
        try {
            document.getElementById(`icoPrincipal${libro.id}`).className = tiposDoc[libro.tipo]()
        } catch (error) {
            document.getElementById(`icoPrincipal${libro.id}`).className = tiposDoc.texto()
            libro.tipo = "texto"
        }

        //Agrega evento al boton borrar link
        document.getElementById(`btnEliminarLink${libro.id}`).onclick = () => {
            this.parentId.deleteLibreria(libro.id)
            GuardarVigencia()
            const cLibros = document.getElementById("divlibreriacollapse")
            cLibros.innerHTML = ''
            let i = 0;
            this.parentId.cslLibrerias.forEach(libro => {
                libro.id = i++
                libro.parentId = this.parentId
                libro.makerHtmlLibro(libro);
            })
        }

    }
}



class Linea {
    constructor(nombre, descripcion, meta, avance, id, parent) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.meta = meta;
        this.avance = avance;
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


        //Porcentaje en el área
        const inputMetaEnLArea = document.createElement("form")
        inputMetaEnLArea.className = "form-floating mb-2"
        inputMetaEnLArea.innerHTML = `
                            <input type="text" class="form-control" id="input-meta" value="${this.meta}">
                            <label for="input-meta">Porcentaje meta en la consejería</label>
                        `
        cEscritorio.appendChild(inputMetaEnLArea)

        const refinputMeta = document.getElementById("input-meta")
        refinputMeta.oninput = () => {
            this.meta = refinputMeta.value;
            GuardarVigencia()
        }
        refinputMeta.value = this.meta


        //Sección medidor de avance
        //Identificamos cuantos programas hay y sumamos esos valores
        //*********************************************************/

        let avanceLinea = 0;
        this.clsPrograma.forEach(programa => {

            avanceLinea = avanceLinea + Math.trunc((programa.meta * programa.avance) / 100);



        })

        let colorAvance;
        let colorAvanceTexto;

        if (avanceLinea <= 25) {
            colorAvance = "bg-danger"
            colorAvanceTexto = "text-white"
        } else if (avanceLinea <= 50) {
            colorAvance = "bg-warning-subtle"
            colorAvanceTexto = "text-dark"
        }
        else if (avanceLinea <= 75) {
            colorAvance = "bg-warning"
            colorAvanceTexto = "text-white"

        }
        else if (avanceLinea <= 100) {
            colorAvance = "bg-success"
            colorAvanceTexto = "text-white"
        }

        this.avance = avanceLinea
        GuardarVigencia()

        const indicadorAvance = document.createElement("div")
        indicadorAvance.className = "border border-2 p-2 ms-1"
        indicadorAvance.style.width = "100px"
        indicadorAvance.innerHTML = `
                <p class="text-center fs-3">${avanceLinea}%</p>
                <p class="text-center ${colorAvance} ${colorAvanceTexto} p-2">Avance</p>
        `

        cEscritorio.appendChild(indicadorAvance)
        //*********************************************************/
        //*********************************************************/



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
            const programa = new Programa('Nuevo programa', 'Descripción del programa', 0, 0, numNew, this);
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
                btPrograma.innerHTML = `
                <div class="row justify-content-around">
                    <div class="col-6">
                    <i class="bi bi-file-earmark-text-fill"></i> 
                    ${programa.id + 1 + ". " + programa.nombre} 
                  </div>
                  <div class="col-6">
                  <span class="badge bg-dark-subtle text-dark rounded-pill">${"(M) " + programa.meta + "%"}</span>
                  <span class="badge bg-secondary text-white rounded-pill">${"(A) " + programa.avance + "%"}</span>
                  </div>
                </div>
                `

                cProgramas.appendChild(btPrograma);

                btPrograma.onclick = () => {
                    programa.makerHTMLProgramaPanel(parent, this)
                }
            })
        }

        cEscritorio.appendChild(btAgregarPrograma)


        //Agregar listador de proyectos
        const listProyectos = document.createElement("div")
        listProyectos.className = "list-group m-3"
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
            btPrograma.innerHTML = `
                <div class="row justify-content-around">
                    <div class="col-6">
                    <i class="bi bi-file-earmark-text-fill"></i> 
                    ${programa.id + 1 + ". " + programa.nombre} 
                  </div>
                  <div class="col-6">
                  <span class="badge bg-dark-subtle text-dark rounded-pill">${"(M) " + programa.meta + "%"}</span>
                  <span class="badge bg-secondary text-white rounded-pill">${"(A) " + programa.avance + "%"}</span>
                  </div>
                </div>
                `
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
            modal.modalDelete(
                () => {
                    parent.deleteLinea(this.id)
                    console.log(parent.cslLineas)
                    GuardarVigencia()
                    parent.makerHtmlAreasItem()
                }
            )

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
    constructor(nombre, descripcion, avance, meta, id, parent) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.avance = avance;
        this.meta = meta;
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



        //Porcentaje en la línea
        const inputMetaEnLinea = document.createElement("form")
        inputMetaEnLinea.className = "form-floating mb-2"
        inputMetaEnLinea.innerHTML = `
                    <input type="text" class="form-control" id="input-meta" value="${this.meta}">
                    <label for="input-meta">Porcentaje meta en la línea</label>
                `
        cEscritorio.appendChild(inputMetaEnLinea)

        const refinputMeta = document.getElementById("input-meta")
        refinputMeta.oninput = () => {
            this.meta = refinputMeta.value;
            GuardarVigencia()
        }
        refinputMeta.value = this.meta

        //Sección medidor de avance
        //Identificamos cuantos proyectos hay y sumamos esos valores
        //*********************************************************/

        let avancePrograma = 0;
        this.clsGestion.forEach(gestion => {
            avancePrograma = avancePrograma + parseInt(gestion.cumplimiento)
        })

        let colorAvance;
        let colorAvanceTexto;

        if (avancePrograma <= 25) {
            colorAvance = "bg-danger"
            colorAvanceTexto = "text-white"
        } else if (avancePrograma <= 50) {
            colorAvance = "bg-warning-subtle"
            colorAvanceTexto = "text-dark"
        }
        else if (avancePrograma <= 75) {
            colorAvance = "bg-warning"
            colorAvanceTexto = "text-white"

        }
        else if (avancePrograma <= 100) {
            colorAvance = "bg-success"
            colorAvanceTexto = "text-white"
        }

        this.avance = avancePrograma
        GuardarVigencia()

        const indicadorAvance = document.createElement("div")
        indicadorAvance.className = "border border-2 p-2 ms-1"
        indicadorAvance.style.width = "100px"
        indicadorAvance.innerHTML = `
                <p class="text-center fs-3">${avancePrograma}%</p>
                <p class="text-center ${colorAvance} ${colorAvanceTexto} p-2">Avance</p>
        `

        cEscritorio.appendChild(indicadorAvance)
        //*********************************************************/
        //*********************************************************/



        const Título4 = document.createElement('div');
        Título4.className = "fs-4 text-secondary border-bottom border-4"
        Título4.textContent = "Proyectos"
        cEscritorio.appendChild(Título4)

        //Agregar botton añadir proyectos
        const btAgregarGestion = document.createElement("button")
        btAgregarGestion.className = "btn btn-outline-secondary m-1"
        btAgregarGestion.innerHTML = `<i class="bi bi-plus"></i> Agregar proyecto`



        btAgregarGestion.onclick = () => {
            const gestion = new Gestion('Nueva proyección', "Objetivo general", "Mandato en relación", "Administrador", false, "", 0, 0, 0, 0, this)
            this.addGestion(gestion)
            GuardarVigencia()

            document.getElementById("lstProyectos").innerHTML = ""

            let g = 0;

            this.clsGestion.forEach(gestion => {
                gestion.id = g++
                const btGestion = document.createElement('a')
                btGestion.className = "list-group-item list-group-item-action"
                btGestion.innerHTML = `
                <div class="row justify-content-around">
                    <div class="col-6">
                    <i class="bi bi-file-earmark-text-fill"></i> 
                    ${gestion.id + 1 + ". " + gestion.nombre} 
                  </div>
                  <div class="col-6">
                    <span class="badge bg-dark-subtle text-dark rounded-pill">${"(M) " + gestion.indicador + "%"}</span>
                    <span class="badge bg-secondary text-white rounded-pill">${"(A) " + (gestion.cumplimiento / gestion.indicador) * 100 + "%"}</span>
                  </div>
                </div>
                `
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

        //Contadores para calculos de porcenctajes de avance

        this.clsGestion.forEach(gestion => {

            gestion.id = g++
            const btGestion = document.createElement('a')
            btGestion.className = "list-group-item list-group-item-action"
            btGestion.innerHTML = `
                <div class="row justify-content-around">
                    <div class="col-6">
                    <i class="bi bi-file-earmark-text-fill"></i> 
                    ${gestion.id + 1 + ". " + gestion.nombre} 
                  </div>
                  <div class="col-6">
                  <span class="badge bg-dark-subtle text-dark rounded-pill">${"(M) " + gestion.indicador + "%"}</span>
                  <span class="badge bg-secondary text-white rounded-pill">${"(A) " + Math.trunc((gestion.cumplimiento / gestion.indicador) * 100) + "%"}</span>
                  </div>
                </div>
                `
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
            modal.modalDelete(
                () => {
                    this.parent.deletePrograma(this.id)
                    GuardarVigencia()
                    linea.makerHTMLLineaPanel(area)
                }
            )

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
    ActiveProyect.addArea(new Area("Nombre área", "Descripción del área", "Administrador", "Funciones", "Nombre de pueblo", 0))
    GuardarVigencia()

    //Evidencia cuantas areas hay en el proyecto y las muestra
    const cAreas = document.getElementById("panel-areas")
    cAreas.innerHTML = ''
    ActiveProyect.clsAreas.forEach(area => {
        area.makerHtmlAreasItem()
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

    })
    //GuardarVigencia()
    mensajes("Se creó un mandato", "green")
}



async function AgregarArticulación(dominio) {
    const AreaActiva = ActiveProyect.clsAreas[dominio.id]

    const articulacion = new Articulacion('Consejeria', "Mandato", 0, dominio);
    AreaActiva.addArticulacion(articulacion)

    const cArticulacion = document.getElementById("divarticulacioncollapse")
    cArticulacion.innerHTML = ''
    let i = 0;
    AreaActiva.cslArticulacion.forEach(articulacion => {
        articulacion.id = i++
        articulacion.parentId = AreaActiva
        articulacion.makerHtmlArticulacion(articulacion);
    })
    GuardarVigencia()
    mensajes("Se anexó un mandato en articulación", "green")
}


async function AgregarLibreria(dominio) {
    const AreaActiva = ActiveProyect.clsAreas[dominio.id]
    //Se agrega uan nueva clase libreria, ojo- se marca indice del elemento y el indice del padre, para mirar los
    //elementos anidados
    const libro = new Libro('Nuevo documento', "texto", "Palabras clave", "#", "Descripcion", 0, dominio);
    AreaActiva.addLibreria(libro)

    const cLibros = document.getElementById("divlibreriacollapse")
    cLibros.innerHTML = ''
    let i = 0;
    AreaActiva.cslLibrerias.forEach(libro => {
        libro.id = i++
        libro.parentId = AreaActiva
        libro.makerHtmlLibro(libro);
    })
    GuardarVigencia()
    mensajes("Se creó un documento", "green")
}

async function AgregarLinea(parent) {
    //Identificamos en que área estamos pos su id
    const AreaActiva = parent

    //Creamos un anueva línea de acción dentro de la clase Area
    const linea = new Linea('Nueva linea', 'Descripción de la línea', 0, 0, 0, parent);
    AreaActiva.addLinea(linea)

    const cLineas = document.getElementById("divLineascollapse")
    cLineas.innerHTML = '';

    let i = 0;
    AreaActiva.cslLineas.forEach(linea => {
        linea.id = i++

        const btLinea = document.createElement('a')
        btLinea.className = "mb-1 list-group-item list-group-item-action"
        btLinea.innerHTML = `
        <div class="row justify-content-around">
            <div class="col-6">
            <i class="bi bi-file-earmark-text-fill"></i> 
            ${linea.id + 1 + ". " + linea.nombre} 
          </div>
          <div class="col-6">
            <span class="badge bg-dark-subtle text-dark rounded-pill">${"(M) " + linea.meta + "%"}</span>
            <span class="badge bg-secondary text-white rounded-pill">${"(A) " + linea.avance + "%"}</span>
          </div>
        </div>
        `
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

function backupData() {
    const a = document.createElement("a");
    const archivo = new Blob([ActiveProyect.convertToJSON()], { type: 'text/plain' });
    const url = URL.createObjectURL(archivo);
    a.href = url;

    const date = new Date();

    let day = date.getDate()
    a.download = 'Vigencia' + ActiveProyect.vigencia + date.getDate() + ".json";
    a.click();
    URL.revokeObjectURL(url);
}
