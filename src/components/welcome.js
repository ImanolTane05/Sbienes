import React from "react";
import { useNavigate } from "react-router-dom";

function Welcome() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div>
      <h1>Hola, bienvenido</h1>
      <button onClick={handleLoginClick}>Iniciar sesión</button>
    </div>
  );
}

export default Welcome;
