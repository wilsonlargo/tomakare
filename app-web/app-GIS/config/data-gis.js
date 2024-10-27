let data_gis
let marcas_consulta = []
let color_marca_busqueda = "#2E64FE"
let colorline_marca_busqueda = "white"
let opacidad_marca_busqueda = 1
let size_marca_busqueda = 10

async function open_data() {
    data_gis = GLOBAL.state.riesgos[0]
    mostrar_resultados(data_gis.registros)
}
function mostrar_resultados(data) {
    //Leer todos los registros primero
    for (id in data) {
        const registro = data[id]
        const marca = PutMarkCicle(
            true, //Indica si el marcador es fijo
            color_marca_busqueda, //Define el color de la marca en ese momento 
            colorline_marca_busqueda, //Define el color de la linea en ese momento 
            opacidad_marca_busqueda, //Define el nivel de opacidad
            size_marca_busqueda, //Define el tamaño del marcador  
            registro.lng,
            registro.lat,
            "7" //Define lugar de la capa en pane
        )
            .bindPopup(PutPopUpZ(
                `${registro.departamento}, ${registro.municipio} `
            ),
                { pane: "labels" }
            )
        marcas_consulta.push(marca)
    }
}
function clear_marcas(){
    marcas_consulta.forEach(marca=>{

        map.removeLayer(marca)

    })
}
function PutMarkCicle(
    //Propiedasdes del marcador por defecto
    static = false,
    colorB = 'black',
    colorL = 'white',
    fillOpacity = 1,
    radius = 10,
    LatB = 4.797,
    LngB = -74.030,
    pane = "7",
    Onlabel = false,
    Content = '',
    key = '',
) {
    let Lat
    let Lng
    let draggable

    if (static == false) {
        draggable = true
        Lat = LatB
        Lng = LngB
    } else {
        draggable = false
        Lat = LatB
        Lng = LngB
    }

    circle = new L.circleMarker([Lat, Lng],
        {
            Type: 'Mark',
            draggable: draggable,
            fillColor: colorB,
            color: colorL,
            fillOpacity: fillOpacity,
            radius: radius,
            weight: 1,
            //Para colocar las marcas arriba de otras capas.
            pane: pane,//Se encuentra configurado al inicio de map.html
            Onlabel: Onlabel,
            Content: Content,
            key: key
        })



    if (static == false) {
        //Si es no estatico se activa la función de arrastrar
        circle.on('dragend', function (e) {
        })
        //solo se guardan la marca no fijas
        MarkFreePoligon.push(circle)
    }

    map.addLayer(circle)

    return circle

}
function PutPopUpZ(text) {

    const PopUp = new L.popup({
        content: text,
        pane: 'mapPopUps'
    })
    return PopUp
}