const rango = {
    "Muy Alta": ["1"],
    "Alta": ["0.8"],
    "Moderada": ["0.6"],
    "Baja": ["0.4"],
    "Muy Baja": ["0.2"],

}
let lis_layers = []
let a
function openfile(control) {
    const archivo = control.target.files[0];
    if (!archivo) {
        return;
    }
    var lector = new FileReader();
    const name_layer=archivo.name.split(".") 

    lector.onload = function (e) {
        var contenido = e.target.result;
        var Parse = JSON.parse(contenido)
        a = L.geoJSON(Parse, {
            style: function (feature) {
                //console.log(feature.properties.CLASIFICAC)
                const propiedad_color = feature.properties.CLASIFICAC
                //console.log(rango["Alto"][0])
                try {
                    return {
                        color: "red",
                        fillColor: "red",
                        fillOpacity: rango[propiedad_color][0],
                        weight: 1,
                    };
                } catch (error) {
                    return { color: "", fillOpacity: 0 };
                }
            }
        }).bindPopup(function (layer) {
            return layer.feature.properties.CLASIFICAC;
        }).addTo(map);

        lis_layers.push(["layer_" + name_layer[0], a])


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
        controlcheck.checked=true
        controlcheck.onchange=()=>{
            const activeLayer= lis_layers.filter(value => value[0] == controlcheck.id)
            if (controlcheck.checked == true) {
                L.geoJSON(a, {
                    style: function (feature) {
                        //console.log(feature.properties.CLASIFICAC)
                        //const propiedad_color = feature.properties.CLASIFICAC
                        //console.log(rango["Alto"][0])
                        try {
                            return {
                                color: "red",

                            };
                        } catch (error) {
                            return { color: "", fillOpacity: 0 };
                        }
                    }
                }).addTo(map);
                
            } else {
                let layer_remove = lis_layers.filter(value => value[0] == controlcheck.id)
                map.removeLayer(a)
                //lis_layers = layer_noremove
            }
        }        
    };
    lector.readAsText(archivo);



}

const layers = {
    "layer_tablero"(control) {
        
        if (control.checked == true) {
            const layer = L.geoJSON(layer_tablero, {
                style: function (feature) {
                    //console.log(feature.properties.CLASIFICAC)
                    //console.log(rango["Alto"][0])
                    try {
                        return {
                            fillColor: "white",
                            fillOpacity: 1,
                        };
                    } catch (error) {
                        return { color: "", fillOpacity: 0 };
                    }
                }
            }).bindPopup(function (layer) {
                //return layer.feature.properties.CLASIFICAC;
            }).addTo(map);
            lis_layers.push(["layer_tablero", layer])
        } else {
            let layer_remove = lis_layers.filter(value => value[0] == arguments.callee.name)
            let layer_noremove = lis_layers.filter(value => value[0] !== arguments.callee.name)
            console.log(layer_remove[0][1])
            map.removeLayer(layer_remove[0][1])
            lis_layers = layer_noremove
        }

    }
}