const ColorLayer = [
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
let mkCov = ""
let latlngConv = [5.1, -75.55]
let lis_layers = []
let lis_layers_open = []
let format_layer = {
    "layer_tablero": {
        "format": {
            color_linea: "'white'",
            color_fondo: "'white'",
            opacidad: 1,
            ancho_linea: 1,
            pane: "'1'"
        },
        "label": [
            {
                "clase": "fw-bold text-info",
                "contenido": "Tablero",
                "campo": ""
            }
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": [

        ]

    },
    "layer_basemap": {
        "format": {
            color_linea: "'white'",
            color_fondo: "'orange'",
            opacidad: 1,
            ancho_linea: 1,
            pane: "'2'"
        },
        "label": [
            {
                "clase": "fw-bold text-info",
                "contenido": "Mapa base",
                "campo": ""
            }
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": [

        ]

    },
    "layer_departamentos": {
        "format": {
            color_linea: "'blue'",
            color_fondo: "'lightblue'",
            opacidad: 1,
            ancho_linea: 1,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold text-info",
                "contenido": "Departamento",
                "campo": "DPTO_CNMBR"
            }
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    },
    "layer_municipios": {
        "format": {
            color_linea: "'blue'",
            color_fondo: "'lightblue'",
            opacidad: 1,
            ancho_linea: 1,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold text-info",
                "contenido": "Municipio",
                "campo": "nombre_mpi"
            },
            {
                "clase": "fw-bold",
                "contenido": "Departamento",
                "campo": "nombre_dpt"
            }
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    },
    "layer_amazonia": {
        "format": {
            color_linea: "'white'",
            color_fondo: "'orange'",
            opacidad: 1,
            ancho_linea: 1,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold",
                "contenido": "Departamento",
                "campo": "Departamen"
            }
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    },
    "layer_macroterritorioscv": {
        "format": {
            color_linea: "'white'",
            color_fondo: "feature.properties.backColor",
            opacidad: 1,
            ancho_linea: 1,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold",
                "contenido": "Macroregión",
                "campo": "MacroT"
            },
            {
                "clase": "fw-bold",
                "contenido": "Departamento",
                "campo": "nombre_dpt"
            }
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": [

        ]
    },
    "layer_resguardos": {
        "format": {
            color_linea: "'white'",
            color_fondo: "'red'",
            opacidad: 1,
            ancho_linea: 1,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold",
                "contenido": "Nombre",
                "campo": "NOMBRE"
            },
            {
                "clase": "fw-bold",
                "contenido": "Pueblo",
                "campo": "PUEBLO"
            }

        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    },
    "layer_reservasc": {
        "format": {
            color_linea: "'white'",
            color_fondo: "'lime'",
            opacidad: 1,
            ancho_linea: 1,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold",
                "contenido": "Nombre",
                "campo": "NOMBRE_ZONA_RESERVA_CAMPESINA"
            },
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    },
    "layer_pdet": {
        "format": {
            color_linea: "'white'",
            color_fondo: "'green'",
            opacidad: 1,
            ancho_linea: 1,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold",
                "contenido": "Nombre",
                "campo": "MpNombre"
            },
            {
                "clase": "fw-bold",
                "contenido": "Departamento",
                "campo": "Depto"
            },
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    },
    "layer_ganepares": {
        "format": {
            color_linea: "feature.properties.backcolor",
            color_fondo: "feature.properties.backcolor",
            opacidad: 1,
            ancho_linea: 6,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold",
                "contenido": "Nombre",
                "campo": "NombreAA"
            },
            {
                "clase": "fw-bold",
                "contenido": "Zona",
                "campo": "Zona"
            },
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    },
    "layer_clusterodpi2024": {
        "format": {
            color_linea: "'black'",
            color_fondo: "'black'",
            opacidad: 1,
            ancho_linea: 3,
            pane: "'3'"
        },
        "label": [
            {
                "clase": "fw-bold",
                "contenido": "Cluster de afectaciones a los DPI OBSERVATORIO ODPI ONIC 2016-2023",
                "campo": ""
            },
        ],
        "target": {
            "local": "nolocal",
        },
        "atributes": []
    }
}
function loadlayers() {
    const jslayers = [
        ["nolayer", "Mapa general"],//=================
        ["001tableto", "tablero", "Tablero"],
        ["002basemap", "basemap", "Mapa base"],
        ["nolayer", "Unidades Territoriales"],//=================
        ["003departamentos", "departamentos", "Departamentos"],
        ["004municipios", "municipios", "Municipios"],
        ["nolayer", "Macroregiones"],//=================
        ["008macroterritorioscv", "macroterritorioscv", "Macroregiones CV"],
        ["005mamazonia", "amazonia", "Macro amazonía"],
        ["nolayer", "Territorios"],//=================
        ["004resguardos", "resguardos", "Resguardos"],
        ["006reservacampesina", "reservasc", "Reservas campecinas"],
        ["007pdet", "pdet", "Municipios PDET"],
        ["nolayer", "Grupos Armados no Estatales"],//=================
        ["009ganepares", "ganepares", "Presencia GANE (Pares)"],
        ["nolayer", "Información víctimas"],//=================
        ["010clusterodpi2024", "clusterodpi2024", "Cluster ODPI ONIC 2024"],
    ]

    const panel_control_layers = document.getElementById("panel_control_layers")
    panel_control_layers.innerHTML = ""

    document.getElementById("layerjsdiv").innerHTML = ""
    jslayers.forEach(item => {
        if (item[0] !== "nolayer") {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = `./layers/${item[0]}.js`;
            document.getElementById("layerjsdiv").appendChild(script);
            maker_coltrol_layer(item[1], item[2])
        } else {
            const sm = document.createElement("small")
            sm.className = "text-info fw-bold"
            sm.textContent = item[1]
            document.getElementById("panel_control_layers").appendChild(sm)
        }
    })

    function maker_coltrol_layer(name, title) {
        const accordion_item = document.createElement("div")
        accordion_item.className = "accordion-item border border-1 p-1 mb-1"

        const btn_group = document.createElement("div")
        btn_group.className = "btn-group"
        btn_group.role = "group"

        btn_group.innerHTML = `            
        <a class="ms-1 me-2" data-bs-toggle="collapse" href="#" data-bs-target="#collapse${name}"
          id=btnConfigLayer${name}>
          <i class="bi bi-gear-fill" style="color:#CEECF5;"></i>
        </a>`

        const form_check = document.createElement("div")
        form_check.className = "form-check"

        const input = document.createElement("input")
        input.className = "form-check-input"
        input.type = "checkbox"
        input.id = "checklayer_" + name
        input.onchange = () => layers['put_layer'](input, 'layer_' + name)
        form_check.appendChild(input)

        const label = document.createElement("label")
        label.className = "form-check-label"
        label.for = "checklayer_" + name
        label.textContent = title
        form_check.appendChild(label)
        btn_group.appendChild(form_check)
        accordion_item.appendChild(btn_group)

        const accordion_collapse = document.createElement("div")
        accordion_collapse.className = "accordion-collapse collapse container-fluid"
        accordion_collapse.id = "collapse" + name
        accordion_collapse.innerHTML = `
        <div class="accordion-body container-fluid" id="bodyCollapse${name}">
                    
        </div>
        `


        accordion_item.appendChild(accordion_collapse)

        panel_control_layers.appendChild(accordion_item)

        const btnConfigLayer = document.getElementById("btnConfigLayer" + name)
        btnConfigLayer.onclick = () => config_format("layer_" + name, "bodyCollapse" + name)

    }

}
function maker_coltrol_layer(name, title) {
    const accordion_item = document.createElement("div")
    accordion_item.className = "accordion-item border border-1 p-1 mb-1"

    const btn_group = document.createElement("div")
    btn_group.className = "btn-group"
    btn_group.role = "group"

    btn_group.innerHTML = `            
    <a class="ms-1 me-2" data-bs-toggle="collapse" href="#" data-bs-target="#collapse${name}"
      id=btnConfigLayer${name}>
      <i class="bi bi-gear-fill" style="color:#CEECF5;"></i>
    </a>`

    const form_check = document.createElement("div")
    form_check.className = "form-check"

    const input = document.createElement("input")
    input.className = "form-check-input"
    input.type = "checkbox"
    input.id = "checklayer_" + name
    input.onchange = () => layers['put_layer'](input, 'layer_' + name)
    form_check.appendChild(input)

    const label = document.createElement("label")
    label.className = "form-check-label"
    label.for = "checklayer_" + name
    label.textContent = title
    form_check.appendChild(label)
    btn_group.appendChild(form_check)
    accordion_item.appendChild(btn_group)

    const accordion_collapse = document.createElement("div")
    accordion_collapse.className = "accordion-collapse collapse container-fluid"
    accordion_collapse.id = "collapse" + name
    accordion_collapse.innerHTML = `
    <div class="accordion-body container-fluid" id="bodyCollapse${name}">
                
    </div>
    `


    accordion_item.appendChild(accordion_collapse)

    panel_control_layers.appendChild(accordion_item)

    const btnConfigLayer = document.getElementById("btnConfigLayer" + name)
    btnConfigLayer.onclick = () => config_format("layer_" + name, "bodyCollapse" + name)

}

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
                    propiedad_color = "blue"
                }
                return {
                    color: "white",
                    fillColor: "lime",
                    pane: "4",
                    weight: 1,
                    fillOpacity: 1
                }
            }
        }).addTo(map);
        lis_layers_open.push(["layer_" + name_layer[0], LayerActive])

        const newFormato = {
            "format": {
                color_linea: "'white'",
                color_fondo: "'lime'",
                opacidad: 1,
                ancho_linea: 3,
                pane: "'3'"
            },
            "label": [
                {
                    "clase": "fw-bold",
                    "contenido": "Label",
                    "campo": ""
                },
            ],
            "target": {
                "local": "local",
            },
            "atributes": {

            }
        }
        let layer_existe = format_layer["layer_" + name_layer[0]]

        if (layer_existe == null) {
            format_layer["layer_" + name_layer[0]] = newFormato
        }
        maker_coltrol_layer(name_layer[0], name_layer[0])
        function maker_coltrol_layer(name, title) {
            const accordion_item = document.createElement("div")
            accordion_item.className = "accordion-item border border-1 p-1 mb-1"

            const btn_group = document.createElement("div")
            btn_group.className = "btn-group"
            btn_group.role = "group"

            btn_group.innerHTML = `            
            <a class="ms-1 me-2" data-bs-toggle="collapse" href="#" data-bs-target="#collapse${name}"
              id=btnConfigLayer${name}>
              <i class="bi bi-gear-fill" style="color:#CEECF5;"></i>
            </a>`

            const form_check = document.createElement("div")
            form_check.className = "form-check"

            const input = document.createElement("input")
            input.className = "form-check-input"
            input.type = "checkbox"
            input.id = "checklayer_" + name
            input.checked = true
            input.onchange = () => {
                const activeLayer = lis_layers_open.filter(value => value[0] == "layer_" + name_layer[0])
                if (input.checked == true) {
                    activeLayer[0][1].addTo(map)
                } else {
                    map.removeLayer(activeLayer[0][1])
                }
            }

            form_check.appendChild(input)


            const label = document.createElement("label")
            label.className = "form-check-label"
            label.for = "checklayer_" + name
            label.textContent = title
            form_check.appendChild(label)
            btn_group.appendChild(form_check)
            accordion_item.appendChild(btn_group)

            const accordion_collapse = document.createElement("div")
            accordion_collapse.className = "accordion-collapse collapse container-fluid"
            accordion_collapse.id = "collapse" + name
            accordion_collapse.innerHTML = `
            <div class="accordion-body container-fluid" id="bodyCollapse${name}">
                        
            </div>
            `

            accordion_item.appendChild(accordion_collapse)

            panel_control_layers.appendChild(accordion_item)

            const btnConfigLayer = document.getElementById("btnConfigLayer" + name)
            btnConfigLayer.onclick = () => config_format("layer_" + name, "bodyCollapse" + name)

            //Configuración para los atributos
            const a = document.createElement("div")
            a.innerHTML = `
            <div class="accordion-item">
                <h2 class="accordion-header">
                <button class="accordion-button collapsed" 
                    type="button" data-bs-toggle="collapse" 
                    data-bs-target="#collapsebody_att${name}" 
                    aria-expanded="false">
                    <div class="bg-info p-1 
                    rounded text-white 
                    text-center fw-bold 
                    border-primary border-1 
                    border">Atributos de capa</div>

                </button>
                </h2>
                <div id="collapsebody_att${name}" 
                    class="accordion-collapse collapse" 
                    data-bs-parent="#accordionExample">
                    Aquì los atributos
                </div>
            </div>
            `
            accordion_collapse.appendChild(a)


            const bodyCollaseAtt = document.getElementById(`collapsebody_att${name}`)
            bodyCollaseAtt.innerHTML = ""

            const sm1 = document.createElement("small")
            sm1.className = "fw-bold ms-1"
            sm1.textContent = "Campos de la capa"
            bodyCollaseAtt.appendChild(sm1)


            const sel_Campo = document.createElement("select")
            sel_Campo.className = "form-select form-select-sm ms-1"
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
                    map.removeLayer(mkCov)
                    map.removeLayer(activeLayer[0][1])
                }
            }

            btnAplicar.onclick = () => {
                let layers = capa[0][1]._layers

                for (const property in layers) {
                    const att = capa[0][1]._layers[property].feature.properties[sel_Campo.value]
                    if (att == sel_Valor.value.trim()) {
                        capa[0][1]._layers[property].options[sel_Att.value] = int_Valor.value.trim()
                        capa[0][1]._layers[property].on('click', function (e) {
                            capa[0][1]._layers[property].bindPopup(`Capa ${name}: ${att}`, { pane: "labels" })
                            capa[0][1]._layers[property].openPopup()
                        })
                    }
                }
                //Agregamos los atributos al objeto formato de la capa



                const formatlayer = format_layer["layer_" + name_layer[0]]
                const nameAtt = sel_Campo.value + sel_Att.value + sel_Valor.value.trim()
                if (formatlayer.atributes[nameAtt] == null) {


                    if (sel_Att.value == "fillColor") {
                        const newAtributo = [
                            {
                                "valor": sel_Valor.value.trim(),
                                "backcolor": int_Valor.value.trim(),
                                "linecolor": int_Valor.value.trim(),
                                "opacity": formatlayer.format.opacidad,
                            }
                        ]
                        formatlayer.atributes[nameAtt] = newAtributo
                    } else if (sel_Att.value == "fillColor") {
                        const newAtributo =
                        {
                            "valor": sel_Valor.value.trim(),
                            "backcolor": formatlayer.format.color_fondo,
                            "linecolor": formatlayer.format.color_linea,
                            "opacity": int_Valor.value.trim()
                        }

                        formatlayer.atributes[nameAtt] = newAtributo
                    }

                } else {

                    if (sel_Att.value == "fillColor") {
                        formatlayer.atributes[nameAtt][0].backcolor = int_Valor.value.trim()
                        formatlayer.atributes[nameAtt][0].linecolor = int_Valor.value.trim()
                    } else if (sel_Att.value == "fillColor") {
                        formatlayer.atributes[nameAtt][0].opacity = int_Valor.value.trim()
                    }
                }

                map.removeLayer(capa[0][1])
                capa[0][1].addTo(map)

            }
            const btnLeyendas = document.createElement("button")
            btnLeyendas.className = "btn btn-outline-secondary"
            btnLeyendas.textContent = "Convenciones"
            btnLeyendas.type = "button"
            bodyCollaseAtt.appendChild(btnLeyendas)
            btnLeyendas.onclick = () => {

                const div = document.createElement("div")
                div.style.width = "200px"
                div.className = "bg-white shadow p-2 border border-1 border-info"
                const formatlayer = format_layer["layer_" + name_layer[0]]

                for (const atributoL in formatlayer.atributes) {
                    const formato = (formatlayer.atributes[atributoL][0])
                    const divF = document.createElement("div")
                    divF.className = "row"

                    const col1 = document.createElement("div")
                    col1.className = "col-auto"

                    const i = document.createElement("i")
                    i.className = "bi bi-square-fill fs-6 border border-2"
                    i.style.borderColor = formato.linecolor
                    i.style.color = formato.backcolor
                    i.style.opacity = formato.opacity
                    col1.appendChild(i)
                    divF.appendChild(col1)

                    const col2 = document.createElement("div")
                    col2.className = "col-auto"

                    const colText = document.createElement("div")
                    colText.className = "text-dark fs-6"
                    colText.textContent = formato.valor

                    col2.appendChild(colText)

                    divF.appendChild(col2)
                    div.appendChild(divF)



                }

                if (mkCov == "") {
                    mkCov = L.marker(latlngConv, {
                        draggable: true, pane: "labels",
                        icon: L.divIcon({
                            html: div,
                            class: "border border-0"
                            // Specify something to get rid of the default class.
                        })
                    }).addTo(map);

                } else {
                    map.removeLayer(mkCov)
                    mkCov = L.marker(latlngConv, {
                        draggable: true, pane: "labels",
                        icon: L.divIcon({
                            html: div,
                            class: "border border-0"
                            // Specify something to get rid of the default class.
                        })
                    }).addTo(map);
                }
                mkCov.on('dragend', function (e) {

                    latlngConv = [e.target._latlng.lat, e.target._latlng.lng]
                });
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
        let propiedades = []
        if (control.checked == true) {
            //Si es activado crea uan capa con base al archivo local
            //..eval(layer_name)...usa el texto, lo convierte en uan variable que evoca la capa

            const layer = L.geoJSON(eval(layer_name), {
                style: function (feature) {
                    //Identifica las propiedades de la capa
                    for (const property in feature.properties) {
                        if (propiedades.includes(property) !== true) {
                            propiedades.push(property)
                        }
                    }

                    return {
                        color: eval(format_layer[layer_name].format.color_linea),
                        fillColor: eval(format_layer[layer_name].format.color_fondo),
                        fillOpacity: eval(format_layer[layer_name].format.opacidad),
                        weight: eval(format_layer[layer_name].format.ancho_linea),
                        pane: eval(format_layer[layer_name].format.pane),


                    };
                }
            }).bindPopup(function (layer) {
                const contenido = document.createElement("div")
                format_layer[layer_name].label.forEach(elemento => {
                    const label = document.createElement("div")
                    label.className = elemento.clase
                    label.textContent = elemento.contenido
                    contenido.appendChild(label)

                    const div = document.createElement("div")
                    div.textContent = layer.feature.properties[elemento.campo]
                    contenido.appendChild(div)
                })
                return contenido.innerHTML;
            }, { pane: "labels" }
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
function config_format(layer_name, controlname) {

    const cCollapseBody = document.getElementById(controlname)
    cCollapseBody.innerHTML = ""


    const btngroup = document.createElement("div")
    btngroup.role = "group"
    btngroup.className = "btn-group border-1 border border-info p-2"


    cCollapseBody.appendChild(btngroup)

    maker_control_backcolor()
    maker_control_linecolor()
    maker_control_lineWeight()
    maker_control_opacity()
    maker_control_pane()
    function maker_control_backcolor() {
        //Crearemos un control desplegable de color personalizado
        const dropdown = document.createElement("div")
        dropdown.className = "dropdown me-1"
        dropdown.innerHTML =
            `
        <button class="dropdown-toggle
        border-1 btn btn-outline-secondary p-1" 
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

        const btnColor = document.getElementById("btnColor" + layer_name)
        //Colocamos un icono que cambiará de color cuando cambie la selección
        const i = document.createElement("i")
        i.className = "bi bi-square-fill rounded"
        try {
            i.style.color = eval(format_layer[layer_name].format.color_fondo)
        } catch (error) {
            btnColor.hidden = true
        }
        btnColor.appendChild(i)

        //Colocamos los colores en el ul control

        ColorLayer.forEach(color => {
            const iColor = document.createElement("i")
            iColor.className = "bi bi-square-fill fs-3"
            iColor.style.color = color
            iColor.style.margin = "2px"
            ul.appendChild(iColor)
            iColor.onclick = () => {
                i.style.color = color
                format_layer[layer_name].format.color_fondo = `'${color}'`
                const checkLayer = document.getElementById("check" + layer_name)

                if (checkLayer.checked == true) {
                    //Crear dos filtros para mostrar o quitar la capa
                    //Solo para capas locales fijas, que siempre se presentarán en el programa

                    if (format_layer[layer_name].target.local == "nolocal") {
                        let layer_remove = lis_layers.filter(value => value[0] == layer_name)
                        let layer_noremove = lis_layers.filter(value => value[0] !== layer_name)
                        map.removeLayer(layer_remove[0][1])
                        lis_layers = layer_noremove
                        layers.put_layer(checkLayer, layer_name)
                    } else if (format_layer[layer_name].target.local == "local") {
                        let layer_remove = lis_layers_open.filter(value => value[0] == layer_name)
                        map.removeLayer(layer_remove[0][1])

                        let capa = lis_layers_open.filter(value => value[0] == layer_name)
                        let layers = capa[0][1]._layers
                        for (const property in layers) {
                            capa[0][1]._layers[property].options.fillColor = eval(format_layer[layer_name].format.color_fondo)
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
        dropdown.className = "dropdown me-1"
        dropdown.innerHTML =
            `
        <button class="border-1 btn btn-outline-secondary p-1
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
        const btnLineColor = document.getElementById("btnLineColor" + layer_name)
        try {
            i.style.color = eval(format_layer[layer_name].format.color_fondo)
        } catch (error) {
            btnLineColor.hidden = true
        }

        btnLineColor.appendChild(i)

        //Colocamos los colores en el ul control

        ColorLayer.forEach(color => {
            const iColor = document.createElement("i")
            iColor.className = "bi bi-square-fill fs-3"
            iColor.style.color = color
            iColor.style.margin = "2px"
            ul.appendChild(iColor)
            iColor.onclick = () => {
                i.style.color = color
                format_layer[layer_name].format.color_linea = `'${color}'`
                const checkLayer = document.getElementById("check" + layer_name)

                if (checkLayer.checked == true) {

                    if (format_layer[layer_name].target.local == "nolocal") {
                        //Crear dos filtros para mostrar o quitar la capa
                        //Solo para capas locales fijas, que siempre se presentarán en el programa
                        let layer_remove = lis_layers.filter(value => value[0] == layer_name)
                        let layer_noremove = lis_layers.filter(value => value[0] !== layer_name)
                        map.removeLayer(layer_remove[0][1])
                        lis_layers = layer_noremove
                        layers.put_layer(checkLayer, layer_name)
                    } else if (format_layer[layer_name].target.local == "local") {
                        let layer_remove = lis_layers_open.filter(value => value[0] == layer_name)
                        map.removeLayer(layer_remove[0][1])
                        //lis_layers_open["layer_name"][1]= newLayer(layer_remove)
                        let capa = lis_layers_open.filter(value => value[0] == layer_name)
                        let layers = capa[0][1]._layers
                        for (const property in layers) {
                            capa[0][1]._layers[property].options.color = eval(format_layer[layer_name].format.color_linea)
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
        dropdown.className = "dropdown me-1"
        dropdown.innerHTML =
            `
        <button class="border-1 btn btn-outline-secondary p-1
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
        i.textContent = " " + format_layer[layer_name].format.ancho_linea + "px"
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
                format_layer[layer_name].format.ancho_linea = value[0]
                const checkLayer = document.getElementById("check" + layer_name)
                i.textContent = " " + value[0] + "px"

                if (checkLayer.checked == true) {
                    if (format_layer[layer_name].target.local == "nolocal") {
                        let layer_remove = lis_layers.filter(value => value[0] == layer_name)
                        let layer_noremove = lis_layers.filter(value => value[0] !== layer_name)
                        map.removeLayer(layer_remove[0][1])
                        lis_layers = layer_noremove
                        layers.put_layer(checkLayer, layer_name)
                    } else if (format_layer[layer_name].target.local == "local") {
                        let layer_remove = lis_layers_open.filter(value => value[0] == layer_name)
                        map.removeLayer(layer_remove[0][1])
                        //lis_layers_open["layer_name"][1]= newLayer(layer_remove)
                        let capa = lis_layers_open.filter(value => value[0] == layer_name)
                        let layers = capa[0][1]._layers
                        for (const property in layers) {
                            capa[0][1]._layers[property].options.weight = format_layer[layer_name].format.ancho_linea
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
        dropdown.className = "dropdown me-1"
        dropdown.innerHTML =
            `
        <button class="border-1 btn btn-outline-secondary p-1
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
        i.textContent = format_layer[layer_name].format.opacidad * 100 + "%"
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
                format_layer[layer_name].format.opacidad = value[0]
                const checkLayer = document.getElementById("check" + layer_name)
                i.textContent = "" + value[1]

                if (checkLayer.checked == true) {
                    if (format_layer[layer_name].target.local == "nolocal") {
                        let layer_remove = lis_layers.filter(value => value[0] == layer_name)
                        let layer_noremove = lis_layers.filter(value => value[0] !== layer_name)
                        map.removeLayer(layer_remove[0][1])
                        lis_layers = layer_noremove
                        layers.put_layer(checkLayer, layer_name)
                    } else if (format_layer[layer_name].target.local == "local") {
                        let layer_remove = lis_layers_open.filter(value => value[0] == layer_name)
                        map.removeLayer(layer_remove[0][1])
                        //lis_layers_open["layer_name"][1]= newLayer(layer_remove)
                        let capa = lis_layers_open.filter(value => value[0] == layer_name)
                        let layers = capa[0][1]._layers
                        for (const property in layers) {
                            capa[0][1]._layers[property].options.fillOpacity = format_layer[layer_name].format.opacidad
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
        dropdown.className = "dropdown me-1"
        dropdown.innerHTML =
            `
        <button class="border-1 btn btn-outline-secondary p-1
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
        i.textContent = eval(format_layer[layer_name].format.pane)
        i.style.color = "black"


        const btnOpacity = document.getElementById("btnPane" + layer_name)
        btnOpacity.appendChild(i)

        //Colocamos los colores en el ul control
        const Pane = ["1", "2", "3", "4", "5", "6"]

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
                format_layer[layer_name].format.pane = `'${value}'`
                const checkLayer = document.getElementById("check" + layer_name)
                i.textContent = " " + value

                if (checkLayer.checked == true) {
                    if (format_layer[layer_name].target.local == "nolocal") {
                        let layer_remove = lis_layers.filter(value => value[0] == layer_name)
                        let layer_noremove = lis_layers.filter(value => value[0] !== layer_name)
                        map.removeLayer(layer_remove[0][1])
                        lis_layers = layer_noremove
                        layers.put_layer(checkLayer, layer_name)
                    } else if (format_layer[layer_name].target.local == "local") {
                        let layer_remove = lis_layers_open.filter(value => value[0] == layer_name)
                        map.removeLayer(layer_remove[0][1])
                        //lis_layers_open["layer_name"][1]= newLayer(layer_remove)
                        let capa = lis_layers_open.filter(value => value[0] == layer_name)
                        let layers = capa[0][1]._layers
                        for (const property in layers) {
                            capa[0][1]._layers[property].options.pane = eval(format_layer[layer_name].format.pane)
                        }
                        capa[0][1].addTo(map)
                    }
                }


            }
        })

    }
}