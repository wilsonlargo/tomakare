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

const rango = {
    "Muy Alta": ["1"],
    "Alta": ["0.8"],
    "Moderada": ["0.6"],
    "Baja": ["0.4"],
    "Muy Baja": ["0.2"],
}
let format_layer = {
    "layer_tablero": ["white", "white", 1, 1, "1", []],
    "layer_basemap": ["black", "orange", 1, 1, "2", []],
    "layer_departamentos": ["black", "orange", 1, 1, "3", ["DPTO_CNMBR"]],
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
        var Parse = JSON.parse(contenido)
        const LayerActive = L.geoJSON(Parse, {
            style: function (feature) {

                const propiedad_color = feature.properties.CLASIFICAC

                try {
                    return {
                        color: "red",
                        fillColor: "red",
                        fillOpacity: rango[propiedad_color][0],
                        pane: "4",
                        weight: 1,
                    };
                } catch (error) {
                    return {
                        color: "",
                        fillOpacity: 0
                    };
                }
            }
        }).bindPopup(function (layer) {
            return layer.feature.properties.CLASIFICAC;
        }, { pane: "labels" }).addTo(map);

        lis_layers_open.push(["layer_" + name_layer[0], LayerActive])

        let control = document.createElement("div")
        control.innerHTML =
            `
            <div class="accordion-item m-2 border border-1 p-1">
            <div class="form-check">
                <div class="row">
                <div class="col-auto me-2">
                    <a data-bs-toggle="collapse" href="#" data-bs-target="#collapse${name_layer[0]}">
                    <i class="bi bi-gear-fill" style="color:#CEECF5;"></i>
                    </a>
                </div>
                <div class="col-auto">
                    <input class="form-check-input" type="checkbox" value="" id="layer_${name_layer[0]}"
                    onchange="">
                    <label class="form-check-label" for="layer_${name_layer[0]}">
                    ${name_layer[0]}
                </label>
                </div>
                </div>
            </div>
            <div id="collapse${name_layer[0]}" class="accordion-collapse collapse m-2">
                <div class="accordion-body">
                Config otro
                </div>
            </div>
            </div>
            `
        const newLayer = document.getElementById("body_layers")
        newLayer.appendChild(control)

        const controlcheck = document.getElementById("layer_" + name_layer[0])
        controlcheck.checked = true
        controlcheck.onchange = () => {

            const activeLayer = lis_layers_open.filter(value => value[0] == controlcheck.id)
            if (controlcheck.checked == true) {
                activeLayer[0][1].addTo(map)

            } else {
                //let layer_remove = lis_layers.filter(value => value[0] == controlcheck.id)
                map.removeLayer(activeLayer[0][1])
            }
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
                layer.feature.properties[format[5]];
            }, { pane: "labels" }).addTo(map);
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
                    let layer_remove = lis_layers.filter(value => value[0] == layer_name)
                    let layer_noremove = lis_layers.filter(value => value[0] !== layer_name)
                    map.removeLayer(layer_remove[0][1])
                    lis_layers = layer_noremove
                    layers.put_layer(checkLayer, layer_name)

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
                    //Crear dos filtros para mostrar o quitar la capa
                    //Solo para capas locales fijas, que siempre se presentarán en el programa
                    let layer_remove = lis_layers.filter(value => value[0] == layer_name)
                    let layer_noremove = lis_layers.filter(value => value[0] !== layer_name)
                    map.removeLayer(layer_remove[0][1])
                    lis_layers = layer_noremove
                    layers.put_layer(checkLayer, layer_name)

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
                    //Crear dos filtros para mostrar o quitar la capa
                    //Solo para capas locales fijas, que siempre se presentarán en el programa
                    let layer_remove = lis_layers.filter(value => value[0] == layer_name)
                    let layer_noremove = lis_layers.filter(value => value[0] !== layer_name)
                    map.removeLayer(layer_remove[0][1])
                    lis_layers = layer_noremove
                    layers.put_layer(checkLayer, layer_name)
                }


            }
        })

    }



}