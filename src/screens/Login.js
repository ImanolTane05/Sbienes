import React, { useState } from "react";
import firebaseApp from "../firebase/credenciales";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from '../App.module.css'; // Importa los estilos como un módulo CSS
import logo from '../img/logo.png';
import Pie from '../img/Pie.png';

const auth = getAuth(firebaseApp);

function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  async function submitHandler(e) {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

    setError(""); 

    // Login esquema
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home"); 
    } catch (error) {
      console.error("Error iniciando sesión:", error.message);
      setError("Error iniciando sesión. Verifica tus credenciales e intenta nuevamente.");
    }
  }

  return (
    <div className={styles.App}>
      <header>
        <img src={logo} alt="Logo" className={styles.logo} />
      </header>
      <main>
        <div className={styles.content}>
          <div className={styles.leftSide}>
            <h1>Departamento de Control de Bienes Muebles e Inmuebles</h1>
            <p>Sistema de Gestión de Entregas y Actividades del Departamento de Control de Bienes Muebles e Inmuebles del Poder Judicial del Estado de Tlaxcala</p>
          </div>
          <div className={styles.rightSide}>
            <h2>Inicia sesión</h2>
            <form onSubmit={submitHandler}>
              <div className={styles.formGroup}>
                <input type="email" id="email" placeholder="Correo electrónico" required />
              </div>
              <div className={styles.formGroup}>
                <input type="password" id="password" placeholder="Contraseña" required />
              </div>
              <button type="submit" className={styles.loginButton}>
                Iniciar sesión
              </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      </main>
      <footer>
        <img src={Pie} alt="Footer Decoration" className={styles.footerDecoration} />
      </footer>
    </div>
  );
}

export default Login;
