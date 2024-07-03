const rango = {
    "Muy Alta": ["1"],
    "Alta": ["0.8"],
    "Moderada": ["0.6"],
    "Baja": ["0.4"],
    "Muy Baja": ["0.2"],
    
}
function openfile(control) {
    const archivo = control.target.files[0];
    if (!archivo) {
        return;
    }
    var lector = new FileReader();
    lector.onload = function (e) {
        var contenido = e.target.result;
        var Parse = JSON.parse(contenido)
        L.geoJSON(Parse, {
            style: function (feature) {
                //console.log(feature.properties.CLASIFICAC)
                const propiedad_color = feature.properties.CLASIFICAC
                //console.log(rango["Alto"][0])
                try {
                    return {
                        color:"red",
                        fillColor: "red",
                        fillOpacity:rango[propiedad_color][0],
                        weight: 1,
                    };
                } catch (error) {
                    return { color: "",fillOpacity:0 };
                }
            }
        }).bindPopup(function (layer) {
            return layer.feature.properties.CLASIFICAC;
        }).addTo(map);


    };
    lector.readAsText(archivo);
    let a = fetch("001tablero.json")
      console.log(a)

}