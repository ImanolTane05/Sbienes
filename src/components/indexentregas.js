import React from 'react';
import { useNavigate } from 'react-router-dom';

function IndexEntregas() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      <h1>Index de Entregas</h1>
      <button onClick={() => handleNavigation('/addentregas')}>Agregar Entrega</button>
      <button onClick={() => handleNavigation('/entregasconcluidas')}>Entregas Concluidas</button>
      <button onClick={() => handleNavigation('/entregaspendientes')}>Entregas Pendientes</button>
      {/* Aquí va el contenido de la página de Entregas */}
    </div>
  );
}

export default IndexEntregas;
