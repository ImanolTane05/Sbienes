import React, { useState } from "react";
import firebaseApp from "../firebase/credenciales";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import logo from '../img/logo.png';
import Pie from '../img/Pie.png';
import '../App.css';

const auth = getAuth(firebaseApp);

function Login() {
  const [error, setError] = useState("");
  const navigate = useNavigate(); 

  async function submitHandler(e) {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;

    setError(""); 

    // Login esquelo 
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/home"); 
    } catch (error) {
      console.error("Error iniciando sesión:", error.message);
      setError("Error iniciando sesión. Verifica tus credenciales e intenta nuevamente.");
    }
  }

  return (
    <div className="App">
      <header>
        <img src={logo} alt="Logo" className="logo" />
      </header>
      <main>
        <div className="content">
          <div className="left-side">
            <h1>Departamento de Control de Bienes Muebles e Inmuebles</h1>
            <p>Sistema de Gestión de Entregas y Actividades del Departamento de Control de Bienes Muebles e Inmuebles del Poder Judicial del Estado de Tlaxcala</p>
          </div>
          <div className="right-side">
            <h2>Inicia sesión</h2>
            <form onSubmit={submitHandler}>
              <div className="form-group">
                <input type="email" id="email" placeholder="Correo electrónico" required />
              </div>
              <div className="form-group">
                <input type="password" id="password" placeholder="Contraseña" required />
              </div>
              <button type="submit" className="login-button">
                Iniciar sesión
              </button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
          </div>
        </div>
      </main>
      <footer>
        <img src={Pie} alt="Footer Decoration" className="footer-decoration" />
      </footer>
    </div>
  );
}

export default Login;
