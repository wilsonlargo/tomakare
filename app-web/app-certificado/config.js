let newDAta = []
const configJS_tamplate = {
    template(organizacion, nit, fecha,telefono,direccion,email) {
        const documento = document.createElement("div")
        let dia = fecha.getDay()
        let mes = fecha.toLocaleString('default', { month: 'long' })
        let vigencia = fecha.getFullYear()
        documento.style.height = "1000px"
        documento.innerHTML = `
        <div class="text-center mt-3">
            <img class="" src="/scr/headerdoc1.png" style="width:500px;">
        </div>
        <hr class="mb-4">
        <div class="text-end mt-2 me-5" style="font-size: 8pt;">
            CERT:${fecha.getFullYear()}${fecha.getDay()}${fecha.getMonth()}-${fecha.getSeconds()}${fecha.getMinutes()}${fecha.getHours()}
        </div>
        <div class="h4 text-center">ORGANIZACIÓN NACIONAL INDÍGENA DE COLOMBIA</div>
        <div class="h5 text-center">CERTIFICADO DE AFILIACIÓN</div>
        <p class="ms-5 me-5 mt-5" style="text-justify:inter-word; text-align: justify;">
            La Organización Nacional Indígena de Colombia (ONIC), en su calidad de Autoridad Política representativa de
            los Pueblos y Naciones Indígenas de Colombia, certifica que:
        </p>
        <p class="ms-5 me-5" style="text-justify:inter-word; text-align: justify;">
            <b>${organizacion}</b> con número de identificación <b>${nit}</b>, 
            ha sido reconocida como organización filial a la ONIC. 
        </p>
        <p class="ms-5 me-5" style="text-justify:inter-word; text-align: justify;">
           Está certificación se otorga teniendo en cuenta que efectúo los procesos internos de 
           afiliación y que en el marco de su Libre Determinación decidido hacer parte de la 
           ONIC para defender y exigir los derechos, el territorio y la vida en múltiples escenarios de relacionamiento y concertación de Gobierno a Gobierno, con base en los principios fundantes del movimiento indígena:  Unidad, Territorio, Cultura y Autonomía forjando la pervivencia de los Pueblos Indígenas en toda el Abya Yala. 
        </p>
        <p class="ms-5 me-5 fw-bold" style="text-justify:inter-word; text-align: justify;">
            Datos de la Organización Afiliada:
        </p>
        <li class="ms-5 mt-2 fw-bold">Nombre: 
            <i class="fw-normal" style="font-size: 9pt;">${organizacion}</i>
        </li>
        <li class="ms-5 fw-bold">Número de Identificación:
            <i class="fw-normal">${nit}</i>
        </li>
        <li class="ms-5  fw-bold">Dirección: 
            <i class="fw-normal">${direccion}</i>
        </li>
        <li class="ms-5  fw-bold">Teléfono: 
            <i class="fw-normal">${telefono}</i>
        </li>
        <li class="ms-5  fw-bold">Correo Electrónico: 
            <i class="fw-normal">${email}</i>
        </li>
        <p class="ms-5 mt-2">
            Este certificado se expide por solicitud de la organización afiliada.
        </p>
        <p class="ms-5">
            Dado en Bacata, a los <b>${dia}</b> días del mes de <b>${mes}</b> del año <b>${vigencia}</b>.
        </p>
        <div class="text-center mt-3">
            <img class="" src="/scr/fwl.png" style="width:100px;height="100px"">
        </div>
        <div class="text-center fw-bold">
            Gerardo A. Jumi Tapias
        </div>
        <div class="text-center fw-bold">
            Consejero Secretario General
        </div>
        <div class="text-center fw-bold">
            Organización Nacional Indígena de Colombia (ONIC)
        </div>
        `
        return documento
    },


}

function validar_datos() {
    const intDocumento = document.getElementById("intDocumento")
    if (intDocumento.value != "") {
        const datafiltered = newDAta.filter(value => value.ID == intDocumento.value)
        if (datafiltered.length!==0){
            crear_documento(
                datafiltered[0].REGIONAL, 
                datafiltered[0].ID,
                datafiltered[0].TELEFONOS,
                datafiltered[0].DEPARTAMENTO,
                datafiltered[0].CORREOELECTRONICO,
            )
            document.getElementById("divdatos").hidden=true
            document.getElementById("divcapcha").hidden=false
            createCaptcha();
        }else{
            mensajes("Este número de identificación no se registra en la base de datos", "orange")
        }

    } else {
        mensajes("Debe ingresar un número de documento", "orange")
    }
}

function crear_documento(organizacion,id,telefono,direccion,email) {
    const fecha = new Date()
    var opt = {
        margin: [0, 1, 0, 1], //top, left, buttom, right,
        filename: `CERT${fecha.getFullYear()}${fecha.getDay()}${fecha.getMonth()}-${fecha.getSeconds()}${fecha.getMinutes()}${fecha.getHours()}ONIC.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3 },
        jsPDF: { unit: 'cm', format: 'letter', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    var element = configJS_tamplate.template(organizacion, id, fecha,telefono,direccion,email)
    var worker = html2pdf().set(opt).from(element).save();

}
function mensajes(text, color) {
    Toastify({
        text: text,
        duration: 3000,
        destination: "",
        newWindow: true,
        close: true,
        gravity: "bottom", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: color,
            color: "white",
        },
        onClick: function () { } // Callback after click
    }).showToast();

}
