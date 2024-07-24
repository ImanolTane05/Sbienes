// Importamos la función para inicializar la aplicación de Firebase
import { initializeApp } from "firebase/app";

// Añade aquí tus credenciales
const firebaseConfig = {
    apiKey: "AIzaSyBqsvyrtvf7Dtp1gIxIlMZVdYlEin87n7Q",
    authDomain: "sistemab-1f486.firebaseapp.com",
    projectId: "sistemab-1f486",
    storageBucket: "sistemab-1f486.appspot.com",
    messagingSenderId: "452310295220",
    appId: "1:452310295220:web:54614d674a2a54f5aa2de1"
  
};

// Inicializamos la aplicación y la guardamos en firebaseApp
const firebaseApp = initializeApp(firebaseConfig);
// Exportamos firebaseApp para poder utilizarla en cualquier lugar de la aplicación
export default firebaseApp;