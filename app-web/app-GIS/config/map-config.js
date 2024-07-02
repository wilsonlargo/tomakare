
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
                //return {color: feature.properties.color};
            }
        }).bindPopup(function (layer) {
            //return layer.feature.properties.description;
        }).addTo(map);

        //console.log(contenido)
    };
    lector.readAsText(archivo);
   
}