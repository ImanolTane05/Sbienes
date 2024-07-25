import React from "react";
import AdminView from "../components/AdminView";
import UserView from "../components/UserViews";
import firebaseApp from "../firebase/credenciales";
import { getAuth, signOut } from "firebase/auth";

const auth = getAuth(firebaseApp);

function Home({ user }) {
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      // Aquí puedes añadir más lógica para mostrar un mensaje al usuario
    }
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={handleSignOut}>Cerrar sesión</button>
      {user.rol === "admin" ? <AdminView /> : <UserView />}
    </div>
  );
}

export default Home;
