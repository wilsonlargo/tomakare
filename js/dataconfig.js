//======================================================================================================
//Este módulo adminstra las acciones globales relacionadas con la base de datos, operaciones de
//crear, abrir, eliminar proyectos, así como permitir el ingreso a los datos

//Importa las instanacias de firebase y administración de base de datos
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js";

import {
    getFirestore,
    collection,
    onSnapshot,
    doc,
    addDoc,
    setDoc,
    getDocs,
    getDoc,
    deleteDoc,
    updateDoc,
    deleteField,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

//Importa las instanacias de firebase para autenticación
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    setPersistence,
    browserLocalPersistence,
    browserSessionPersistence,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js";



// Utiliza las claves y credenciales de mi base de datos de Tomakare
const firebaseConfig = {
    apiKey: "AIzaSyBPNmdQLcTdPyXxpqdFdJ5cMrbFezE19iE",
    authDomain: "plansbgonic.firebaseapp.com",
    projectId: "plansbgonic",
    storageBucket: "plansbgonic.appspot.com",
    messagingSenderId: "991534041439",
    appId: "1:991534041439:web:e248010abd4185e9118eea"
};


// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app);

// Referencia a las colecciones de proyectos y objetivos
const coleccionProyectos = collection(db, "proyectos");
// Referencia a las colecciones de usuarios
const coleccionUsuarios = collection(db, "usuarios");

const coleccionBiblioteca = collection(db, "biblioteca");

const coleccionCalendario = collection(db, "calendario");

const coleccionConfig = collection(db, "config-app");

const coleccionRiesgos = collection(db, "riesgos");




/* Funciones base para manejar la base de datos de proyectos */

// Función para obtener todos los proyectos de la base de datos
async function getProyectos() {
    const proyectos = [];
    const querySnapshot = await getDocs(coleccionProyectos)
    querySnapshot.forEach((doc) => {
        proyectos.push({
            ...doc.data(),
            id: doc.id,
        });
    });
    return proyectos;
}

//Verifica la lista de usuarios que hay /para filtrar administardores
async function getUsuarios() {
    const usuarios = [];
    const querySnapshot = await getDocs(coleccionUsuarios)
    querySnapshot.forEach((doc) => {
        usuarios.push({
            ...doc.data(),
            id: doc.id,
        });
    });
    return usuarios;
}

async function getBibliotecas() {
    const bibliotecas = [];
    const querySnapshot = await getDocs(coleccionBiblioteca)
    querySnapshot.forEach((doc) => {
        bibliotecas.push({
            ...doc.data(),
            id: doc.id,
        });
    });
    return bibliotecas;
}

async function getConfigs() {
    const configs = [];
    const querySnapshot = await getDocs(coleccionConfig)
    querySnapshot.forEach((doc) => {
        configs.push({
            ...doc.data(),
            id: doc.id,
        });
    });
    return configs;
}

async function getCalendarios() {
    const calendarios = [];
    const querySnapshot = await getDocs(coleccionCalendario)
    querySnapshot.forEach((doc) => {
        calendarios.push({
            ...doc.data(),
            id: doc.id,
        });
    });
    return calendarios;
}

async function getRiesgos() {
    const riesgos = [];
    const querySnapshot = await getDocs(coleccionRiesgos)
    querySnapshot.forEach((doc) => {
        riesgos.push({
            ...doc.data(),
            id: doc.id,
        });
    });

    return riesgos;
}


// Función para agregar un objeto de proyecto a la base de datos
async function addProyecto(objProyecto) {
    const docRef = await addDoc(coleccionProyectos, objProyecto);
    cargarProyectos()
    return docRef.id;
}

async function addBiblioteca(objBiblioteca) {
    const docRef = await addDoc(coleccionBiblioteca, objBiblioteca);
    //cargarBibliotecas()
    return docRef.id;
}

async function addCalendario(objCalendario) {
    const docRef = await addDoc(coleccionCalendario, objCalendario);
    //cargarBibliotecas()
    return docRef.id;
}

async function borrarBiblioteca(id) {
    await deleteDoc(doc(db, "biblioteca", id));
    mensajes("se eliminó esta librería", "orange")
    cargarBibliotecas()
}

async function borrarCalendario(id) {
    await deleteDoc(doc(db, "calendario", id));
    mensajes("se eliminó esta librería", "orange")
    //cargarBibliotecas()
}

// Funcion para eliminar un proyecto por id
async function borrarProyecto(id) {
    await deleteDoc(doc(db, "proyectos", id));
    mensajes("se eliminó esta vigencia", "orange")
    mostrar_escritorio()
    cargarProyectos()
}

// Función para obtener un proyecto por id
async function getProyecto(id) {
    const docRef = doc(db, "proyectos", id);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? ({
        ...docSnap.data(),
        id: docSnap.id,
    }) : null;
}

async function getBiblioteca(id) {
    const docRef = doc(db, "biblioteca", id);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? ({
        ...docSnap.data(),
        id: docSnap.id,
    }) : null;
}

async function getConfig(id) {
    const docRef = doc(db, "config-app", id);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? ({
        ...docSnap.data(),
        id: docSnap.id,
    }) : null;
}

async function getCalendario(id) {
    const docRef = doc(db, "calendario", id);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? ({
        ...docSnap.data(),
        id: docSnap.id,
    }) : null;
}

async function getRiesgo(id) {
    const docRef = doc(db, "riesgos", id);
    const docSnap = await getDoc(docRef);

    return docSnap.exists() ? ({
        ...docSnap.data(),
        id: docSnap.id,
    }) : null;
}

// Función para actualizar un proyecto
async function updateProyecto(proyecto) {
    const docRef = doc(db, "proyectos", proyecto.id);
    await setDoc(docRef, proyecto);
}

async function updateBiblioteca(biblioteca) {
    const docRef = doc(db, "biblioteca", biblioteca.id);
    await setDoc(docRef, biblioteca);
}


async function updateConfig(config) {
    const docRef = doc(db, "config-app", config.id);
    await setDoc(docRef, config);
}

async function updateCalendario(calendario) {
    const docRef = doc(db, "calendario", calendario.id);
    await setDoc(docRef, calendario);
}

async function updateRiesgos(riesgo) {
    const docRef = doc(db, "riesgos", riesgo.id);
    await setDoc(docRef, riesgo);
}




// Escuchar si hay en un cambio en la coleccion de proyectos y actualizar automaticamente la lista de proyectos
onSnapshot(coleccionProyectos, (querySnapshot) => {
    const proyectos = [];
    querySnapshot.forEach((doc) => {
        proyectos.push({
            ...doc.data(),
            id: doc.id,
        });
    });
    GLOBAL.state.proyectos = proyectos;
});

onSnapshot(coleccionUsuarios, (querySnapshot) => {
    const usuarios = [];
    querySnapshot.forEach((doc) => {
        usuarios.push({
            ...doc.data(),
            id: doc.id,
        });
    });
    aUsers = usuarios
});

onSnapshot(coleccionBiblioteca, (querySnapshot) => {
    const bibliotecas = [];
    querySnapshot.forEach((doc) => {
        bibliotecas.push({
            ...doc.data(),
            id: doc.id,
        });
    });
    GLOBAL.state.bibliotecas = bibliotecas;
});

onSnapshot(coleccionConfig, (querySnapshot) => {
    const configs = [];
    querySnapshot.forEach((doc) => {
        configs.push({
            ...doc.data(),
            id: doc.id,
        });
    });
    GLOBAL.state.configs = configs;
});

onSnapshot(coleccionCalendario, (querySnapshot) => {
    const calendarios = [];
    querySnapshot.forEach((doc) => {
        calendarios.push({
            ...doc.data(),
            id: doc.id,
        });
    });
    GLOBAL.state.calendarios = calendarios;
});

onSnapshot(coleccionRiesgos, (querySnapshot) => {
    const riesgos = [];
    querySnapshot.forEach((doc) => {
        riesgos.push({
            ...doc.data(),
            id: doc.id,
        });
    });
    GLOBAL.state.riesgos = riesgos;
});



//Función para autorizar ingreso a la base de datos
async function CredentialIn(email, password) {
    try {
        const crearcredencial = await signInWithEmailAndPassword(auth, email, password)

        mensajes("A ingresado exitosamente", "green")
        location.href = "../app-web/index-app.html"
    } catch (error) {
        if (error.code === "auth/invalid-email") {
            mensajes("Correo inválido", "red")
        }
        else if (error.code === "auth/invalid-credential") {
            mensajes("Los datos proporcionados no son válidos", "red")
        }
    }

}
//función para cerrar la sesión de la aplicación
async function CredentialOut() {
    await signOut(auth)
    location.href = "../index.html"
}

// Exponer las funciones globalmente
GLOBAL.firestore = {
    getProyectos, //Carga todos los proyectos
    addProyecto,
    borrarProyecto,
    getProyecto,
    updateProyecto,
    CredentialIn, //para iniciar la aplicación, evoca la función en este módulo (CredentialIn(email,pass))
    CredentialOut, //para cerrar la aplicación
    getUsuarios, //función para verificar usuarios programadores
    getBibliotecas,
    getBiblioteca,
    addBiblioteca,
    borrarBiblioteca,
    updateBiblioteca,
    //////
    getCalendarios,
    getCalendario,
    addCalendario,
    borrarCalendario,
    updateCalendario,
    //////
    getConfigs,
    getConfig,
    updateConfig,
    //////
    getRiesgos,
    getRiesgos,
    updateRiesgos,
    //////
    CredentialIn2,
}

//Función que escucha el cambio en inicio o cerrar sesión
onAuthStateChanged(auth, async (user) => {
    try {
        mensajes("Registrado", "orange") //Muestra que usuarios está conectado
        activeEmail = user.email;
    } catch (error) {
        mensajes("Fuera de conexión", "red")
    }

})
async function CredentialIn2(email, password) {
    try {
        const crearcredencial = await signInWithEmailAndPassword(auth, email, password)
        //Registrado = 1
        openIni()
    } catch (error) {
        //location.href = "../index.html"
        //Registrado = 0
    }
}



