import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Welcome from "./components/welcome";

import firebaseApp from "./firebase/credenciales";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getRol = useCallback(async (uid) => {
    try {
      const docuRef = doc(firestore, `usuarios/${uid}`);
      const docuCifrada = await getDoc(docuRef);
      return docuCifrada.data()?.rol || "user"; // Devuelve "user" si no hay rol en Firestore
    } catch (error) {
      console.error("Error obteniendo rol:", error);
      return "user"; // Valor predeterminado en caso de error
    }
  }, []); // Aquí se eliminó 'firestore' de las dependencias

  const setUserWithFirebaseAndRol = useCallback(async (usuarioFirebase) => {
    try {
      const rol = await getRol(usuarioFirebase.uid);
      const userData = {
        uid: usuarioFirebase.uid,
        email: usuarioFirebase.email,
        rol: rol,
      };
      setUser(userData);
      setLoading(false);
      console.log("userData final", userData);
    } catch (error) {
      console.error("Error configurando usuario:", error);
      setLoading(false);
    }
  }, [getRol]); // Aquí se mantiene 'getRol' como dependencia

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        if (!user) {
          setUserWithFirebaseAndRol(usuarioFirebase);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [user, setUserWithFirebaseAndRol]);

  if (loading) {
    return <div>Cargando...</div>; // Opcional: Añadir un indicador de carga
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={user ? <Home user={user} /> : <Welcome />} />
      </Routes>
    </Router>
  );
}

export default App;
