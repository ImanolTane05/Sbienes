import React, { useState, useEffect, useCallback } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Welcome from "./components/welcome";
import PoliticasCondiciones from "./components/politicasCondiciones";
import ViewsUsuarios from './components/viewsusuarios';
import AddUser from './components/adduser'; 
import EditUser from './components/EditUser';
import Organos from './components/salidasOrganos'; 
import AddSalidaOrgano from './components/addsalidaOrgano';
import InfoSalidaOrgano from "./components/infosalidaOrgano";
import EditSalida from "./components/EditSalida";
import SalidasConcluidas from "./components/salidasconcluidas";
import Actividades from "./components/actividades";
import AddActividad from "./components/addActividades";
import InfoActividad from "./components/infoactividades"
import EditActividad from "./components/editactividad";
import ActConcluidas from "./components/actconcluidas";
import IndexEntregas from "./components/indexentregas";
import AddEntregas from "./components/addentregas";
import EntregasPendientes from './components/entregaspendientes';
import EntregasConcluidas from './components/entregasConcluidas';
import InfoEntregas from './components/infoentregas';

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
      return docuCifrada.data()?.rol || "user";
    } catch (error) {
      console.error("Error obteniendo rol:", error);
      return "user";
    }
  }, []);

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
    } catch (error) {
      console.error("Error configurando usuario:", error);
      setLoading(false);
    }
  }, [getRol]);

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

    return () => unsubscribe();
  }, [user, setUserWithFirebaseAndRol]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={user ? <Home user={user} /> : <Welcome />} />
        <Route path="/politicas-condiciones" element={<PoliticasCondiciones />} />
        <Route path="/usuarios" element={<ViewsUsuarios />} />
        <Route path="/adduser" element={<AddUser />} />
        <Route path="/edituser/:id" element={<EditUser />} />
        <Route path="/salidas" element={<Organos />} /> 
        <Route path="/addsalida" element={<AddSalidaOrgano />} />
        <Route path="/infosalida/:id" element={<InfoSalidaOrgano />} />
        <Route path="/editSalida/:id" element={<EditSalida />} />
        <Route path="/salidas-concluidas" element={<SalidasConcluidas />} />
        <Route path="/actividades" element={<Actividades />} />
        <Route path="/addactividad" element={<AddActividad />} />
        <Route path="/infoactividad/:id" element={<InfoActividad />} />
        <Route path="/editactividad/:id" element={<EditActividad />} />
        <Route path="/actconcluidas" element={<ActConcluidas />} />
        <Route path="/indexentregas" element={<IndexEntregas />} />
        <Route path="/addentregas" element={<AddEntregas />} />
        <Route path="/entregaspendientes" element={<EntregasPendientes />} />
        <Route path="/entregasconcluidas" element={<EntregasConcluidas />} />
        <Route path="/infoentrega/:id" element={<InfoEntregas />} />
        

      </Routes>
    </Router>
  );
}

export default App;
