//Crea cadenas alfanumericas aleatorias
function randomStr(len, arr) {
    let ans = '';
    for (let i = len; i > 0; i--) {
        ans +=
            arr[(Math.floor(Math.random() * arr.length))];
    }
    return ans
}
//Crea un color aleatorio
function randomColor(color = false) {
    if (color) {
        //Si se le dice cuantos colores, regresa una lista de colores
        const colors = []
        for (let i = 0; i < color; i++) {
            let color = "#";
            for (let i = 0; i < 6; i++) {
                color = color + ("0123456789ABCDEF")[Math.floor(Math.random() * 16)];
            }
            colors.push(color)
        }
        return colors
    } else {
        //Si no se le da ningun parametro a la funcion, regresa un solo color
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color = color + ("0123456789ABCDEF")[Math.floor(Math.random() * 16)];
        }
        return color
    }
}
const Color_local_layer = [
    '#000000', '#000080', '#00008B', '#0000CD', '#0000FF', '#006400', '#008000', '#008080',
    '#008B8B', '#00BFFF', '#00CED1', '#00FA9A', '#00FF00', '#00FF7F', '#00FFFF', '#00FFFF',
    '#191970', '#1E90FF', '#20B2AA', '#228B22', '#2E8B57', '#2F4F4F', '#2F4F4F', '#32CD32',
    '#3CB371', '#40E0D0', '#4169E1', '#4682B4', '#483D8B', '#48D1CC', '#4B0082', '#556B2F',
    '#5F9EA0', '#6495ED', '#663399', '#66CDAA', '#696969', '#696969', '#6A5ACD', '#6B8E23',
    '#708090', '#708090', '#778899', '#778899', '#7B68EE', '#7CFC00', '#7FFF00', '#7FFFD4',
    '#800000', '#800080', '#808000', '#808080', '#808080', '#87CEEB', '#87CEFA', '#8A2BE2',
    '#8B0000', '#8B008B', '#8B4513', '#8FBC8F', '#90EE90', '#9370DB', '#9400D3', '#98FB98',
    '#9932CC', '#9ACD32', '#A0522D', '#A52A2A', '#A9A9A9', '#A9A9A9', '#ADD8E6', '#ADFF2F',
    '#AFEEEE', '#B0C4DE', '#B0E0E6', '#B22222', '#B8860B', '#BA55D3', '#BC8F8F', '#BDB76B',
    '#C0C0C0', '#C71585', '#CD5C5C', '#CD853F', '#D2691E', '#D2B48C', '#D3D3D3', '#D3D3D3',
    '#D8BFD8', '#DA70D6', '#DAA520', '#DB7093', '#DC143C', '#DCDCDC', '#DDA0DD', '#DEB887',
    '#E0FFFF', '#E6E6FA', '#E9967A', '#EE82EE', '#EEE8AA', '#F08080', '#F0E68C', '#F0F8FF',
    '#F0FFF0', '#F0FFFF', '#F4A460', '#F5DEB3', '#F5F5DC', '#F5F5F5', '#F5FFFA', '#F8F8FF',
    '#FA8072', '#FAEBD7', '#FAF0E6', '#FAFAD2', '#FDF5E6', '#FF0000', '#FF00FF', '#FF00FF',
    '#FF1493', '#FF4500', '#FF6347', '#FF69B4', '#FF7F50', '#FF8C00', '#FFA07A', '#FFA500',
    '#FFB6C1', '#FFC0CB', '#FFD700', '#FFDAB9', '#FFDEAD', '#FFE4B5', '#FFE4C4', '#FFE4E1',
    '#FFEBCD', '#FFEFD5', '#FFF0F5', '#FFF5EE', '#FFF8DC', '#FFFACD', '#FFFAF0', '#FFFAFA',
    '#FFFF00', '#FFFFE0', '#FFFFF0',]

let layers_local = {}
let mkCov = []
let latlngConv2 = [5.1, -75.55]

function open_local_layer(control, option) {
    const archivo = control.target.files[0];

    //var tmppath = URL.createObjectURL(archivo)


    if (!archivo) {
        return;
    }
    var lector = new FileReader();
    const layer_title = archivo.name.split(".")

    lector.onload = function (e) {
        var file_geojson = e.target.result;
        var layer_local = JSON.parse(file_geojson)
        if (option == "directo") {
            load_direct_layer(layer_local, layer_title,)
        } else {
            load_edit_layer(layer_local, layer_title, archivo.name)
        }

    };
    lector.readAsText(archivo);
}

function load_direct_layer(layer_local, layer_title) {
    var layer_propierties = []

    //Creamos un índice aleatorio
    const idR = randomStr(10, '123456789abcdefghijklmnzx');
    //Crea una capa con base al archivo cargado
    const Layer_Open = L.geoJSON(layer_local, {
        style: function (feature) {
            //Mira los campos y verifica si alguno forma parte de la lista general
            for (const property in feature.properties) {
                if (layer_propierties.includes(property) !== true) {
                    layer_propierties.push(property)
                }
            }
            return {
                color: "white",
                fillColor: randomColor(),
                pane: "4",
                weight: 1,
                fillOpacity: 1,
            }
        }
    }).addTo(map);

    let layer_template =
    {
        "id": idR,
        "title": layer_title[0],
        "properties": layer_propierties,
        "change_propertie": (valor) => {
            let newList = []
            const me_layer = layers_local["layer_" + idR].layer._layers
            for (const property in me_layer) {
                const att = me_layer[property].feature.properties[valor]
                if (newList.includes(att) !== true) {
                    newList.push(att)
                }
            }
            return newList
        },
        "convenciones": [],
        "layer": Layer_Open,
        "style": {
            "change_backColor": (color) => {
                //Limpiamos la capa del mapa
                map.removeLayer(layers_local["layer_" + idR].layer)
                const active_Ls = layers_local["layer_" + idR].layer._layers
                for (const property in active_Ls) {
                    active_Ls[property].options.fillColor = color
                }
                layers_local["layer_" + idR].layer.addTo(map)
            },
            "change_lineColor": (color) => {
                //Limpiamos la capa del mapa
                map.removeLayer(layers_local["layer_" + idR].layer)
                const active_Ls = layers_local["layer_" + idR].layer._layers
                for (const property in active_Ls) {
                    active_Ls[property].options.color = color
                }
                layers_local["layer_" + idR].layer.addTo(map)
            },
            "change_lineWeight": (value) => {
                //Limpiamos la capa del mapa
                map.removeLayer(layers_local["layer_" + idR].layer)
                const active_Ls = layers_local["layer_" + idR].layer._layers
                for (const property in active_Ls) {
                    active_Ls[property].options.weight = value
                }
                layers_local["layer_" + idR].layer.addTo(map)
            },
            "change_opacity": (value) => {
                //Limpiamos la capa del mapa
                map.removeLayer(layers_local["layer_" + idR].layer)
                const active_Ls = layers_local["layer_" + idR].layer._layers
                for (const property in active_Ls) {
                    active_Ls[property].options.fillOpacity = value
                }
                layers_local["layer_" + idR].layer.addTo(map)
            }
            ,
            "change_pane": (value) => {
                //Limpiamos la capa del mapa
                map.removeLayer(layers_local["layer_" + idR].layer)
                const active_Ls = layers_local["layer_" + idR].layer._layers
                for (const property in active_Ls) {
                    active_Ls[property].options.pane = value
                }
                layers_local["layer_" + idR].layer.addTo(map)
            }
        },
        "show": (value) => {
            if (value == true) {
                layers_local["layer_" + idR].layer.addTo(map)
            } else {
                map.removeLayer(layers_local["layer_" + idR].layer)
            }
        }

    }
    layers_local["layer_" + idR] = layer_template
    make_line_layer(layers_local["layer_" + idR])
}
function make_line_layer(layer) {
    const container = document.getElementById("panel_localLayers")
    //Creamos un collapse para incorporar el check y el nombre de la capa
    const collapse_item = document.createElement("div")
    collapse_item.className = "line-layer"
    container.appendChild(collapse_item)

    //Creo una línea para colocar los diferentes elementos btn formato y título de la capa y check
    const row = document.createElement("div")
    row.className = "row  align-items-center"
    collapse_item.appendChild(row)

    //Columna donde va el botón mostrar opciones de formato
    const col1 = document.createElement("div")
    col1.className = "col-auto"
    col1.style.width = "15px"
    row.appendChild(col1)

    //botón mostrar opciones de formato
    const btnFormato = document.createElement("i")
    btnFormato.className = "bi bi-gear-fill boton-format"
    col1.appendChild(btnFormato)
    btnFormato.setAttribute("data-bs-toggle", "collapse")
    btnFormato.setAttribute("data-bs-target", "#itemcollapse" + layer.id)


    //olumna donde va el control check
    const col2 = document.createElement("div")
    col2.className = "col-auto"
    col2.style.width = "15px"
    row.appendChild(col2)

    //Control check que muestra u oculta la capa
    const check_layer = document.createElement("input")
    check_layer.className = "form-check-input"
    check_layer.type = "checkbox"
    col2.appendChild(check_layer)

    //administramos las acciones del control check
    check_layer.checked = true
    check_layer.oninput = () => {
        layer.show(check_layer.checked)
    }

    //olumna donde va el título
    const col3 = document.createElement("div")
    col3.className = "col-auto"
    col3.textContent = layer.title
    row.appendChild(col3)

    //Crear el contenedor de botones
    const divBotones = document.createElement("div")
    divBotones.className = "accordion-collapse collapse bg-white"
    divBotones.id = "itemcollapse" + layer.id
    collapse_item.appendChild(divBotones)

    put_botones_formato(layer, divBotones)
}

function put_botones_formato(layer, contenedor) {
    //Creamos una línea para contener todos los botones
    const row = document.createElement("div")
    row.className = "row  align-items-center m-2"
    contenedor.appendChild(row)

    //
    const col1 = document.createElement("div")
    col1.className = "col-auto me-1"
    col1.style.width = "50px"
    row.appendChild(col1)

    const i_backColor = document.createElement("div")
    i_backColor.className = "boton-change bi bi-square-fill"
    i_backColor.setAttribute("data-bs-toggle", "dropdown")
    col1.appendChild(i_backColor)

    //Iniciamos creando el botón de color del fondo
    const menu1 = document.createElement("ul")
    menu1.className = "dropdown-menu p-1 list-group-scroll"
    menu1.style.width = "300px"
    menu1.style.height = "400px"
    col1.appendChild(menu1)

    Color_local_layer.forEach(color => {
        const iColor = document.createElement("i")
        iColor.className = "bi bi-square-fill m-1"
        iColor.style.fontSize = "16pt"
        iColor.style.cursor = "pointer"
        iColor.style.color = color
        menu1.appendChild(iColor)
        iColor.onclick = () => {
            layer.style.change_backColor(color)
            i_backColor.style.color = color
        }

    })

    const col2 = document.createElement("div")
    col2.className = "col-auto me-1"
    col2.style.width = "50px"
    row.appendChild(col2)

    const i_lineColor = document.createElement("div")
    i_lineColor.className = "boton-change bi bi-square"
    i_lineColor.setAttribute("data-bs-toggle", "dropdown")
    col2.appendChild(i_lineColor)

    const menu2 = document.createElement("ul")
    menu2.className = "dropdown-menu p-1 list-group-scroll"
    menu2.style.width = "300px"
    menu2.style.height = "400px"
    col2.appendChild(menu2)

    Color_local_layer.forEach(color => {
        const iColor = document.createElement("i")
        iColor.className = "bi bi-square-fill m-1"
        iColor.style.fontSize = "16pt"
        iColor.style.cursor = "pointer"
        iColor.style.color = color
        menu2.appendChild(iColor)
        iColor.onclick = () => {
            layer.style.change_lineColor(color)
            i_lineColor.style.color = color
        }

    })

    const col3 = document.createElement("div")
    col3.className = "col-auto me-1"
    col3.style.width = "50px"
    row.appendChild(col3)

    const i_lineWidth = document.createElement("div")
    i_lineWidth.className = "boton-change bi pt-1"
    i_lineWidth.style.fontSize = "16px"
    i_lineWidth.textContent = "1px"
    i_lineWidth.setAttribute("data-bs-toggle", "dropdown")
    col3.appendChild(i_lineWidth)

    const menu3 = document.createElement("ul")
    menu3.className = "dropdown-menu p-1 list-group-scroll"
    menu3.style.width = "60px"
    menu3.style.height = "200px"
    col3.appendChild(menu3)

    const list_line = [0, 1, 2, 3, 4, 5, 6]
    list_line.forEach(ele => {
        const number = document.createElement("div")
        number.textContent = ele + "pt"
        number.className = "line-number"
        number.style.cursor = "pointer"
        menu3.appendChild(number)
        number.onclick = () => {
            layer.style.change_lineWeight(ele)
            i_lineWidth.textContent = ele + "pt"
        }
    })


    const col4 = document.createElement("div")
    col4.className = "col-auto me-1"
    col4.style.width = "50px"
    row.appendChild(col4)

    const i_Opacity = document.createElement("div")
    i_Opacity.className = "boton-change pt-1"
    i_Opacity.style.fontSize = "16px"
    i_Opacity.textContent = "100%"
    i_Opacity.setAttribute("data-bs-toggle", "dropdown")
    col4.appendChild(i_Opacity)

    const menu4 = document.createElement("ul")
    menu4.className = "dropdown-menu p-1 list-group-scroll"
    menu4.style.width = "60px"
    menu4.style.height = "200px"
    col4.appendChild(menu4)

    const list_opacity = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1]
    list_opacity.forEach(ele => {
        const number = document.createElement("div")
        number.textContent = (ele * 100) + "%"
        number.className = "line-number"
        number.style.cursor = "pointer"
        menu4.appendChild(number)
        number.onclick = () => {
            layer.style.change_opacity(ele)
            i_Opacity.textContent = (ele * 100) + "%"
        }
    })


    const col5 = document.createElement("div")
    col5.className = "col-auto me-1"
    col5.style.width = "50px"
    row.appendChild(col5)

    const i_Pane = document.createElement("div")
    i_Pane.className = "boton-change pt-1 bi-layer-backward me-auto"
    i_Pane.style.fontSize = "16px"
    i_Pane.textContent = "  1"
    i_Pane.setAttribute("data-bs-toggle", "dropdown")
    col5.appendChild(i_Pane)

    const menu5 = document.createElement("ul")
    menu5.className = "dropdown-menu p-1 list-group-scroll"
    menu5.style.width = "60px"
    menu5.style.height = "200px"
    col5.appendChild(menu5)

    const list_pane = ["1", "2", "3", "4", "5", "6", "7"]
    list_pane.forEach(ele => {
        const number = document.createElement("div")
        number.textContent = ele
        number.className = "line-number"
        number.style.cursor = "pointer"
        menu5.appendChild(number)
        number.onclick = () => {
            layer.style.change_pane(ele)
            i_Pane.textContent = "  " + ele
        }
    })

    const col6 = document.createElement("div")
    col6.className = "col-auto me-1"
    col6.style.width = "50px"
    row.appendChild(col6)

    const i_att = document.createElement("div")
    i_att.className = "boton-change pt-1"
    i_att.style.fontSize = "16px"
    col6.appendChild(i_att)

    const a_att = document.createElement("a")
    a_att.className = "pt-1 bi-pencil text-dark"
    //a_att.style.fontSize = "16px"
    a_att.setAttribute("data-bs-toggle", "collapse")
    a_att.href = "#atributos" + layer.id
    i_att.appendChild(a_att)


    const atributos_layer = document.createElement("div")
    atributos_layer.className = "collapse ms-4 p-2"
    atributos_layer.id = "atributos" + layer.id
    contenedor.appendChild(atributos_layer)
    maker_att_layer(layer, atributos_layer)
}
function maker_att_layer(layer, contenedor) {
    const sm1 = document.createElement("small")
    sm1.textContent = "Campos"
    sm1.className = "mb-2"
    contenedor.appendChild(sm1)

    const sel_Campo = document.createElement("select")
    sel_Campo.className = "form-select form-select-sm"
    contenedor.appendChild(sel_Campo)


    layer.properties.forEach(campo => {
        const option = document.createElement("option")
        option.value = campo
        option.textContent = campo
        sel_Campo.appendChild(option)
    })

    const sm2 = document.createElement("small")
    sm2.textContent = "Valores"
    sm2.className = "mb-2"
    contenedor.appendChild(sm2)

    const sel_Valor = document.createElement("select")
    sel_Valor.className = "form-select form-select-sm"
    contenedor.appendChild(sel_Valor)

    sel_Campo.oninput = () => {
        const items_valor = layer.change_propertie(sel_Campo.value)
        sel_Valor.innerHTML = ""
        items_valor.forEach(elemento => {
            const option = document.createElement("option")
            option.value = elemento
            option.textContent = elemento
            sel_Valor.appendChild(option)
        })

    }

    const btnAutomatico = document.createElement("button")
    btnAutomatico.className = "btn btn-outline-secondary mt-2"
    btnAutomatico.textContent = "Estilo automático"
    btnAutomatico.type = "button"
    contenedor.appendChild(btnAutomatico)
    btnAutomatico.onclick = () => {
        const items_valor = layer.change_propertie(sel_Campo.value)
        layer.show(false)
        //Obtengo los valores que están adentro de cada campo similar
        const layers = layer.layer._layers

        //Lista uno a uno los valores filtrados
        layer.convenciones = []
        items_valor.forEach(atrib => {
            //Crea un color random para cada capa de la lista
            const colornew = randomColor()
            //Enumera todas los poligonos que forman parte de la capa principal
            for (const property in layers) {
                //identifica el poligono y le agrega un tooltip de información
                layers[property].on('click', function (e) {
                    layers[property].bindPopup(`Capa ${layer.title}: ${att}`, { pane: "labels" })
                    layers[property].openPopup()
                })

                //muestra el contenido del campo seleccionado
                const att = layers[property].feature.properties[sel_Campo.value]

                if (att == atrib) {
                    layers[property].options["fillColor"] = colornew

                }
            }
            let newAtributo = [
                {
                    "valor": atrib,
                    "backcolor": colornew,
                }
            ]
            layer.convenciones.push(newAtributo)

        })

        layer.show(true)
        make_leyendas(layer, sel_Campo.value)
    }

    const btnLeyendas = document.createElement("button")
    btnLeyendas.className = "btn btn-outline-secondary ms-1 mt-2"
    btnLeyendas.textContent = "Convenciones"
    btnLeyendas.type = "button"
    contenedor.appendChild(btnLeyendas)
    btnLeyendas.onclick = () => {
        make_leyendas(layer)
    }
}
function make_leyendas(layer, campo) {
    const div = document.createElement("div")
    div.className = "bg-white shadow divscroll pb-2"
    div.style.width = 200 + "px"
    div.style.height = 200 + "px"


    const bardiv = document.createElement("div")
    bardiv.className = "row text-white bg-secondary ps-1 mb-2"
    div.appendChild(bardiv)

    const colMore = document.createElement("div")
    colMore.className = "col-auto text-end"
    bardiv.appendChild(colMore)

    const coltitle = document.createElement("div")
    coltitle.className = "col"
    coltitle.textContent = layer.title
    bardiv.appendChild(coltitle)

    const colMoreButton = document.createElement("div")
    colMoreButton.className = "col"
    bardiv.appendChild(colMoreButton)

    const btn_expand_abajo = document.createElement("i")
    btn_expand_abajo.className = "bi bi-arrow-bar-down"
    colMore.appendChild(btn_expand_abajo)

    btn_expand_abajo.onclick = () => {
        const actualH = parseInt(div.style.height.replace("px", "")) + 10
        div.style.height = actualH + "px"
    }


    const colclosed = document.createElement("div")
    colclosed.className = "col-auto text-end"
    bardiv.appendChild(colclosed)

    const rowcampo = document.createElement("div")
    rowcampo.className = "row ps-3"
    bardiv.appendChild(rowcampo)

    const colfield = document.createElement("div")
    colfield.className = "col-auto text-end"
    colfield.textContent = campo
    rowcampo.appendChild(colfield)


    //Boton para cerrar díalogo
    const i = document.createElement("i")
    i.className = "bi bi-x-square text-white me-1"
    colclosed.appendChild(i)
    const ley_activa = mkCov.filter(ele => ele[0] == layer.id)
    i.onclick = () => {
        const ley_activa2 = mkCov.filter(ele => ele[0] == layer.id)
        map.removeLayer(ley_activa2[0][1])
    }

    const btn_expand = document.createElement("i")
    btn_expand.className = "bi bi-arrow-bar-right"
    colMore.appendChild(btn_expand)

    btn_expand.onclick = () => {
        const actualW = parseInt(div.style.width.replace("px", "")) + 10
        div.style.width = actualW + "px"
    }

    for (const id in layer.convenciones) {
        const item = (layer.convenciones[id][0])
        const divF = document.createElement("div")
        divF.className = "row ms-1 mb-1"

        const col1 = document.createElement("div")
        col1.className = "col-auto"

        const i = document.createElement("i")
        i.className = "bi bi-square-fill"
        i.style.fontSize = "12px"
        i.style.color = item.backcolor
        col1.appendChild(i)
        divF.appendChild(col1)

        const col2 = document.createElement("div")
        col2.className = "col"

        const colText = document.createElement("div")
        colText.className = "text-dark"
        colText.style.fontSize = "12px"

        colText.textContent = item.valor

        col2.appendChild(colText)

        divF.appendChild(col2)
        div.appendChild(divF)
    }

    const newLey = L.marker(latlngConv2,
        {
            draggable: true,
            pane: "labels",
            icon: L.divIcon({
                html: div,
                class: ""
            })
        })
    newLey.on('dragend', function (e) {
        latlngConv2 = [e.target._latlng.lat, e.target._latlng.lng]
    });


    if (ley_activa.length !== 1) {
        newLey.addTo(map)
        mkCov.push([layer.id, newLey])
    } else {
        map.removeLayer(ley_activa[0][1])
        ley_activa[0][1] = newLey
        ley_activa[0][1].addTo(map)
    }
}
/////////////////////////////////////////////////////////////////////////////
//Editor de json
/////////////////////////////////////////////////////////////////////////////
let atributos = []
function load_edit_layer(layer_local, layer_title, ruta) {
    const file_input_layers = document.getElementById("file_input_layers")
    file_input_layers.value = ruta

    load_polygons(layer_local)
    const btn_aplicar= document.getElementById("btn_aplicar_gjson")
    btn_aplicar.onclick=()=>{
        apply_changes(layer_local)
    }
    const btn_guardar= document.getElementById("btn_exportar_gjson")
    btn_guardar.onclick=()=>{
        export_changes(JSON.stringify(layer_local),'txt')
    }
}
function load_polygons(layer_local,){
    const panel_fields_gjson = document.getElementById("panel_fields_gjson")
    panel_fields_gjson.innerHTML = ""    
    atributos=[]   
    //Miramos uno a uno lo spolígonos
    for (id in layer_local.features) {
        //Dentro de cada polígono hay una propiedades
        const propiedades = layer_local.features[id].properties
        for (id in propiedades) {
            if (atributos.indexOf(id) == -1) {
                atributos[id] = {
                    "old": id,
                    "new": id
                }
            }
        }
    }

    for (id in atributos) {
        const row = document.createElement("div")
        row.className = "row ms-2 list-items-odpi me-3"
        panel_fields_gjson.appendChild(row)

        const col_atributo = document.createElement("div")
        col_atributo.className = "col m-1 p-1"
        col_atributo.textContent = id
        row.appendChild(col_atributo)

        const col_editar = document.createElement("div")
        col_editar.className = "col m-1 p-1"
        row.appendChild(col_editar)

        const input_editar = document.createElement("input")
        input_editar.className = "form-control"
        input_editar.value = col_atributo.textContent
        col_editar.appendChild(input_editar)
        input_editar.oninput = () => {
            atributos[col_atributo.textContent].new = input_editar.value
        }

        const col_valores = document.createElement("div")
        col_valores.className = "col m-1"
        row.appendChild(col_valores)

        const btn_valores = document.createElement("div")
        btn_valores.className = "bi bi-card-list boton-change m-1"
        col_valores.appendChild(btn_valores)

        btn_valores.onclick = () => {
            const int_valores = document.getElementById("int_valores_atributo")
            //Buscar todos los valores dentro de ese atributo
            let list_valores = []
            for (id in layer_local.features) {
                //Dentro de cada polígono hay una propiedades
                const valor = layer_local.features[id].properties[col_atributo.textContent]

                if (list_valores.includes(valor) !== true) {
                    list_valores.push(valor)
                }
                //layer_local.features[id].properties["MIO"]=layer_local.features[id].properties["NOMSZH"]
                //delete layer_local.features[id].properties["NOMSZH"]
            }
            int_valores.value=""
            list_valores.forEach(valor=>{
                int_valores.value=int_valores.value + valor + "\n"
            })
        }

        const col_borrar = document.createElement("div")
        col_borrar.className = "col m-1"
        row.appendChild(col_borrar)

        const btn_borrar = document.createElement("div")
        btn_borrar.className = "bi bi-trash3-fill text-danger boton-change m-1"
        col_borrar.appendChild(btn_borrar)

        btn_borrar.onclick = () => {
            apply_remove(layer_local,col_atributo.textContent)
        }


    }
}
function apply_changes(layer_local){
    for(att in atributos ){
        //Comparar cambios
        if(att!==atributos[att].new){
            for (id in layer_local.features) {
                //Dentro de cada polígono hay una propiedades
                layer_local.features[id].properties[atributos[att].new]=layer_local.features[id].properties[att]
                delete layer_local.features[id].properties[att]
            }
        }
    }
    load_polygons(layer_local)

}
function apply_remove(layer_local,atributo){
    for (id in layer_local.features) {
        //Dentro de cada polígono hay una propiedades
        delete layer_local.features[id].properties[atributo]
    }
    load_polygons(layer_local)

}
async function export_changes(data,type){
    const blob = new Blob([data], { type: type });

    const newHandle = await window.showSaveFilePicker({
        types: [{
            description: 'Text Files',
            accept: {
                'text/plain': ['.geojson'],
            },
        }],
        id: "save-json-file-picker",
        excludeAcceptAllOption: true,
    });

    const writableStream = await newHandle.createWritable();
    await writableStream.write(blob);
    await writableStream.close();
}