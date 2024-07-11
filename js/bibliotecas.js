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
                    libro.año,
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

    makerHTMLBiblioteca(){
        const escritorio = document.getElementById("panel-biblioteca")





    }

}
class Documento {
    constructor(consejeria, categoria, titulo, clave, descripcion, link, tipo, portada, ruta,año, id, dominio) {
        this.consejeria = consejeria;
        this.categoria = categoria
        this.titulo = titulo
        this.clave = clave
        this.descripcion = descripcion
        this.link = link
        this.tipo = tipo
        this.portada = portada
        this.ruta = ruta
        this.año = año
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
    ActiveBiblioteca.addDocumento(new Documento("Consejería", "Categoria", "Título", "", "Descripción", "#", "", "", "","", 0, ActiveBiblioteca))
    GuardarBiblioteca()
    mensajes("Elemento creado", "Green")
}