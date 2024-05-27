function IniCredential(){
    //Lee la información del formulario de ingreso en index.html
    const email = document.getElementById("inEmail").value
    const password = document.getElementById("inPass").value
    //Evoca la función global de ingreso, en archivo (dataconfig.js)        
    GLOBAL.firestore.CredentialIn(email,password)

}

function SignOut(){
    GLOBAL.firestore.CredentialOut()
}