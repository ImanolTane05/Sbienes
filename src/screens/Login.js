import React, { useState } from "react";
import firebaseApp from "../firebase/credenciales";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const auth = getAuth(firebaseApp);

function Login() {
  const [isRegistrando, setIsRegistrando] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook para navegación

  async function registrarUsuario(email, password, rol) {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // Aquí puedes agregar lógica para guardar el rol en Firestore si es necesario
      navigate("/home"); // Redirige a la página de inicio después del registro
    } catch (error) {
      console.error("Error registrando usuario:", error.message);
      setError("Error registrando usuario. Verifica tus datos e intenta nuevamente.");
    }
  }

  async function submitHandler(e) {
    e.preventDefault();
    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const rol = isRegistrando ? e.target.elements.rol.value : null;

    setError(""); // Limpiar errores anteriores

    if (isRegistrando) {
      // Registrar
      registrarUsuario(email, password, rol);
    } else {
      // Login
      try {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/home"); // Redirige a la página de inicio después del inicio de sesión
      } catch (error) {
        console.error("Error iniciando sesión:", error.message);
        setError("Error iniciando sesión. Verifica tus credenciales e intenta nuevamente.");
      }
    }
  }

  return (
    <div>
      <h1>{isRegistrando ? "Regístrate" : "Inicia sesión"}</h1>

      <form onSubmit={submitHandler}>
        <label>
          Correo electrónico:
          <input type="email" id="email" required />
        </label>

        <label>
          Contraseña:
          <input type="password" id="password" required />
        </label>

        {isRegistrando && (
          <label>
            Rol:
            <select id="rol" required>
              <option value="admin">Administrador</option>
              <option value="user">Usuario</option>
            </select>
          </label>
        )}

        <input
          type="submit"
          value={isRegistrando ? "Registrar" : "Iniciar sesión"}
        />
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button onClick={() => setIsRegistrando(!isRegistrando)}>
        {isRegistrando ? "Ya tengo una cuenta" : "Quiero registrarme"}
      </button>
    </div>
  );
}

export default Login;
