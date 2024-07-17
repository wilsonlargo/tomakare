const ColorList = [
    "#F0F8FF", "white", "#FAEBD7", "#00FFFF", "#7FFFD4", "#F5F5DC", "#000000", "#D2691E",
    "#0000FF", "#8A2BE2", "#A52A2A", "#DEB887", "#5F9EA0", "#7FFF00", "#D2691E",
    "#FF7F50", "#6495ED", "#FFF8DC", "#DC143C", "#00FFFF", "#00008B", "#008B8B",
    "#B8860B", "#006400", "#A9A9A9", "#BDB76B", "#8B008B", "#556B2F", "#FF8C00",
    "#9932CC", "#8B0000", "#E9967A", "#8FBC8F", "#483D8B", "#2F4F4F", "#00CED1",
    "#FF1493", "#00BFFF", "#696969", "#1E90FF", "#B22222", "#FFFAF0", "#228B22",
    "#FF00FF", "#FFD700", "#DAA520", "#ADFF2F", "#F0FFF0", "#FF69B4", "#CD5C5C",
    "#4B0082", "#F0E68C", "#90EE90", "#FFB6C1", "#FFA500", "#FF4500", "#FF0000",
    "#8B4513", "#FFFF00", "#FF6347", "#40E0D0", "#00FF7F"
]


let format_layer = {
    //                 linea,  fondo,  opacidad, grueso, pane, atributos
    "layer_tablero": ["white", "white", 1, 1, "1", [{
        "formato": "fw-bold text-info",
        "label": "Tablero",
        "text": "DPTO_CNMBR"
    }], "nolocal"],
    "layer_basemap": ["black", "orange", 1, 1, "2", [
        {
            "formato": "fw-bold text-info",
            "label": "Mapa base",
            "text": "DPTO_CNMBR"
        }
    ], "nolocal"],
    "layer_departamentos": ["black", "orange", 1, 1, "3",
        [
            {
                "formato": "fw-bold",
                "label": "Departamento:",
                "text": "DPTO_CNMBR"
            },
            {
                "formato": "fw-bold",
                "label": "Código DEP:",
                "text": "DPTO_CCDGO"
            },
        ],
        "nolocal"
    ],
    "layer_resguardos": ["black", "red", 1, 1, "3",
        [
            {
                "formato": "fw-bold",
                "label": "Territorio:",
                "text": "NOMBRE"
            },
            {
                "formato": "fw-bold",
                "label": "Pueblo:",
                "text": "PUEBLO"
            },
        ],
        "nolocal"
    ],
    "layer_municipios": ["black", "pink", 1, 1, "3",
        [
            {
                "formato": "fw-bold",
                "label": "Municipio:",
                "text": "nombre_mpi"
            },
            {
                "formato": "fw-bold",
                "label": "Departamento:",
                "text": "nombre_dpt"
            },
        ],
        "nolocal"
    ],
}

let lis_layers = []
let lis_layers_open = []

function openfile(control) {
    const archivo = control.target.files[0];
    if (!archivo) {
        return;
    }
    var lector = new FileReader();
    const name_layer = archivo.name.split(".")

    lector.onload = function (e) {
        var contenido = e.target.result;
        var layer_local = JSON.parse(contenido)
        let propiedades = []

        const LayerActive = L.geoJSON(layer_local, {
            style: function (feature) {
                let propiedad_color
                //Mira los campos y verifica si alguno forma parte de la lista general
                for (const property in feature.properties) {
                    if (propiedades.includes(property) !== true) {
                        const option = document.create
                        propiedades.push(property)
                    }
                }


                try {
                    propiedad_color = rango[feature.properties.CLASIFICAC][0]
                } catch (error) {
                    propiedad_color = rango["null"][0]
                }
                return {
                    color: "blue",
                    fillColor: "blue",
                    pane: "4",
                    weight: 1,
                    fillOpacity: 1
                }
            }
        }).addTo(map);
        lis_layers_open.push(["layer_" + name_layer[0], LayerActive])

        const newFormato = ["blue", "blue", 1, 1, "4", [], "local", propiedades]
        let layer_existe = format_layer["layer_" + name_layer[0]]

        if (layer_existe == null) {
            format_layer["layer_" + name_layer[0]] = newFormato
        }

        let control = document.createElement("div")
        control.innerHTML =
            `
            <div class="accordion-item border border-1 p-1 mb-1 bg-body-tertiary">
            <div class="form-check">
                <div class="row">
                <div class="col-auto me-2">
                    <a data-bs-toggle="collapse" href="#" data-bs-target="#collapse${name_layer[0]}" onclick="config_format('layer_${name_layer[0]}')">
                    <i class="bi bi-gear-fill" style="color:#CEECF5;"></i>
                    </a>
                </div>
                <div class="col-auto">
                    <input class="form-check-input" 
                    type="checkbox" 
                    onchange=""
                    id="checklayer_${name_layer[0]}">
                    <label class="form-check-label" for="flexCheckDefault">
                    ${name_layer[0]}
                    </label>
                </div>
                </div>
            </div>
            <div id="collapse${name_layer[0]}" class="accordion-collapse collapse">
                <div class="accordion-body container-fluid" id="layer_${name_layer[0]}">
                
                </div>

                
                <div class="accordion" id="accordion_att${name_layer[0]}">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" 
                    data-bs-target="#_att${name_layer[0]}" aria-expanded="false">
                        Atributos
                    </button>
                    </h2>
                    <div id="_att${name_layer[0]}" class="accordion-collapse collapse">
                    <div class="accordion-body" id="collapsebody_att${name_layer[0]}">
                        
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
            `
        const newLayer = document.getElementById("body_layers")
        newLayer.appendChild(control)

        const bodyCollaseAtt = document.getElementById(`collapsebody_att${name_layer[0]}`)
        bodyCollaseAtt.innerHTML = ""
        const sm1 = document.createElement("small")
        sm1.className = "fw-bold"
        sm1.textContent = "Campos de la capa"
        bodyCollaseAtt.appendChild(sm1)

        const sel_Campo = document.createElement("select")
        sel_Campo.className = "form-select form-select-sm"
        bodyCollaseAtt.appendChild(sel_Campo)

        propiedades.forEach(campo => {
            const option = document.createElement("option")
            option.value = campo
            option.textContent = campo
            sel_Campo.appendChild(option)
        })

        const sm4 = document.createElement("small")
        sm4.className = "fw-bold"
        sm4.textContent = "Valor a buscar"
        bodyCollaseAtt.appendChild(sm4)

        const sel_Valor = document.createElement("select")
        sel_Valor.className = "form-select form-select-sm"
        bodyCollaseAtt.appendChild(sel_Valor)


        let capa = lis_layers_open.filter(value => value[0] == "layer_" + name_layer[0])
        sel_Campo.onchange = () => {
            let atributos = []
            sel_Valor.innerHTML = ""
            for (const property in capa[0][1]._layers) {

                const att = capa[0][1]._layers[property].feature.properties[sel_Campo.value]

                if (atributos.includes(att) !== true) {
                    atributos.push(att)
                    const option = document.createElement("option")
                    option.value = att
                    option.textContent = att
                    sel_Valor.appendChild(option)

                }
            }
        }

        const sm2 = document.createElement("small")
        sm2.className = "fw-bold"
        sm2.textContent = "Atibutos de la capa"
        bodyCollaseAtt.appendChild(sm2)

        const sel_Att = document.createElement("select")
        sel_Att.className = "form-select form-select-sm"
        sel_Att.innerHTML = `
            <option value="fillOpacity">Opacidad polígono</option>
            <option value="fillColor" selected>Color poligono</option>                
        `
        bodyCollaseAtt.appendChild(sel_Att)

        const sm3 = document.createElement("small")
        sm3.className = "fw-bold"
        sm3.textContent = "Resultado"
        bodyCollaseAtt.appendChild(sm3)

        const int_Valor = document.createElement("input")
        int_Valor.className = "form-control"
        int_Valor.type = "text"
        bodyCollaseAtt.appendChild(int_Valor)

        const btnAplicar = document.createElement("button")
        btnAplicar.className = "btn btn-outline-secondary"
        btnAplicar.textContent = "aplicar"
        btnAplicar.type = "button"
        bodyCollaseAtt.appendChild(btnAplicar)

        const controlcheck = document.getElementById("checklayer_" + name_layer[0])
        controlcheck.checked = true
        controlcheck.onchange = () => {
            const activeLayer = lis_layers_open.filter(value => value[0] == "layer_" + name_layer[0])
            if (controlcheck.checked == true) {
                activeLayer[0][1].addTo(map)
            } else {
                map.removeLayer(activeLayer[0][1])
            }
        }

        btnAplicar.onclick = () => {
            let layers = capa[0][1]._layers

            for (const property in layers) {
                const att = capa[0][1]._layers[property].feature.properties[sel_Campo.value]
                if (att == sel_Valor.value.trim()) {
                    capa[0][1]._layers[property].options[sel_Att.value] = int_Valor.value.trim()
                    capa[0][1]._layers[property].on('click', function(e) 
                    {
                        capa[0][1]._layers[property].bindPopup(att,{pane:"labels"})
		                capa[0][1]._layers[property].openPopup()
                    })
                    

                }
            }
            map.removeLayer(capa[0][1])
            capa[0][1].addTo(map)


        }

    };
    lector.readAsText(archivo);


}

//Esta variable única inserta las capas y las visualiza
const layers = {
    //función que obtiene desde el control el nombre del control y nombre de la capa
    "put_layer"(control, layer_name) {
        const format = format_layer[layer_name]
        //Verifica si el contro check su estado
        if (control.checked == true) {
            //Si es activado crea uan capa con base al archivo local
            //..eval(layer_name)...usa el texto, lo convierte en uan variable que evoca la capa

            const layer = L.geoJSON(eval(layer_name), {
                style: function (feature) {
                    //Según sea la capa así mismo aplica el formato
                    try {
                        return {
                            //Aplica el formato para la capa
                            color: format[0],
                            fillColor: format[1],
                            fillOpacity: format[2],
                            weight: format[3],
                            pane: format[4]
                        };
                    } catch (error) {
                        return { color: "", fillOpacity: 0 };
                    }
                }
            }).bindPopup(function (layer) {
                const contenido = document.createElement("div")
                format[5].forEach(elemento => {

                    const label = document.createElement("div")
                    label.className = elemento.formato
                    label.textContent = elemento.label
                    contenido.appendChild(label)

                    const div = document.createElement("div")
                    div.textContent = layer.feature.properties[elemento.text]
                    contenido.appendChild(div)


                })
                return contenido.innerHTML;
            },
                { pane: "labels" }
            ).addTo(map);

            //Agrega esta capa a la lista de capas para activar o desactivar
            lis_layers.push([layer_name, layer])
        } else {
            //Crear dos filtros para mostrar o quitar la capa
            //Solo para capas locales fijas, que siempre se presentarán en el programa
            let layer_remove = lis_layers.filter(value => value[0] == layer_name)
            let layer_noremove = lis_layers.filter(value => value[0] !== layer_name)
            map.removeLayer(layer_remove[0][1])
            lis_layers = layer_noremove
        }
    }
}
function config_format(layer_name) {
    const cCollapseBody = document.getElementById(layer_name)
    cCollapseBody.innerHTML = ""


    const btngroup = document.createElement("div")
    btngroup.className = "btn-group"
    btngroup.role = "group"
    cCollapseBody.appendChild(btngroup)

    maker_control_backcolor()
    maker_control_linecolor()
    maker_control_lineWeight()
    maker_control_opacity()
    maker_control_pane()
    function maker_control_backcolor() {
        //Crearemos un control desplegable de color personalizado
        const dropdown = document.createElement("div")
        dropdown.className = "dropdown"
        dropdown.innerHTML =
            `
        <button class="btn btn-outline-info 
            dropdown-toggle" 
            type="button" 
            data-bs-toggle="dropdown"
            id="btnColor${layer_name}">
        </button>
        `
        const ul = document.createElement("ul")
        ul.className = "dropdown-menu container-fluid p-1 shadow"
        ul.style.width = "300px"
        dropdown.appendChild(ul)
        btngroup.appendChild(dropdown)

        //Colocamos un icono que cambiará de color cuando cambie la selección
        const i = document.createElement("i")
        i.className = "bi bi-square-fill rounded"
        i.style.color = format_layer[layer_name][1]

        const btnColor = document.getElementById("btnColor" + layer_name)
        btnColor.appendChild(i)

        //Colocamos los colores en el ul control

        ColorList.forEach(color => {
            const iColor = document.createElement("i")
            iColor.className = "bi bi-square-fill fs-3"
            iColor.style.color = color
            iColor.style.margin = "2px"
            ul.appendChild(iColor)
            iColor.onclick = () => {
                i.style.color = color
                format_layer[layer_name][1] = color
                const checkLayer = document.getElementById("check" + layer_name)

                if (checkLayer.checked == true) {
                    //Crear dos filtros para mostrar o quitar la capa
                    //Solo para capas locales fijas, que siempre se presentarán en el programa

                    if (format_layer[layer_name][6] == "nolocal") {
                        let layer_remove = lis_layers.filter(value => value[0] == layer_name)
                        let layer_noremove = lis_layers.filter(value => value[0] !== layer_name)
                        map.removeLayer(layer_remove[0][1])
                        lis_layers = layer_noremove
                        layers.put_layer(checkLayer, layer_name)
                    } else if (format_layer[layer_name][6] == "local") {
                        let layer_remove = lis_layers_open.filter(value => value[0] == layer_name)
                        map.removeLayer(layer_remove[0][1])
                        //lis_layers_open["layer_name"][1]= newLayer(layer_remove)
                        let capa = lis_layers_open.filter(value => value[0] == layer_name)
                        let layers = capa[0][1]._layers
                        for (const property in layers) {
                            capa[0][1]._layers[property].options.fillColor = format_layer[layer_name][1]
                        }
                        capa[0][1].addTo(map)
                    }

                }
            }
        })

    }
    function maker_control_linecolor() {
        //Crearemos un control desplegable de color linea personalizado
        const dropdown = document.createElement("div")
        dropdown.className = "dropdown"
        dropdown.innerHTML =
            `
        <button class="btn btn-outline-info 
            dropdown-toggle" 
            type="button" 
            data-bs-toggle="dropdown"
            id="btnLineColor${layer_name}">
        </button>
        `
        const ul = document.createElement("ul")
        ul.className = "dropdown-menu container-fluid p-1"
        ul.style.width = "300px"
        dropdown.appendChild(ul)
        btngroup.appendChild(dropdown)

        //Colocamos un icono que cambiará de color cuando cambie la selección
        const i = document.createElement("i")
        i.className = "bi bi-square fw-bold"
        i.style.color = format_layer[layer_name][0]

        const btnLineColor = document.getElementById("btnLineColor" + layer_name)
        btnLineColor.appendChild(i)

        //Colocamos los colores en el ul control

        ColorList.forEach(color => {
            const iColor = document.createElement("i")
            iColor.className = "bi bi-square-fill fs-3"
            iColor.style.color = color
            iColor.style.margin = "2px"
            ul.appendChild(iColor)
            iColor.onclick = () => {
                i.style.color = color
                format_layer[layer_name][0] = color
                const checkLayer = document.getElementById("check" + layer_name)

                if (checkLayer.checked == true) {

                    if (format_layer[layer_name][6] == "nolocal") {
                        //Crear dos filtros para mostrar o quitar la capa
                        //Solo para capas locales fijas, que siempre se presentarán en el programa
                        let layer_remove = lis_layers.filter(value => value[0] == layer_name)
                        let layer_noremove = lis_layers.filter(value => value[0] !== layer_name)
                        map.removeLayer(layer_remove[0][1])
                        lis_layers = layer_noremove
                        layers.put_layer(checkLayer, layer_name)
                    } else if (format_layer[layer_name][6] == "local") {
                        let layer_remove = lis_layers_open.filter(value => value[0] == layer_name)
                        map.removeLayer(layer_remove[0][1])
                        //lis_layers_open["layer_name"][1]= newLayer(layer_remove)
                        let capa = lis_layers_open.filter(value => value[0] == layer_name)
                        let layers = capa[0][1]._layers
                        for (const property in layers) {
                            capa[0][1]._layers[property].options.color = format_layer[layer_name][0]
                        }
                        capa[0][1].addTo(map)
                    }

                }


            }
        })

    }
    function maker_control_lineWeight() {
        //Crearemos un control desplegable de color linea personalizado
        const dropdown = document.createElement("div")
        dropdown.className = "dropdown"
        dropdown.innerHTML =
            `
        <button class="btn btn-outline-info 
            dropdown-toggle" 
            type="button" 
            data-bs-toggle="dropdown"
            id="btnLineWeight${layer_name}">
        </button>
        `
        const ul = document.createElement("ul")
        ul.className = "dropdown-menu container-fluid p-1"
        dropdown.appendChild(ul)
        btngroup.appendChild(dropdown)

        //Colocamos un icono que cambiará de color cuando cambie la selección
        const i = document.createElement("i")
        i.className = "bi-arrows-collapse-vertical"
        i.textContent = " " + format_layer[layer_name][3] + "px"
        i.style.color = "black"


        const btnLineColor = document.getElementById("btnLineWeight" + layer_name)
        btnLineColor.appendChild(i)

        //Colocamos los colores en el ul control
        const lineWight = [
            [0, "0px"],
            [1, "1px"],
            [2, "2px"],
            [3, "3px"],
            [4, "4px"],
        ]

        lineWight.forEach(value => {
            const li = document.createElement("li")
            li.className = "ms-2"

            const a = document.createElement("a")
            a.className = "dropdown-item"
            a.href = "#"
            a.textContent = value[1]
            li.appendChild(a)

            ul.appendChild(li)
            a.onclick = () => {
                format_layer[layer_name][3] = value[0]
                const checkLayer = document.getElementById("check" + layer_name)
                i.textContent = " " + value[0] + "px"

                if (checkLayer.checked == true) {
                    if (format_layer[layer_name][6] == "nolocal") {
                        let layer_remove = lis_layers.filter(value => value[0] == layer_name)
                        let layer_noremove = lis_layers.filter(value => value[0] !== layer_name)
                        map.removeLayer(layer_remove[0][1])
                        lis_layers = layer_noremove
                        layers.put_layer(checkLayer, layer_name)
                    } else if (format_layer[layer_name][6] == "local") {
                        let layer_remove = lis_layers_open.filter(value => value[0] == layer_name)
                        map.removeLayer(layer_remove[0][1])
                        //lis_layers_open["layer_name"][1]= newLayer(layer_remove)
                        let capa = lis_layers_open.filter(value => value[0] == layer_name)
                        let layers = capa[0][1]._layers
                        for (const property in layers) {
                            capa[0][1]._layers[property].options.weight = format_layer[layer_name][3]
                        }
                        capa[0][1].addTo(map)
                    }
                }


            }
        })

    }
    function maker_control_opacity() {
        //Crearemos un control desplegable de color linea personalizado
        const dropdown = document.createElement("div")
        dropdown.className = "dropdown"
        dropdown.innerHTML =
            `
        <button class="btn btn-outline-info 
            dropdown-toggle" 
            type="button" 
            data-bs-toggle="dropdown"
            id="btnOpacity${layer_name}">
        </button>
        `
        const ul = document.createElement("ul")
        ul.className = "dropdown-menu container-fluid p-1"
        dropdown.appendChild(ul)
        btngroup.appendChild(dropdown)

        //Colocamos un icono que cambiará de color cuando cambie la selección
        const i = document.createElement("i")
        i.className = ""
        i.textContent = format_layer[layer_name][2] * 100 + "%"
        i.style.color = "black"


        const btnOpacity = document.getElementById("btnOpacity" + layer_name)
        btnOpacity.appendChild(i)

        //Colocamos los colores en el ul control
        const Opacity = [
            [1, "100%"],
            [0.9, "90%"],
            [0.8, "80px"],
            [0.7, "70px"],
            [0.6, "60px"],
            [0.5, "50px"],
            [0.4, "40px"],
            [0.3, "30px"],
            [0.2, "20px"],
            [0.1, "10px"],

        ]

        Opacity.forEach(value => {
            const li = document.createElement("li")
            li.className = "ms-2"

            const a = document.createElement("a")
            a.className = "dropdown-item"
            a.href = "#"
            a.textContent = value[1]
            li.appendChild(a)

            ul.appendChild(li)
            a.onclick = () => {
                format_layer[layer_name][2] = value[0]
                const checkLayer = document.getElementById("check" + layer_name)
                i.textContent = "" + value[1]

                if (checkLayer.checked == true) {
                    if (format_layer[layer_name][6] == "nolocal") {
                        let layer_remove = lis_layers.filter(value => value[0] == layer_name)
                        let layer_noremove = lis_layers.filter(value => value[0] !== layer_name)
                        map.removeLayer(layer_remove[0][1])
                        lis_layers = layer_noremove
                        layers.put_layer(checkLayer, layer_name)
                    } else if (format_layer[layer_name][6] == "local") {
                        let layer_remove = lis_layers_open.filter(value => value[0] == layer_name)
                        map.removeLayer(layer_remove[0][1])
                        //lis_layers_open["layer_name"][1]= newLayer(layer_remove)
                        let capa = lis_layers_open.filter(value => value[0] == layer_name)
                        let layers = capa[0][1]._layers
                        for (const property in layers) {
                            capa[0][1]._layers[property].options.fillOpacity = format_layer[layer_name][2]
                        }
                        capa[0][1].addTo(map)
                    }
                }


            }
        })

    }
    function maker_control_pane() {
        //Crearemos un control desplegable de color linea personalizado
        const dropdown = document.createElement("div")
        dropdown.className = "dropdown"
        dropdown.innerHTML =
            `
        <button class="btn btn-outline-info 
            dropdown-toggle" 
            type="button" 
            data-bs-toggle="dropdown"
            id="btnPane${layer_name}">
        </button>
        `
        const ul = document.createElement("ul")
        ul.className = "dropdown-menu container-fluid p-1"
        dropdown.appendChild(ul)
        btngroup.appendChild(dropdown)

        //Colocamos un icono que cambiará de color cuando cambie la selección
        const i = document.createElement("i")
        i.className = "bi-intersect"
        i.textContent = format_layer[layer_name][4]
        i.style.color = "black"


        const btnOpacity = document.getElementById("btnPane" + layer_name)
        btnOpacity.appendChild(i)

        //Colocamos los colores en el ul control
        const Pane = ["1", "2", "3", "4", "5"]

        Pane.forEach(value => {
            const li = document.createElement("li")
            li.className = "ms-2"

            const a = document.createElement("a")
            a.className = "dropdown-item"
            a.href = "#"
            a.textContent = value
            li.appendChild(a)

            ul.appendChild(li)
            a.onclick = () => {
                format_layer[layer_name][4] = value
                const checkLayer = document.getElementById("check" + layer_name)
                i.textContent = " " + value

                if (checkLayer.checked == true) {
                    if (format_layer[layer_name][6] == "nolocal") {
                        let layer_remove = lis_layers.filter(value => value[0] == layer_name)
                        let layer_noremove = lis_layers.filter(value => value[0] !== layer_name)
                        map.removeLayer(layer_remove[0][1])
                        lis_layers = layer_noremove
                        layers.put_layer(checkLayer, layer_name)
                    } else if (format_layer[layer_name][6] == "local") {
                        let layer_remove = lis_layers_open.filter(value => value[0] == layer_name)
                        map.removeLayer(layer_remove[0][1])
                        //lis_layers_open["layer_name"][1]= newLayer(layer_remove)
                        let capa = lis_layers_open.filter(value => value[0] == layer_name)
                        let layers = capa[0][1]._layers
                        for (const property in layers) {
                            capa[0][1]._layers[property].options.pane = format_layer[layer_name][4]
                        }
                        capa[0][1].addTo(map)
                        console.log(layer_remove)
                    }
                }


            }
        })

    }
}
const modal_open_layer = {

    modalAplicar(comando) {
        const modal = new bootstrap.Modal(document.getElementById('modal_atributos'));
        modal.show();
        const btn = document.getElementById('btnAplicar')
        btn.onclick = comando

    }


}
