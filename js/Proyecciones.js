//ESta es la continuación de las clases componentes
//se desarrolla aparte pues tien otros elementos qu eharían grande este componente

class Gestion {
    constructor(nombre, ogeneral, manager, financiado,fuente,valor, id, parentId) {
        this.nombre = nombre;
        this.ogeneral = ogeneral;
        this.manager = manager;
        this.financiado = financiado;
        this.fuente = fuente;
        this.valor = valor;
        this.id = id;
        this.parentId = parentId;
        this.clsEspecificos = [];
    }

    addEspecificos(Especifico) {
        this.clsEspecificos.push(Especifico);
    }
    deleteEspecificos(id) {
        this.clsEspecificos.splice(id, 1);
    }

    makerHTMLProyeccion() {

        //Este boton permite tener acceso al espacio de proyectos
        const btOpen = document.createElement('a')
        btOpen.id = `${this.parentId.id}${this.id}btnOpeProyeccion`
        btOpen.innerHTML = `  
            <a class="btn btn-warning h4"
            id="${this.parentId.id}${this.id}btnOpeProyeccion"             
            role="button">${this.nombre}</a>`
        btOpen.onclick = () => {
            document.getElementById('accordionControl').hidden = true
            document.getElementById('contenedor-bar-areas').hidden = true

            document.getElementById('divProyeciones').hidden = false
            //Creamos en el contenedor un botón de retorno a nuestro espacio de programas
            //Configura las acciones relacionadas con la visibilidad de los componentes
            const btnRetorno = document.getElementById('btRetornarProyeccion')
            btnRetorno.href = `#${this.parentId.id}${this.id}btnOpeProyeccion`
            btnRetorno.onclick = () => {
                document.getElementById('accordionControl').hidden = false
                document.getElementById('contenedor-bar-areas').hidden = false
                document.getElementById('divProyeciones').hidden = true
            }

            this.makerHTMLcomandos(btOpen)
        }
        this.component = btOpen
    }

    makerHTMLcomandos(btOpen) {
        //Creamos un input para el nombre del proyecto con retorno de valores
        const inputNombreProy = document.getElementById('input-nombre-proy')
        inputNombreProy.oninput = () => {
            this.nombre = inputNombreProy.value;
            btOpen.innerHTML = `  
           <a class="btn btn-warning h4"
           id="${this.parentId.id}${this.id}btnOpeProyeccion"             
           role="button">${inputNombreProy.value}</a>`
        }
        inputNombreProy.value = this.nombre

        //Creamos un input para el objetivo del proyecto con retorno de valores
        const inputObjetivoProy = document.getElementById('input-objetivo-proy')
        inputObjetivoProy.oninput = () => {
            this.ogeneral = inputObjetivoProy.value;
        }
        inputObjetivoProy.value = this.ogeneral

        //Creamos un input para el administrador del proyecto con retorno de valores
        const inputAdminProy = document.getElementById('input-administrador-proy')
        inputAdminProy.oninput = () => {
            this.manager = inputAdminProy.value;
        }
        inputAdminProy.value = this.manager

        const inputFinanciadoProy = document.getElementById('input-financiado-proy')
        inputFinanciadoProy.onchange = () => {
            this.financiado=inputFinanciadoProy.checked
            if (inputFinanciadoProy.checked== true){
                document.getElementById('divFinanciacion').hidden=false          
            } else{
                document.getElementById('divFinanciacion').hidden=true    
            }
        }

        //Los contenedores de financiación
        const inputFuente = document.getElementById('input-fuente-proy')
        inputFuente.oninput= ()=>{
            this.fuente=inputFuente.value
        }
        const inputValor = document.getElementById('input-valor-proy')
        inputValor.oninput= ()=>{            
            this.valor=inputValor.value

        }


        //Verificamos si este proyecto tiene financiación
        if (this.financiado== true){
            inputFinanciadoProy.checked = true
            document.getElementById('divFinanciacion').hidden=false
            
            inputFuente.value= this.fuente

            inputValor.value=this.valor

        } else{
            inputFinanciadoProy.checked = false
            document.getElementById('divFinanciacion').hidden=true
            inputFuente.value= ''
            inputValor.value=''       
        }






    }
}