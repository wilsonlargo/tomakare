let ActiveBiblioteca;
class clsbiBlioteca {
    constructor(id) {
        this.id = id
        this.clsDocumentos = [];
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

    //Inicia la transformación del objeto firebase en un objeto para la clase
    static loadAsInstance(objBiblioteca) {
        const loadLibrerias = (fromClsLibrerias) => {
            return fromClsLibrerias.map(libro => {
                const LibreriaNew = new Documento(
                    libro.consejeria,
                    libro.categoria,
                    libro.titulo,
                    libro.clave,
                    libro.descripcion,
                    libro.link,
                    libro.tipo,
                    libro.portada,
                    libro.ruta,
                    libro.year,
                    libro.icon,
                    libro.id,
                    libro.dominio,
                );
                return LibreriaNew;
            });
        }

        //Crea una nueva clase 
        const biblioteca = new clsbiBlioteca();
        //Lo carga en uan variable global
        GLOBAL.state.biblioteca = biblioteca;
        //Identifica el marcador único ID
        biblioteca.id = objBiblioteca.id;
        biblioteca.clsDocumentos = loadLibrerias(objBiblioteca.clsDocumentos);
        return biblioteca;

    }


    //Función interna de esta clase para guardar la info dentro de esta clase activa
    GuardarBiblioteca() {
        const id = GLOBAL.firestore.updateBiblioteca(
            JSON.parse(ActiveBiblioteca.convertToJSON()))
    }

    addDocumento(Documento) {
        this.clsDocumentos.push(Documento);
    }
    deleDocumento(id) {
        this.clsDocumentos.splice(id, 1);
    }

    makerHTMLBiblioteca() {
        const tbody_biblioteca = document.getElementById("tbody-biblioteca")
        tbody_biblioteca.innerHTML = ""

        let i = 0
        this.clsDocumentos.forEach(documento => {

            const tr = document.createElement("tr")

            const td_scope = document.createElement("td")
            td_scope.style.verticalAlign = "middle"
            td_scope.style.width = "60px"
            td_scope.className = "bg-secondary text-center text-white"
            td_scope.scope = "row"

            const td_btn = document.createElement("a")
            td_btn.className = "nav-link active fs-5"
            td_btn.href = "#"
            td_btn.innerHTML = `<i class="bi ${documento.icon}"></i>`
            td_btn.id = "td_scope" + i


            td_scope.appendChild(td_btn)


            tr.appendChild(td_scope)
            //=========================================================

            const td_titulo = document.createElement("td")
            td_titulo.id = "td_titulo" + i

            const divCollapse = document.createElement("div")
            divCollapse.innerHTML = `
                <a class="btn fw-bold" 
                    data-bs-toggle="collapse" 
                    href="#collapse${i}"
                    role="button"
                    id="btnTitulo${i}"
                    onclick="openDocumento(${i})"
                >
                    ${documento.titulo}
                </a>
                <div class="collapse" id="collapse${i}">
                    <div class="card card-body" id="contenedor_documento${i}">
                        
                    </div>
                </div>
                `
            td_titulo.appendChild(divCollapse)
            tr.appendChild(td_titulo)

            const td_autor = document.createElement("td")
            td_autor.textContent = documento.consejeria
            td_autor.id = "td_autor" + i
            tr.appendChild(td_autor)

            const td_year = document.createElement("td")
            td_year.textContent = documento.year
            td_year.id = "td_year" + i
            tr.appendChild(td_year)

            tbody_biblioteca.appendChild(tr)
            documento.id = i++


        })


    }

}
function openDocumento(id) {
    const contenedor_documento = document.getElementById(`contenedor_documento${id}`)
    const documento = ActiveBiblioteca.clsDocumentos[id]
    contenedor_documento.innerHTML = ""


    const small_autor = document.createElement("small")
    small_autor.textContent = "Autor"
    small_autor.className = "text-secondary m-1 fw-bold"
    contenedor_documento.appendChild(small_autor)

    const intAutor = document.createElement("input")
    intAutor.type = "text"
    intAutor.className = "form-control"
    intAutor.value = documento.consejeria

    intAutor.onchange = () => {
        documento.consejeria = intAutor.value
        document.getElementById(`td_autor${id}`).textContent = intAutor.value
        GuardarBiblioteca()
    }
    contenedor_documento.appendChild(intAutor)
    //=====================

    const small_Titulo = document.createElement("small")
    small_Titulo.textContent = "Título"
    small_Titulo.className = "text-secondary m-1 fw-bold"
    contenedor_documento.appendChild(small_Titulo)

    const intTitulo = document.createElement("textarea")
    intTitulo.type = "text"
    intTitulo.rows = 1
    intTitulo.className = "form-control"
    intTitulo.value = documento.titulo

    intTitulo.onchange = () => {
        documento.titulo = intTitulo.value
        document.getElementById(`btnTitulo${id}`).textContent = intTitulo.value
        GuardarBiblioteca()
    }
    contenedor_documento.appendChild(intTitulo)
    //=====================

    const small_año = document.createElement("small")
    small_año.textContent = "Año"
    small_año.className = "text-secondary m-1 fw-bold"
    contenedor_documento.appendChild(small_año)

    const intAño = document.createElement("input")
    intAño.type = "text"
    intAño.className = "form-control"
    intAño.value = documento.year

    intAño.onchange = () => {
        documento.year = intAño.value
        document.getElementById(`td_year${id}`).textContent = intAño.value
        GuardarBiblioteca()
    }
    contenedor_documento.appendChild(intAño)
    //=====================

    const small_tipo = document.createElement("small")
    small_tipo.textContent = "Tipo de documento"
    small_tipo.className = "text-secondary m-1 fw-bold"
    contenedor_documento.appendChild(small_tipo)

    const intTipo = document.createElement("select")
    intTipo.className = "form-select form-select-sm mb-3"
    intTipo.innerHTML = `
        <option selected>Seleccione una opción</option>
        <option value="bi-file-earmark">Sin tipo</option>
        <option value="bi-file-earmark-text">Texto</option>
        <option value="bi-file-earmark-spreadsheet">Hoja de cálculo</option>
        <option value="bi-file-earmark-pdf">Pdf</option>
        <option value="bi-journal-bookmark">Libro / Publicación</option>
        <option value="bi-globe">Sitio Web</option>
        <option value="bi-newspaper">Prensa digital</option>
        <option value="bi-file-earmark-image">Imagen</option>
        <option value="bi-file-earmark-music">Audio</option>
    `
    intTipo.value = documento.icon
    intTipo.onchange = () => {
        document.getElementById(`td_scope${id}`).innerHTML = `<i class="bi ${intTipo.value}"></i>`
        documento.icon = intTipo.value
        GuardarBiblioteca()
    }
    contenedor_documento.appendChild(intTipo)
    //=====================

    const small_Descripcion = document.createElement("small")
    small_Descripcion.textContent = "Descripción"
    small_Descripcion.className = "text-secondary m-1 fw-bold"
    contenedor_documento.appendChild(small_Descripcion)

    const intDescripcion = document.createElement("textarea")
    intDescripcion.type = "text"
    intDescripcion.rows = 4
    intDescripcion.className = "form-control"
    intDescripcion.value = documento.descripcion

    intDescripcion.onchange = () => {
        documento.descripcion = intDescripcion.value
        GuardarBiblioteca()
    }
    contenedor_documento.appendChild(intDescripcion)
    //=====================

    const small_keys = document.createElement("small")
    small_keys.textContent = "Palabras clave"
    small_keys.className = "text-secondary m-1 fw-bold"
    contenedor_documento.appendChild(small_keys)

    const intKey = document.createElement("textarea")
    intKey.type = "text"
    intKey.rows = 2
    intKey.className = "form-control"
    intKey.value = documento.clave

    intKey.onchange = () => {
        documento.clave = intKey.value
        GuardarBiblioteca()
    }
    contenedor_documento.appendChild(intKey)


    //=====================

    const small_Enlace = document.createElement("small")
    small_Enlace.textContent = "Enlace o vínculo"
    small_Enlace.className = "text-secondary m-1 fw-bold"
    contenedor_documento.appendChild(small_Enlace)

    const intDivEnlace = document.createElement("div")
    intDivEnlace.className = "input-group mb-3"
    intDivEnlace.innerHTML = `
        <span class="input-group-text" id="basic-addon1">
            <a class="btn" 
                href="${documento.link}"
                target="_blank"
                role="button"
                id="btnEnlace${id}"
            >
            <i class="bi bi-link-45deg"></i>
            </a>
        </span>
    `

    const intEnlace = document.createElement("input")
    intEnlace.type = "text"
    intEnlace.className = "form-control"
    intEnlace.value = documento.link

    intEnlace.onchange = () => {
        documento.link = intEnlace.value
        document.getElementById(`btnEnlace${id}`).href = documento.link
        GuardarBiblioteca()
    }
    intDivEnlace.appendChild(intEnlace)
    contenedor_documento.appendChild(intDivEnlace)
    //=====================

    const btnBorrar = document.createElement("button")
    btnBorrar.type = "button"
    btnBorrar.className = "btn btn-outline-danger"
    btnBorrar.textContent="Eliminar documento"

    btnBorrar.onclick=()=>{
        ActiveBiblioteca.deleDocumento(id)
        GuardarBiblioteca()
        ActiveBiblioteca.makerHTMLBiblioteca()
        mensajes("Elemento eliminado", "orange")
    }

    contenedor_documento.appendChild(btnBorrar)



}
class Documento {
    constructor(consejeria, categoria, titulo, clave, descripcion, link, tipo, portada, ruta, year, icon, id, dominio) {
        this.consejeria = consejeria;
        this.categoria = categoria
        this.titulo = titulo
        this.clave = clave
        this.descripcion = descripcion
        this.link = link
        this.tipo = tipo
        this.portada = portada
        this.ruta = ruta
        this.year = year
        this.icon = icon
        this.id = id
        this.dominio = dominio
    };
}


async function cargarBiblioteca() {
    document.getElementById("navbarplan").innerHTML = ""
    document.getElementById("conteneder-bar-proyectos").hidden = true
    document.getElementById("panel-inicio").hidden = true
    document.getElementById("panel-escritorio").innerHTML = ""
    document.getElementById("panel-biblioteca").hidden = false

    const bibliotecas = GLOBAL.state.bibliotecas;
    ActiveBiblioteca = clsbiBlioteca.loadAsInstance(bibliotecas[0]);
    ActiveBiblioteca.makerHTMLBiblioteca()
}
async function GuardarBiblioteca() {
    try {
        ActiveBiblioteca.GuardarBiblioteca();
    } catch (error) {
        mensajes("Se ha presentado un problema: " + error.code, "red")
    }
}
async function AgregarDocumento() {
    ActiveBiblioteca.addDocumento(new Documento("Consejería", "Categoria", "Título", "", "Descripción", "#", "", "", "", "", "bi-file-earmark", 0, ActiveBiblioteca))
    GuardarBiblioteca()
    ActiveBiblioteca.makerHTMLBiblioteca()
    mensajes("Elemento creado", "Green")
}