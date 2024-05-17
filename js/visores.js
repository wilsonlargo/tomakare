function visorAreas() {

    document.getElementById("conteneder-bar-proyectos").hidden = true
    document.getElementById("panel-escritorio").innerHTML = ""

    const contEscritorio = document.getElementById("panel-escritorio")

    //Colocamos el título del programa
    const Título5 = document.createElement('div');
    Título5.className = "ms-1 mt-4 mb-2 fs-5 text-secondary border-bottom border-1 border-secondary"
    Título5.textContent = "Lista de áeas / consejerías"
    document.getElementById("panel-escritorio").appendChild(Título5)

    const contenedor_listas = document.createElement("ol")
    contenedor_listas.className = "list-group"
    contEscritorio.appendChild(contenedor_listas)


    const colors = {
        "aAreacolor": (item) => {
            let color ;
            if (item <=25){
                color="text-bg-danger"
            }else if(item<=50){
                color="text-bg-secondary"
            }else if(item <=75){
                color="text-bg-warning"
            }
            else if(item <=100){
                color="text-bg-success"
            }
            return color
        },
        "aLineacolor": (item) => {
            
            let color ;
            if (item <=25){
                color="text-bg-danger"
            }else if(item<=50){
                color="text-bg-secondary"
            }else if(item <=75){
                color="text-bg-warning"
            }
            else if(item <=100){
                color="text-bg-success"
            }
            return color
        },
        "aProgramacolor": (item) => {
            let color ;
            if (item <=25){
                color="text-bg-danger"
            }else if(item<=50){
                color="text-bg-secondary"
            }else if(item <=75){
                color="text-bg-warning"
            }
            else if(item <=100){
                color="text-bg-success"
            }
            return color
        },
        "aProyectocolor": (item) => {   
            let color ;
            if (item <=25){
                color="text-bg-danger"
            }else if(item<=50){
                color="text-bg-secondary"
            }else if(item <=75){
                color="text-bg-warning"
            }
            else if(item <=100){
                color="text-bg-success"
            }
            return color
        }
    }


    

    ActiveProyect.clsAreas.forEach(area => {
        let avcProyectos = 0
        let avcAreas = 0
        let avcLineas = 0
        let contProgramas = 0
        let avcProgramas = 0
        let contProyectos = 0
        avcAreas=area.avance
        area.cslLineas.forEach(linea => {
            avcLineas= avcLineas + linea.avance
            contProgramas = contProgramas + linea.clsPrograma.length


            linea.clsPrograma.forEach(programa => {
                contProyectos = contProyectos + programa.clsGestion.length
                avcProgramas=avcProgramas + (parseInt(programa.avance))
             
                programa.clsGestion.forEach(gestion => {
                    avcProyectos=avcProyectos + parseInt((gestion.cumplimiento/gestion.indicador)*100)
                })
            })
        })

        const item = document.createElement("li")
        item.className = "list-group-item d-flex justify-content-between"
        item.innerHTML = `
        <i class="bi bi-person-lines-fill fs-1"></i>
        <div class="container">
        
        <div class="row mb-1 p-1">
            <div class="col fw-bold col align-self-center">
                ${area.nombre}
            </div>
            <div class="col align-self-center" >Avance 
                <span class="badge ${colors.aAreacolor(avcAreas)} rounded-pill p-3">${area.avance}%</span>
            </div>
        </div>
        <div class="row mb-1 p-1">
            <div class="col list-group-item list-group-item-action">
                <b class="fs-3">${area.cslLineas.length}</b> Líneas proyectadas
            </div>
            <div class="col align-self-center">Avance 
                <span class="badge ${colors.aLineacolor(Math.trunc(avcLineas / area.cslLineas.length))} rounded-pill p-3">${Math.trunc(avcLineas / area.cslLineas.length)}%</span>
            </div>
        </div>
        <div class="row p-1">
            <div class="col list-group-item list-group-item-action">
                <b class="fs-3">${contProgramas}</b> Programas proyectados
            </div>
            <div class="col align-self-center">Avance 
                <span class="badge ${colors.aProgramacolor(Math.trunc(avcProgramas / contProgramas))} rounded-pill p-3">${Math.trunc(avcProgramas / contProgramas)}%</span>
            </div>
        </div>
        <div class="row p-1" onclick="listarGestiones()">

            <div class="col list-group-item list-group-item-action">
                <b class="fs-3">${contProyectos}</b> Proyectos diseñados
            </div>
            <div class="col align-self-center">Avance 
                <span class="badge ${colors.aProyectocolor(Math.trunc(avcProyectos / contProyectos))} rounded-pill p-3">${Math.trunc(avcProyectos / contProyectos)}%</span>
            </div>
        </div>
        </div>
        `
        contenedor_listas.appendChild(item)





    });





    ActiveProyect.clsAreas.forEach(area => {

       

    });

}
function temp() {
    area.cslLineas.forEach(linea => {
        linea.clsPrograma.forEach(programa => {
            programa.clsGestion.forEach(gestion => {

                const item = document.createElement("li")
                item.className = "list-group-item d-flex justify-content-between align-items-start"

                const porcentajeReal = (gestion.cumplimiento * 100) / gestion.indicador
                let color;
                if (porcentajeReal <= 30) {
                    color = "text-bg-danger"
                } else if (porcentajeReal >= 90) {
                    color = "text-bg-success"
                } else if (porcentajeReal <= 80) {
                    color = "text-bg-warning"
                }
                else if (porcentajeReal <= 50) {
                    color = "text-bg-warning-subtle"
                }


                item.innerHTML = `
                
                <a href="#" class="list-group-item list-group-item-action ms-3">
                    <div class="ms-2 me-auto">
                    <div class=""> <b>${area.nombre}</b> / ${linea.nombre} / ${programa.nombre}</div>
                    <i class="bi bi-file-earmark-text-fill"></i> ${gestion.nombre}
                    </div>
 
                </a>
                <span class="badge ${color} rounded-pill ms-2 p-2"> (A) ${Math.trunc(porcentajeReal)} %</span>  

                `
                contenedor_listas.appendChild(item)

                item.onclick = () => {
                    const elemento = ActiveProyect.clsAreas[area.id].cslLineas[linea.id].clsPrograma[programa.id].clsGestion[gestion.id]
                    //console.log(ActiveProyect.clsAreas[area.id].cslLineas[linea.id].clsPrograma)
                    elemento.makerHTMLProyeccion(area, linea, programa.nombre, programa)

                }


            })
        })
    })
}