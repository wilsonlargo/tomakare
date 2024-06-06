//Modulo que administra los proyectos y la construcción de los objetos visibles

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
                areaNew.cslNotas = loadNotas(Areas.cslNotas);
                return areaNew;
            })
        }

        const loadNotas = (fromClsNotas) => {
            return fromClsNotas.map(nota => {
                const notaNew = new Notas(
                    nota.tema,
                    nota.comentario,
                    nota.estado,
                    nota.referencia,
                    nota.fecha,
                    nota.modificado,
                    nota.autor,
                    nota.respuesta,
                    nota.modificadopor,
                    nota.id,
                    nota.parent
                );
                return notaNew;
            });
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
                    gestion.aclaraciones,
                    gestion.id,
                    ProgramaNew);
                GestionNew.clsEspecificos = loadEspecificos(gestion.clsEspecificos);
                GestionNew.cslArticulacionPrj = loadArticulacionPrj(gestion.cslArticulacionPrj);
                return GestionNew;
            });
        }

        const loadArticulacionPrj = (fromArticulacionPrj) => {

            return fromArticulacionPrj.map(articulacion => {
                const newArticulacionPrj = new ArticulacionPrj(
                    articulacion.consejeria,
                    articulacion.mandatos,
                    articulacion.id,
                );
                return newArticulacionPrj;
            })

        }


        const loadEspecificos = (fromClsEspecificos) => {

            return fromClsEspecificos.map(especifico => {
                const newEspecifico = new oespecificos(
                    especifico.nombre,
                    especifico.meta,
                    especifico.avance,
                    especifico.id,
                    especifico.parent);
                return newEspecifico;
            })

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
            component.className = "w-100"
            component.innerHTML = `
                <a href="#" class="nav-link px-0 text-white item-panel fw-bold" id="${"btnArea" + area.id}">
                     ${area.id + 1}.
                    <span class="d-none d-sm-inline text-white fw-normal" id="${"btnArealabel" + area.id}">
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
        ContConsejerias.className = "col-sm-12 col-md-6 col-lg-4 col-xl-2 border border-1 m-2 shadow rounded mt-2"
        ContConsejerias.innerHTML = `
                 <p class="text-secondary tex-org-big-gris">${this.clsAreas.length}</p>
                 <a href="#" class="nav-link text-center text-foot-foto bg-secondary text-white p-2" id="contador-areas">
                 CONSEJERÍAS
                </a>
                </p>
                `
        ContContadores.appendChild(ContConsejerias)



        //Agregar contadores por vigencia
        const ContLineas = document.createElement("div")
        ContLineas.className = "col-sm-12 col-md-6 col-lg-4 col-xl-2 border border-1 m-2 shadow rounded mt-2"
        ContLineas.innerHTML = `
                         <p class="text-secondary tex-org-big-gris">${contadorLineas}</p>
                         <a href="#" class="nav-link text-center text-foot-foto bg-secondary text-white p-2">
                         LÍNEAS
                        </a>
                        </p>
                        `
        ContContadores.appendChild(ContLineas)

        //Agregar contadores por vigencia
        const ContProgramas = document.createElement("div")
        ContProgramas.className = "col-sm-12 col-md-6 col-lg-4 col-xl-2 border border-1 m-2 shadow rounded mt-2"
        ContProgramas.innerHTML = `
                                 <p class="text-secondary tex-org-big-gris">${contadorPrograma}</p>
                                 <a href="#" class="nav-link text-center text-foot-foto bg-secondary text-white p-2">
                                     PROGRAMAS
                                    </a>
                                </p>
                                `
        ContContadores.appendChild(ContProgramas)


        //Agregar contadores por vigencia
        const Contvigencias = document.createElement("div")
        Contvigencias.className = "col-sm-12 col-md-6 col-lg-4 col-xl-2 border border-1 m-2 shadow rounded mt-2"
        Contvigencias.innerHTML = `
            <p class="text-secondary tex-org-big-gris">${contadorProyectos}</p>
                <a href="#" class="nav-link text-center text-foot-foto bg-secondary text-white p-2" id="contador-gestiones">
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
        this.cslNotas = [];

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

    addNota(Nota) {
        this.cslNotas.push(Nota);
        //Ver en la función independiente como se agregan las notas
        // function agregar_nota_consultor()
    }
    deleteNota(id) {
        this.cslNotas.splice(id, 1);
    }


    makerHtmlAreasItem() {
        document.getElementById("conteneder-bar-proyectos").hidden = true
        document.getElementById("panel-inicio").hidden = true
        const cEscritorio = document.getElementById("panel-escritorio")
        cEscritorio.innerHTML = ''

        //Colocamos el t+itulo de la consejería
        const Título = document.createElement('div');
        Título.className = "mb-1 bg-secondary text-white p-2 fw-bold sticky-top"
        Título.style.fontSize = "16px"

        Título.textContent = this.nombre
        cEscritorio.appendChild(Título)

        //Barra de navegación que me lleva al parametrizador
        const barraNavegar = document.getElementById("navbarplan")
        barraNavegar.innerHTML = `
        <a class="col-auto nav-link m-2" href="#">PANEL CONSEJERÍA / </a>
        <a class="col-auto nav-link m-2" href="#" id="lnkVisor"> <i class="bi bi-eyeglasses me-2"></i>Visor / </a>
        <a class="col-auto nav-link m-2" data-bs-toggle="offcanvas" href="#offcanvasNotas" role="button"
            aria-controls="offcanvasExample" id="linkNotas">
            <i class="bi bi-sticky me-2"></i> Notas
        </a>
        `
        const linkVisor = document.getElementById("lnkVisor")
        linkVisor.onclick = () => {
            parametrizador(this)
        }
        const linkNotas = document.getElementById("linkNotas")
        linkNotas.onclick = () => {
            //Asigna la función onclick al botón para relacionarlo con el área actual
            document.getElementById("btnAgregarNotaConsultor").onclick = () => {
                agregar_nota_consultor(this, `${this.id}`)
            }
            //Carga las notas del área activa
            cargar_notas_consultor(this)
        }
        //========================================================

        let labelFree = document.createElement("div")
        labelFree.className = "labelorg-orange-light text-secondary border border-1 border-warning"
        labelFree.textContent = "Nombre del área"
        document.getElementById("panel-escritorio").appendChild(labelFree)

        const intNomArea = document.createElement("input")
        intNomArea.className = "form-control mb-2 ms-2"
        document.getElementById("panel-escritorio").appendChild(intNomArea)

        intNomArea.addEventListener('input', () => {
            this.nombre = intNomArea.value
            const btAreaLabel = document.getElementById("btnArealabel" + this.id)
            btAreaLabel.textContent = intNomArea.value
            Título.textContent = intNomArea.value
            GuardarVigencia()
        });
        intNomArea.value = this.nombre;
        //========================================================


        //Input administrador de área
        let labelFree2 = document.createElement("div")
        labelFree2.className = "labelorg-orange-light text-secondary border border-1 border-warning"
        labelFree2.textContent = "Administrador del área o administrador"
        document.getElementById("panel-escritorio").appendChild(labelFree2)

        const intAdminArea = document.createElement("input")
        intAdminArea.className = "form-control mb-2 ms-2"
        document.getElementById("panel-escritorio").appendChild(intAdminArea)
        //Configuramos el control de entrada para que se actualice, con un metodo oninput
        intAdminArea.addEventListener('input', () => {
            this.administrador = intAdminArea.value
            GuardarVigencia()
        });
        intAdminArea.value = this.administrador;


        //Input pueblo de área
        let labelFree3 = document.createElement("div")
        labelFree3.className = "labelorg-orange-light text-secondary border border-1 border-warning"
        labelFree3.textContent = "Pueblo mandatario"
        document.getElementById("panel-escritorio").appendChild(labelFree3)

        const intPuebloArea = document.createElement("input")
        intPuebloArea.className = "form-control mb-2 ms-2"
        document.getElementById("panel-escritorio").appendChild(intPuebloArea)
        //Configuramos el control de entrada para que se actualice, con un metodo oninput
        intPuebloArea.addEventListener('input', () => {
            this.pueblo = intPuebloArea.value
            GuardarVigencia()
        });
        intPuebloArea.value = this.pueblo;


        //Creamos ahora los input, detalle
        let labelFree4 = document.createElement("div")
        labelFree4.className = "labelorg-orange-light text-secondary border border-1 border-warning"
        labelFree4.textContent = "Descripción del área"
        document.getElementById("panel-escritorio").appendChild(labelFree4)


        const intDetArea = document.createElement("textarea")
        intDetArea.className = "form-control mb-2 ms-2 mb-3"
        intDetArea.rows = 5
        document.getElementById("panel-escritorio").appendChild(intDetArea)
        //Configuramos el control de entrada para que se actualice, con un metodo oninput
        intDetArea.addEventListener('input', () => {
            this.detalle = intDetArea.value
            GuardarVigencia()
        });
        intDetArea.value = this.detalle;


        //Input funciones
        let labelFree5 = document.createElement("div")
        labelFree5.className = "labelorg-orange-light text-secondary border border-1 border-warning"
        labelFree5.textContent = "Funciones del área/consejería"
        document.getElementById("panel-escritorio").appendChild(labelFree5)

        const intFuntionsArea = document.createElement("textarea")
        intFuntionsArea.className = "form-control mb-2 ms-2 mb-3"
        intFuntionsArea.rows = 5
        document.getElementById("panel-escritorio").appendChild(intFuntionsArea)
        //Configuramos el control de entrada para que se actualice, con un metodo oninput
        intFuntionsArea.addEventListener('input', () => {
            this.funciones = intFuntionsArea.value
            GuardarVigencia()
        });
        intFuntionsArea.value = this.funciones;

        //Sección medidor de avance
        //Identificamos cuantos lineas hay y sumamos esos valores
        //Se agrega un enlace para ver el parametrizador
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

        //Muestra un indicador de avance
        const indicadorAvance = document.createElement("div")
        indicadorAvance.className = "p-2 ms-2 mb-3 bg-secondary text-white"
        indicadorAvance.style.width = "100px"
        indicadorAvance.innerHTML = `
                <p class="text-center fs-3">${avance}%</p>
                <a class=" border border-1 border-white nav-link active text-center ${colorAvance} ${colorAvanceTexto} P-2" aria-current="page" href="#" id="lbParametrizador">AVANCE</a>
        `
        cEscritorio.appendChild(indicadorAvance)

        //Llama a la función para parametrizar con acceder a la palabra avance
        document.getElementById("lbParametrizador").onclick = () => {
            parametrizador(this)
        }
        //*********************************************************/
        //*********************************************************/

        //Aquí se crea uan pestaña collapse para mostrar lso mandatos
        const collapseMandatos = document.createElement("div")
        collapseMandatos.innerHTML = `
            <a class="nav-link mb-2 collapse-org bg-warning bg-gradient shadow-sm" 
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
        //=========================================================
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

        //Contenedor de lineas
        const collapseLineas = document.createElement("div")
        collapseLineas.innerHTML = `
            <a class="nav-link mb-2 collapse-org bg-info bg-gradient shadow-sm" 
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
        const collapseArticulacion = HTML.collapseControl1(
            "Articulación de Consejerías",
            "cArticulacionCollapse",
            "articulacion",
            "bi-arrow-left-right",
            "text-white collapse-org bg-secondary bg-gradient shadow-sm")
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

            articulacion.id = art++
            articulacion.parentId = this
            articulacion.makerHtmlArticulacion(articulacion);
        })



        //Collapse para libreria / versión simplificada
        const collapseLibros = HTML.collapseControl1("Librería / Anexos", "cLibreriaCollapse", "libreria",
            "bi-journals", "text-white collapse-org bg-primary bg-gradient shadow-sm mt-2")
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

            libro.id = doc++
            libro.parentId = this
            libro.makerHtmlLibro(libro);
        })


        //=============================================================
        //=====ESTA ES LA SECCIÓN PARA CREAR LÍNEAS DE ACCIÓN
        //Agrega un comando al boton que agrega lineas
        //con esto identifica en que área está y agrega un indice
        const btAgregarLinea = document.createElement("button")
        btAgregarLinea.className = "btn btn-outline-secondary m-1"
        btAgregarLinea.innerHTML = `<i class="bi bi-plus"></i> Agregar línea`

        btAgregarLinea.onclick = () => {
            //Activa la función independiente de agregar línea, y la vincula con el área actual
            AgregarLinea(this)
        }

        document.getElementById("divLineasbutton").appendChild(btAgregarLinea)

        //Identificamos en que área estamos pos su id
        const AreaActiva = parent

        //buscamos y Limpiamos el contenedor collapse de las líneas
        const cLineas = document.getElementById("divLineascollapse")
        cLineas.innerHTML = '';

        let l = 0;
        this.cslLineas.forEach(linea => {
            linea.id = l++
            linea.parent = this
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

class Notas {
    constructor(tema, comentario, estado, referencia, fecha, modificado, autor, respuesta, modificadopor, id, dominio) {
        this.tema = tema;
        this.comentario = comentario;
        this.estado = estado;
        this.referencia = referencia;
        this.fecha = fecha;
        this.modificado = modificado;
        this.autor = autor;
        this.respuesta = respuesta;
        this.modificadopor = modificadopor;
        this.id = id
        this.parent = dominio
    }
    makerHtmlNotas(dominio) {
        //Establecemos una variable fecha para actualzar la fecha de la nota
        let now = new Date().toLocaleString()
        const colorNota = [
            {
                "estado": "Sin resolver",
                "color": "gray"
            },
            {
                "estado": "Sin resolver",
                "color": "orange"
            },
            {
                "estado": "Con respuesta",
                "color": "purple"
            },
            {
                "estado": "Resuelto",
                "color": "green"
            },
        ]

        //Creamos un elemento li que contendrá toda la info de la nota
        const itemli = document.createElement("li")
        itemli.className = "list-group-item d-flex justify-content-between align-items-start bg-warning-subtle mb-2"
        //Lo agregamos al contenedor de notas
        const lstNotas = document.getElementById("lstNotasConsultor")
        lstNotas.appendChild(itemli)
        //Creamos un contenedor base
        const divAux = document.createElement("div")
        divAux.className = "me-auto"
        //Lo agregamos al contenedor li
        itemli.appendChild(divAux)
        //Creamos el div título de la nota
        //Se actualzia dinamicamente y permite abrir el collapse nota
        const divtitulo = document.createElement("div")
        divtitulo.className = "fw-bold"
        divtitulo.innerHTML = `
        <a class="nav-link" data-bs-toggle="collapse" href="#collapseNota${this.id}" role="button"
            aria-expanded="false" aria-controls="collapseNota${this.id}"
            id="lbTituloNota${this.id}">
            ${this.tema}
        </a>
        `
        //Lo agregamos al contenedor div auxiliar
        divAux.appendChild(divtitulo)

        //Creamos un collapse contenedor de elementos de la nota
        const divCollapse = document.createElement("div")
        divCollapse.className = "collapse"
        divCollapse.style.width = "300px"
        divCollapse.id = "collapseNota" + this.id
        //Lo agregamos al contenedor div auxiliar
        divAux.appendChild(divCollapse)

        //Iniciamos a crear la info de la nota
        //Entrada de tema de la nota
        const sm1 = document.createElement("small")
        sm1.className = "fw-bold text-secondary"
        sm1.textContent = "Tema de la nota"
        //Lo agregamos al contenedor collapse
        divCollapse.appendChild(sm1)

        const intTemaNota = document.createElement("input")
        intTemaNota.className = "form-control bg-warning-subtle mb-2"
        intTemaNota.type = "text"
        intTemaNota.placeholder = "Tema"
        intTemaNota.id = "intTema" + this.id
        //Lo agregamos al contenedor collapse
        divCollapse.appendChild(intTemaNota)
        //Configuramos sus acciones
        intTemaNota.oninput = () => {
            this.tema = intTemaNota.value
            //Actualzia también el título d ela nota
            document.getElementById("lbTituloNota" + this.id).textContent = intTemaNota.value
            lbFechamodificado.textContent = "Modificado el :" + now
            lbModificador.textContent = "Modificado por: " + activeEmail
            this.modificado = now
            GuardarVigencia()
        }
        intTemaNota.value = this.tema

        const sm2 = document.createElement("small")
        sm2.className = "fw-bold text-secondary"
        sm2.textContent = "Comentario"
        //Lo agregamos al contenedor collapse
        divCollapse.appendChild(sm2)

        const intComentarioNota = document.createElement("textarea")
        intComentarioNota.className = "form-control bg-warning-subtle mb-2"
        intComentarioNota.placeholder = "Comentario"
        intComentarioNota.id = "intComentario" + this.id
        //Lo agregamos al contenedor collapse
        divCollapse.appendChild(intComentarioNota)
        //Configuramos sus acciones
        intComentarioNota.oninput = () => {
            this.comentario = intComentarioNota.value
            //Actualzia también el título d ela nota
            lbFechamodificado.textContent = "Modificado el :" + now
            lbModificador.textContent = "Modificado por: " + activeEmail
            this.modificado = now
            GuardarVigencia()
        }
        intComentarioNota.value = this.comentario

        //Creamos un contenedor de respuesta a la nota
        const intRespuestNota = document.createElement("textarea")
        intRespuestNota.className = "form-control bg-warning-subtle mb-2"
        intRespuestNota.placeholder = "Respuesta"
        intRespuestNota.id = "intRespuesta" + this.id
        //Lo agregamos al contenedor collapse
        divCollapse.appendChild(intRespuestNota)
        //Configuramos sus acciones
        intRespuestNota.oninput = () => {
            this.respuesta = intRespuestNota.value
            //Actualzia también el título d ela nota
            lbFechamodificado.textContent = "Modificado el :" + now
            lbModificador.textContent = "Modificado por: " + activeEmail
            this.modificado = now
            GuardarVigencia()
        }
        intRespuestNota.value = this.respuesta

        const sm3 = document.createElement("small")
        sm3.className = "fw-bold text-secondary"
        sm3.textContent = "Estado"
        //Lo agregamos al contenedor collapse
        divCollapse.appendChild(sm3)

        //Creamos un selector de opciones
        const selEstado = document.createElement("select")
        selEstado.className = "form-select mb-3"
        selEstado.ariaLabel = "Default select example"
        selEstado.innerHTML = `
        <option value="1">Sin resolver</option>
        <option value="2">Con respuesta</option>
        <option value="3">Resuelto</option>
        `
        //Configuramos la acción del selector
        divCollapse.appendChild(selEstado)
        selEstado.onchange = () => {
            this.estado = selEstado.value
            lbFechamodificado.textContent = "Modificado el :" + now
            lbModificador.textContent = "Modificado por: " + activeEmail
            this.modificado = now
            span.style.background = colorNota[parseInt(this.estado)].color
            span.textContent = colorNota[parseInt(this.estado)].estado
            GuardarVigencia()
        }
        selEstado.value = this.estado

        //Agregar un enlace a la referencia
        const linkReferencia = document.createElement("a")
        linkReferencia.className = "nav-link mb-3 text-primary"
        linkReferencia.role = "button"
        linkReferencia.textContent = "Ir a referencia"
        linkReferencia.onclick = () => {

            this.openreferencia(this.referencia)
        }
        divCollapse.appendChild(linkReferencia)

        //Mostramos la fecha de creación de la nota
        const lbFechacreado = document.createElement("div")
        lbFechacreado.className = "text-end"
        lbFechacreado.style.fontSize = "10pt"
        lbFechacreado.textContent = "Creado el: " + this.fecha
        divCollapse.appendChild(lbFechacreado)

        //Mostramos la fecha de creación de la nota
        const lbFechamodificado = document.createElement("div")
        lbFechamodificado.className = "text-end text-success"
        lbFechamodificado.style.fontSize = "10pt"
        lbFechamodificado.textContent = "Modificado el: " + this.modificado
        divCollapse.appendChild(lbFechamodificado)


        //Mostramos quién crea la nota
        const lbAutor = document.createElement("div")
        lbAutor.style.fontSize = "10pt"
        lbAutor.className = "text-secondary"
        lbAutor.textContent = "Creado por : " + this.autor
        divCollapse.appendChild(lbAutor)

        //Mostramos quién modifica
        const lbModificador = document.createElement("div")
        lbModificador.style.fontSize = "10pt"
        lbModificador.className = "text-success"
        lbModificador.textContent = "Modificado por : " + this.modificadopor
        divCollapse.appendChild(lbModificador)

        //Crear el botón eliminar nota
        const btBorrar = document.createElement("button")
        btBorrar.className = "btn btn-outline-secondary mt-3"
        btBorrar.type = "button"
        btBorrar.innerHTML = `<i class="bi bi-trash3 me-2"></i> Eliminar nota`
        btBorrar.onclick = () => {
            this.parent.deleteNota(this.id)
            cargar_notas_consultor(this.parent)

        }
        divCollapse.appendChild(btBorrar)

        //Crear un elemento span para mostrar color avance
        const span = document.createElement("span")
        span.className = "badge rounded-pill"
        span.style.background = colorNota[parseInt(this.estado)].color
        span.textContent = colorNota[parseInt(this.estado)].estado
        itemli.appendChild(span)

    }

    openreferencia(referencia) {
        const conNivel = referencia.split("-")

        if (conNivel.length == 1) {
            const open = ActiveProyect.clsAreas[parseInt(conNivel[0])]
            open.makerHtmlAreasItem()
        } else if (conNivel.length == 2) {
            const open = ActiveProyect
                .clsAreas[parseInt(conNivel[0])]
                .cslLineas[parseInt(conNivel[1])]
            open.makerHTMLLineaPanel()
        }
        else if (conNivel.length == 3) {
            const open = ActiveProyect
                .clsAreas[parseInt(conNivel[0])]
                .cslLineas[parseInt(conNivel[1])]
                .clsPrograma[parseInt(conNivel[2])]
            open.makerHTMLProgramaPanel(
                ActiveProyect.clsAreas[parseInt(conNivel[0])],
                ActiveProyect.clsAreas[parseInt(conNivel[0])].cslLineas[parseInt(conNivel[1])]
            )
        } else if (conNivel.length == 4) {
            const open = ActiveProyect
                .clsAreas[parseInt(conNivel[0])]
                .cslLineas[parseInt(conNivel[1])]
                .clsPrograma[parseInt(conNivel[2])]
                .clsGestion[parseInt(conNivel[3])]
            open.makerHTMLProyeccion(
                ActiveProyect.clsAreas[parseInt(conNivel[0])],
                ActiveProyect.clsAreas[parseInt(conNivel[0])].cslLineas[parseInt(conNivel[1])],
                ActiveProyect.clsAreas[parseInt(conNivel[0])].cslLineas[parseInt(conNivel[1])]
                    .clsPrograma[parseInt(conNivel[2])]
            )
        }

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
        const cMandato = document.createElement("div")
        cMandato.className = "input-group mb-2"
        cMandato.innerHTML = `
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
    constructor(nombre, descripcion, meta, avance, id, dominio) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.meta = meta;
        this.avance = avance;
        this.id = id;
        this.parent = dominio;
        this.clsPrograma = []
    }

    addPrograma(Programa) {
        this.clsPrograma.push(Programa);
    }
    deletePrograma(id) {
        this.clsPrograma.splice(id, 1);
    }


    makerHTMLLineaPanel() {
        document.getElementById("conteneder-bar-proyectos").hidden = true
        const cEscritorio = document.getElementById("panel-escritorio")
        cEscritorio.innerHTML = ''

        //Colocamos el título de la consejería
        const Título = document.createElement('div');
        Título.className = "ps-2 bg-secondary text-white fw-bold"
        Título.style.fontSize = "16px"
        Título.textContent = this.parent.nombre
        cEscritorio.appendChild(Título)

        //Colocamos el título de la línea
        const Título2 = document.createElement('div');
        Título2.className = "pe-2 pb-2 bg-secondary text-warning fw-medium text-end border-top border-1 border-white sticky-top"
        Título2.style.fontSize = "14px"
        Título2.textContent = this.nombre
        cEscritorio.appendChild(Título2)

        //Barra navegación superior
        const barraNavegar = document.getElementById("navbarplan")
        barraNavegar.innerHTML = `
            <a class="col-auto nav-link m-2 fw-bold" href="#" href="#">PANEL LÍNEAS / </a>
            <a class="col-auto nav-link m-2" href="#" id="lnkArea">Area / </a>
            <a class="col-auto nav-link m-2" href="#" id="lnkVisor"> <i class="bi bi-eyeglasses me-2"></i>Visor / </a>
            <a class="col-auto nav-link m-2" data-bs-toggle="offcanvas" href="#offcanvasNotas" role="button"
                aria-controls="offcanvasExample" id="linkNotas">
                <i class="bi bi-sticky me-2"></i> Notas
            </a>
    

        `
        const linkArea = document.getElementById("lnkArea")
        linkArea.onclick = () => {
            this.parent.makerHtmlAreasItem()
        }

        const linkVisor = document.getElementById("lnkVisor")
        linkVisor.onclick = () => {
            parametrizador(this.parent)
        }
        const linkNotas = document.getElementById("linkNotas")
        linkNotas.onclick = () => {
            //Asigna la función onclick al botón para relacionarlo con el área actual
            document.getElementById("btnAgregarNotaConsultor").onclick = () => {
                agregar_nota_consultor(this.parent, `${this.parent.id}-${this.id}`)
            }
            //Carga las notas del área activa
            cargar_notas_consultor(this.parent)
        }

        //===============================================


        //Entrada del nombre de la línea
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
        //============================================


        //Entrada descripción de la línea
        const inputText = HTML.inputTextArea2(this.id, "Descripción de la línea", 'InputTextLinea')
        cEscritorio.appendChild(inputText)

        const refDescripLinea = document.getElementById(this.id + "InputTextLinea")
        refDescripLinea.addEventListener('input', () => {
            this.descripcion = refDescripLinea.value
            GuardarVigencia()
        });
        refDescripLinea.value = this.descripcion;
        //============================================


        //Entrada Porcentaje en el área, valor numérico
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
        //=========================================================


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
                <a class="nav-link active text-center ${colorAvance} ${colorAvanceTexto} P-2" aria-current="page" href="#" id="lbParametrizador">AVANCE</a>
        `
        cEscritorio.appendChild(indicadorAvance)

        //Llama a la función para parametrizar
        document.getElementById("lbParametrizador").onclick = () => {
            parametrizador(this.parent)
        }
        //*********************************************************/
        //*********************************************************/

        //Sección de lista de programas
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

            //Muestro de nuevo los programas y limpio el contenedor de programas
            const cProgramas = document.getElementById("lstProgramas")
            cProgramas.innerHTML = '';
            let p = 0;
            this.clsPrograma.forEach(programa => {
                programa.id = p++
                programa.parent = this
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
                    programa.makerHTMLProgramaPanel(this.parent, this)
                }
            })
        }

        cEscritorio.appendChild(btAgregarPrograma)


        //Agregar listador de programas
        const listProgramas = document.createElement("div")
        listProgramas.className = "list-group m-3"
        listProgramas.id = "lstProgramas"
        cEscritorio.appendChild(listProgramas)


        //Verifica todos los programas que hay por linea y los agrega
        const cProgramas = document.getElementById("lstProgramas")
        cProgramas.innerHTML = '';
        let p = 0;
        this.clsPrograma.forEach(programa => {
            programa.id = p++
            programa.parent = this.parent
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
                programa.makerHTMLProgramaPanel(this.parent, this)
            }
        })

        //Agregamos un boton borrar programa
        const btnBorrarLinea = document.createElement("button")
        btnBorrarLinea.className = "btn btn-outline-danger mt-5 m-1"
        btnBorrarLinea.innerHTML = `<i class="bi bi-trash3"></i> Eliminar línea`

        btnBorrarLinea.onclick = () => {
            modal.modalDelete(
                () => {
                    this.parent.deleteLinea(this.id)
                    GuardarVigencia()
                    this.parent.makerHtmlAreasItem()
                }
            )

        }
        cEscritorio.appendChild(btnBorrarLinea)
        //===========================================

        //Agregamos un boton retornar
        const btnretroceder = document.createElement("button")
        btnretroceder.className = "btn btn-outline-secondary mt-5 m-1"
        btnretroceder.innerHTML = `<i class="bi bi-arrow-return-left"></i> Volver`

        btnretroceder.onclick = () => {
            this.parent.makerHtmlAreasItem()
        }
        cEscritorio.appendChild(btnretroceder)
        //=============================

    }


}
class Programa {
    constructor(nombre, descripcion, avance, meta, id, dominio) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.avance = avance;
        this.meta = meta;
        this.id = id;
        this.parent = dominio;
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
        Título.className = "ps-2 bg-secondary text-white fw-bold"
        Título.style.fontSize = "18px"
        Título.textContent = this.parent.nombre
        cEscritorio.appendChild(Título)

        //Colocamos el título de la línea
        const Título2 = document.createElement('div');
        Título2.className = "ps-2 bg-secondary text-warning fw-medium"
        Título2.style.fontSize = "16px"
        Título2.textContent = this.nombre
        cEscritorio.appendChild(Título2)

        //Colocamos el título del programa
        const Título3 = document.createElement('div');
        Título3.className = "pe-4 pb-2 bg-secondary text-info text-end border border-top border-1 border-white sticky-top"
        Título3.style.fontSize = "16px"
        Título3.textContent = this.nombre
        cEscritorio.appendChild(Título3)

        //Creamos barra de navegación herarquica
        const barraNavegar = document.getElementById("navbarplan")
        barraNavegar.innerHTML = `
            <a class="col-auto nav-link m-2 fw-bold" href="#" href="#">PANEL PROGRAMAS / </a>
            <a class="col-auto nav-link m-2" href="#" id="lnkArea" hiden="true">Area / </a>
            <a class="col-auto nav-link m-2" href="#" id="lnkLinea">Linea / </a>
            <a class="col-auto nav-link m-2" href="#" id="lnkVisor"> <i class="bi bi-eyeglasses me-2"></i>Visor / </a>
            <a class="col-auto nav-link m-2" data-bs-toggle="offcanvas" href="#offcanvasNotas" role="button"
                aria-controls="offcanvasExample" id="linkNotas">
                <i class="bi bi-sticky me-2"></i> Notas
            </a>
        `
        //Cada botón me regresa a un ivel superior
        const linkArea = document.getElementById("lnkArea")
        linkArea.onclick = () => {
            area.makerHtmlAreasItem()
        }

        const linkLinea = document.getElementById("lnkLinea")
        linkLinea.onclick = () => {
            linea.parent = area
            linea.makerHTMLLineaPanel()
        }
        const linkVisor = document.getElementById("lnkVisor")
        linkVisor.onclick = () => {
            parametrizador(area)
        }

        const linkNotas = document.getElementById("linkNotas")
        linkNotas.onclick = () => {
            //Asigna la función onclick al botón para relacionarlo con el área actual
            document.getElementById("btnAgregarNotaConsultor").onclick = () => {
                agregar_nota_consultor(area, `${this.id}-${linea.id}-${this.id}`)
            }
            //Carga las notas del área activa
            cargar_notas_consultor(area)
        }

        //===================================================


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

        //Detalle del programa
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
                 <a class="nav-link active text-center ${colorAvance} ${colorAvanceTexto} P-2" aria-current="page" href="#" id="lbParametrizador">AVANCE</a>

        `

        cEscritorio.appendChild(indicadorAvance)

        //Llama a la función para parametrizar
        document.getElementById("lbParametrizador").onclick = () => {
            parametrizador(area)
        }
        //*********************************************************/
        //*********************************************************/


        //Se crea una sección para listar los proyectos
        const Título4 = document.createElement('div');
        Título4.className = "fs-4 text-secondary border-bottom border-4"
        Título4.textContent = "Proyectos"
        cEscritorio.appendChild(Título4)

        //Agregar botton añadir proyectos
        const btAgregarGestion = document.createElement("button")
        btAgregarGestion.className = "btn btn-outline-secondary m-1"
        btAgregarGestion.innerHTML = `<i class="bi bi-plus"></i> Agregar proyecto`

        btAgregarGestion.onclick = () => {
            const gestion = new Gestion('Nueva proyección', "Objetivo general", "Mandato en relación", "Administrador", false, "", 0, 0, 0, "", 0, this)
            this.addGestion(gestion)
            GuardarVigencia()

            document.getElementById("lstProyectos").innerHTML = ""
            let g = 0;
            this.clsGestion.forEach(gestion => {
                gestion.id = g++
                gestion.parent = this
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
                    gestion.makerHTMLProyeccion(area, linea, this)
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
            gestion.parent = this
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
                gestion.makerHTMLProyeccion(area, linea, this)
            }
        })


        //Agregamos un boton borrar programa
        const btnBorrarPrograma = document.createElement("button")
        btnBorrarPrograma.className = "btn btn-outline-danger mt-5 m-1"
        btnBorrarPrograma.innerHTML = `<i class="bi bi-trash3"></i> Eliminar programa`

        btnBorrarPrograma.onclick = () => {
            modal.modalDelete(
                () => {
                    linea.deletePrograma(this.id)
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
            linea.parent = area
            linea.makerHTMLLineaPanel()
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
    document.getElementById("navbarplan").innerHTML = ""
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

                document.getElementById("btnVig" + vigencia.id).onclick = () => {
                    cargarProyectos()
                    showVigencia(vigencia)
                }

            });

        }
    } catch (error) {
        console.log(error)
    }



}

async function showVigencia(vigencia) {
    document.getElementById("navbarplan").innerHTML = ""
    cargarProyectos()
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

async function AgregarLinea(dominio) {
    //Identificamos en que área estamos pos su id
    const AreaActiva = dominio

    //Creamos una nueva línea de acción dentro de la clase Area
    const linea = new Linea('Nueva linea', 'Descripción de la línea', 0, 0, this.length, dominio);
    AreaActiva.addLinea(linea)

    //Busca el contenedor collapse donde se colocan las líneas y lo limpia
    const cLineas = document.getElementById("divLineascollapse")
    cLineas.innerHTML = '';

    //Contador de líneas
    let l = 0;
    //Por cada clae línea en el área, realizar
    AreaActiva.cslLineas.forEach(linea => {
        linea.id = l++
        linea.parent = dominio
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
    document.getElementById("navbarplan").innerHTML = ""
    document.getElementById("conteneder-bar-proyectos").hidden = true
    document.getElementById("panel-inicio").hidden = false
    document.getElementById("panel-escritorio").innerHTML = ""

}
function agregar_nota_consultor(dominio, referencia) {
    //Referenciamos el contenedor de notas y lo limpiamos
    const lstNotas = document.getElementById("lstNotasConsultor")
    lstNotas.innerHTML = ""

    //Creamos uan nota con base a la clase notas
    const AreaActiva = dominio

    //Creamos una nueva línea de acción dentro de la clase Area
    let now = new Date().toLocaleString()
    const nota = new Notas(
        'Tema',
        'Comentario',
        "1",
        referencia,
        now,
        now,
        activeEmail,
        "",
        activeEmail,
        0,
        AreaActiva);
    AreaActiva.addNota(nota)
    let n = 0
    AreaActiva.cslNotas.forEach(nota => {
        nota.id = n++
        nota.parent = AreaActiva
        nota.makerHtmlNotas()
        GuardarVigencia()
    })

}
function cargar_notas_consultor(dominio) {
    //Referenciamos el contenedor de notas y lo limpiamos
    const lstNotas = document.getElementById("lstNotasConsultor")
    lstNotas.innerHTML = ""

    const AreaActiva = dominio
    let n = 0
    AreaActiva.cslNotas.forEach(nota => {
        nota.id = n++
        nota.parent = dominio
        nota.makerHtmlNotas()
    })

}

function parametrizador(area) {
    document.getElementById("navbarplan").innerHTML = ""
    const cEscritorio = document.getElementById("panel-escritorio")
    cEscritorio.innerHTML = ""

    //Colocamos el ttulo de la consejería
    const Título = document.createElement('div');
    Título.className = "ps-2 bg-secondary text-white fw-bold"
    Título.style.fontSize = "18px"
    Título.textContent = area.nombre
    cEscritorio.appendChild(Título)

    const Título2 = document.createElement('div');
    Título2.className = "ps-2 bg-secondary text-warning fw-medium pb-3"
    Título2.style.fontSize = "16px"
    Título2.textContent = "Esquema general de la consejería, indicadores y avances"
    cEscritorio.appendChild(Título2)


    //Creamos el inicio de la tabla
    const tabla = document.createElement("tabla")
    tabla.className = "table-striped"
    cEscritorio.appendChild(tabla)
    const tbody = document.createElement("tbody")
    tabla.appendChild(tbody)



    area.cslLineas.forEach(linea => {
        //Analizamos cuántas líneas hay por consejería
        //Cada línea será una fila de la tabla
        const tr_linea = document.createElement("tr")

        const td_linea = document.createElement("td")
        td_linea.appendChild(_put_Linea(linea))
        tr_linea.appendChild(td_linea)

        const td_program = document.createElement("td")
        tr_linea.appendChild(td_program)


        linea.clsPrograma.forEach(programa => {
            const tr_programas = document.createElement("tr")
            td_program.appendChild(tr_programas)

            const td_programa = document.createElement("td")
            td_programa.appendChild(_put_Programa(linea,programa))

            tr_programas.appendChild(td_programa)

            programa.clsGestion.forEach(gestion => {
                const tr_gestion = document.createElement("tr")
                tr_programas.appendChild(tr_gestion)
                const td_gestion = document.createElement("td")
                td_gestion.appendChild(_put_Gestion(linea,programa,gestion))
                tr_gestion.appendChild(td_gestion)


            })

        })
        tbody.appendChild(tr_linea)

    })

    function _put_Linea(linea) {
        const td = document.createElement("div")
        td.className = "item-schema bg-info border-primary shadow-sm"
        td.innerHTML =
            `
        <div class="row text-white align-items-center">
            <div class="col-auto fw-bold fs-4">
                ${linea.id + 1}.
            </div>
            <div class="col" id="cOpenLinea${linea.id}">
                ${linea.nombre}
            </div>
        </div>
        <div class="row text-white align-items-center">
            <div class="col fw-bold text-end">
                Meta
            </div>
            <div class="col fw-bold">
            <input type="text" class="form-control" id="inAvanceLinea${linea.id}" value="${linea.meta}">
            </div>      
        </div>
        <div class="row text-white align-items-center">
            <div class="col fw-bold text-end">
                Avance
            </div>
            <div class="col fs-6">
                ${linea.avance}%
            </div>      
        </div>
        `


        return td
    }
    function _put_Programa(linea,programa) {
        const td = document.createElement("div")
        td.className = "item-schema border-warning bg-warning-subtle shadow-sm"

        td.innerHTML =
            `
            <div class="row text-secondary align-items-center">
                <div class="col-auto fw-bold fs-4">
                    ${programa.id + 1}.
                </div>
                <div class="col" id="cOpenPrograma${linea.id}${programa.id}">
                    ${programa.nombre}
                </div>
            </div>
            <div class="row text-secondary align-items-center">
                <div class="col fw-bold text-end">
                    Meta
                </div>
                <div class="col fw-bold">
                <input type="text" class="form-control" id="inMetaPrograma${linea.id}${programa.id}" value="${programa.meta}">
                </div>
            </div>
            <div class="row text-secondary align-items-center">
                <div class="col fw-bold text-end">
                    Avance
                </div>
                <div class="col fs-6">
                    ${programa.avance}%
                </div>      
            </div>
            `

        return td
    }
    function _put_Gestion(linea,programa,gestion) {
        const td = document.createElement("div")
        td.className = "item-schema border-secondary bg-light shadow-sm"
        td.innerHTML =
            `
        <div class="row text-secondary align-items-center">
            <div class="col-auto fw-bold fs-4">
                ${gestion.id + 1}.
            </div>
            <div class="col" id="cOpenGestion${linea.id}${programa.id}${gestion.id}">
                ${gestion.nombre}
            </div>
        </div>
        <div class="row text-secondary align-items-center">
            <div class="col fw-bold text-end">
                Meta
            </div>
            <div class="col fw-bold">
                <input type="text" class="form-control" id="inAvanceGestion${linea.id}${programa.id}${gestion.id}" value="${gestion.indicador}">
            </div>      
        </div>
        <div class="row text-secondary align-items-center">
            <div class="col fw-bold text-end">
                Avance
            </div>
            <div class="col fs-6">
             <input type="text" class="form-control" id="inMetaGestion${linea.id}${programa.id}${gestion.id}" value="${gestion.cumplimiento}">
            </div>      
        </div>
        `
        

        return td
    }

    area.cslLineas.forEach(linea => {
        //Configuramos para que se actualize la línea y su meta
        const refAvanceLinea = document.getElementById("inAvanceLinea" + linea.id)
        refAvanceLinea.oninput = () => {
            linea.meta = refAvanceLinea.value
            GuardarVigencia()

        }
        refAvanceLinea.value = linea.meta
        const cOpenLiena = document.getElementById("cOpenLinea" + linea.id)
        cOpenLiena.onclick = () => {
            const elemento = ActiveProyect.clsAreas[area.id].cslLineas[linea.id]
            elemento.makerHTMLLineaPanel(area)
        }
        linea.clsPrograma.forEach(programa => {
            //Configuramos para que se actualize el programa y su meta
            const refAvancePrograma = document.getElementById("inMetaPrograma" + linea.id + programa.id)
            refAvancePrograma.oninput = () => {
                programa.meta = refAvancePrograma.value
                GuardarVigencia()
            }
            refAvancePrograma.value = programa.meta

            const cOpenPrograma = document.getElementById("cOpenPrograma" + linea.id + programa.id)
            cOpenPrograma.onclick = () => {
                const elemento = ActiveProyect.clsAreas[area.id].cslLineas[linea.id].clsPrograma[programa.id]
                elemento.makerHTMLProgramaPanel(area, linea)
            }
            programa.clsGestion.forEach(gestion => {
                //Configuramos para que se actualize la gestion y su meta
                const refMetaGestion = document.getElementById("inMetaGestion" + linea.id + programa.id + gestion.id)
                refMetaGestion.oninput = () => {
                    gestion.indicador = refMetaGestion.value
                    GuardarVigencia()
                }
                refMetaGestion.value = gestion.indicador

                const refAvanceGestion = document.getElementById("inAvanceGestion" + linea.id + programa.id + gestion.id)
                refAvanceGestion.oninput = () => {
                    gestion.cumplimiento = refAvanceGestion.value
                    GuardarVigencia()
                }
                refAvanceGestion.value = gestion.cumplimiento

                const cOpenProyecto = document.getElementById("cOpenGestion" + linea.id + programa.id + gestion.id)
                cOpenProyecto.onclick = () => {
                    const elemento = ActiveProyect.clsAreas[area.id].cslLineas[linea.id].clsPrograma[programa.id].clsGestion[gestion.id]

                    elemento.makerHTMLProyeccion(area, linea, programa.nombre, programa)
                }


            })


        })


    })





}

function parametrizador2(area) {
    document.getElementById("navbarplan").innerHTML = ""
    const cEscritorio = document.getElementById("panel-escritorio")
    cEscritorio.innerHTML = ""
    //Colocamos el ttulo de la consejería
    const Título = document.createElement('div');
    Título.className = "fs-3 fw-bold text-secondary"
    Título.textContent = area.nombre
    cEscritorio.appendChild(Título)

    const Título4 = document.createElement('div');
    Título4.className = "ms-4 fs-6 text-success border-bottom border-4 w-60 border-success"
    Título4.textContent = "Esquema general de la consejería, indicadores y avances"
    cEscritorio.appendChild(Título4)

    area.cslLineas.forEach(linea => {
        //Creamos un contenedor de líneas, es decir, pro cada línea una fila
        const rowLinea = document.createElement("div")
        rowLinea.className = "row p-2 align-items-center border-3 border-bottom border-warning"

        const colNombreLinea = document.createElement("div")
        colNombreLinea.className = "col-2 border-ini-org rounded border-warning shadow p-2 m-2 bg-warning-subtle"
        colNombreLinea.innerHTML = `
        <a class="nav-link active rf-labels" aria-current="page" href="#" id="cOpenLinea${linea.id}">L${linea.id + 1}. ${linea.nombre}</a>
        `




        rowLinea.appendChild(colNombreLinea)

        const colAvanceLinea = document.createElement("div")
        colAvanceLinea.className = "col-2"
        colAvanceLinea.innerHTML = `

        <div class="form-floating">
            <input type="text" class="form-control" id="inAvanceLinea${linea.id}" value="${linea.meta}">
            <label for="inAvanceLinea${linea.id}">Meta / Área</label>
        </div>
        <label class="rounded border mt-1 p-1 w-100 bg-warning-subtle text-end pe-2 border-warning">Avance: ${linea.avance}</label>
        `
        rowLinea.appendChild(colAvanceLinea)


        //Creamos la columna para colocar los programas
        const colProgramasLinea = document.createElement("div")
        colProgramasLinea.className = "col"
        rowLinea.appendChild(colProgramasLinea)


        linea.clsPrograma.forEach(programa => {
            //Creamos una fila por programa
            const rowPrograma = document.createElement("div")
            rowPrograma.className = "row align-items-center"
            colProgramasLinea.appendChild(rowPrograma)
            rowPrograma.innerHTML = `
            <div class="col-2 col-sm-12 col-sm-4 col-lg-4 rf-labels border-ini-org rounded border-info bg-info-subtle shadow p-2 m-2">
            
            <a class="nav-link active rf-labels p-2" aria-current="page" href="#" id="cOpenPrograma${linea.id}${programa.id}">P${programa.id + 1}. ${programa.nombre}</a>
            </div>
            <div class="col-2 rf-labels">
                <div class="form-floating">
                    <input type="text" class="form-control" id="inMetaPrograma${linea.id}${programa.id}" value="${programa.meta}">
                     <label class="" for="inMetaPrograma${linea.id}${programa.id}">Meta / Linea</label>
                </div>
                <label class="rounded border mt-1 w-100 text-end bg-info-subtle pe-2 border-info">Avance: ${programa.avance}</label>
            </div>
             `
            const colProyectos = document.createElement("div")
            colProyectos.className = "col"
            rowPrograma.appendChild(colProyectos)
            programa.clsGestion.forEach(gestion => {
                const rowProyectos = document.createElement("div")
                rowProyectos.className = "row mb-1 border-ini-org rounded border-secondary bg-light p-2 m-2 align-items-center shadow"
                rowProyectos.innerHTML = `
                <div class="col">
                    <a class="nav-link active rf-labels" aria-current="page" href="#" id="cOpenGestion${linea.id}${programa.id}${gestion.id}">G${gestion.id + 1}. ${gestion.nombre}</a>
                </div>
                <div class="col">
                    <div class="form-floating">
                        <input type="text" class="form-control" id="inMetaGestion${linea.id}${programa.id}${gestion.id}" value="${gestion.indicador}">
                        <label class="" for="inMetaGestion${linea.id}${programa.id}${gestion.id}">Meta / Gestión</label>
                    </div>
                    <div class="form-floating">
                        <input type="text" class="form-control" id="inAvanceGestion${linea.id}${programa.id}${gestion.id}" value="${gestion.cumplimiento}">
                    <label class="" for="inAvanceGestion${linea.id}${programa.id}${gestion.id}">Avance</label>
                </div>
                </div>
                `
                colProyectos.appendChild(rowProyectos)

            })

        })

        cEscritorio.appendChild(rowLinea)


    })

    //Asignador de funciones no se peude colocar directo en el for

    area.cslLineas.forEach(linea => {
        //Configuramos para que se actualize la línea y su meta
        const refAvanceLinea = document.getElementById("inAvanceLinea" + linea.id)
        refAvanceLinea.oninput = () => {
            linea.meta = refAvanceLinea.value
            GuardarVigencia()

        }
        refAvanceLinea.value = linea.meta
        const cOpenLiena = document.getElementById("cOpenLinea" + linea.id)
        cOpenLiena.onclick = () => {
            const elemento = ActiveProyect.clsAreas[area.id].cslLineas[linea.id]
            elemento.makerHTMLLineaPanel(area)
        }
        linea.clsPrograma.forEach(programa => {
            //Configuramos para que se actualize el programa y su meta
            const refAvancePrograma = document.getElementById("inMetaPrograma" + linea.id + programa.id)
            refAvancePrograma.oninput = () => {
                programa.meta = refAvancePrograma.value
                GuardarVigencia()
            }
            refAvancePrograma.value = programa.meta

            const cOpenPrograma = document.getElementById("cOpenPrograma" + linea.id + programa.id)
            cOpenPrograma.onclick = () => {
                const elemento = ActiveProyect.clsAreas[area.id].cslLineas[linea.id].clsPrograma[programa.id]
                elemento.makerHTMLProgramaPanel(area, linea)
            }
            programa.clsGestion.forEach(gestion => {
                //Configuramos para que se actualize la gestion y su meta
                const refMetaGestion = document.getElementById("inMetaGestion" + linea.id + programa.id + gestion.id)
                refMetaGestion.oninput = () => {
                    gestion.indicador = refMetaGestion.value
                    GuardarVigencia()
                }
                refMetaGestion.value = gestion.indicador

                const refAvanceGestion = document.getElementById("inAvanceGestion" + linea.id + programa.id + gestion.id)
                refAvanceGestion.oninput = () => {
                    gestion.cumplimiento = refAvanceGestion.value
                    GuardarVigencia()
                }
                refAvanceGestion.value = gestion.cumplimiento

                const cOpenProyecto = document.getElementById("cOpenGestion" + linea.id + programa.id + gestion.id)
                cOpenProyecto.onclick = () => {
                    const elemento = ActiveProyect.clsAreas[area.id].cslLineas[linea.id].clsPrograma[programa.id].clsGestion[gestion.id]

                    elemento.makerHTMLProyeccion(area, linea, programa.nombre, programa)
                }


            })


        })


    })

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
