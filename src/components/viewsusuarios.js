import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus } from 'react-icons/fa'; // Importa el icono para el botón

function ViewsUsuarios() {
  const navigate = useNavigate();

  const handleAddUserClick = () => {
    navigate('/adduser'); // Redirige a la página de agregar usuario
  };

  return (
    <div>
      <header>
        <h1>Usuarios</h1>
      </header>
      <main>
        {/* Aquí va el contenido del componente */}
        <button className="add-user-button" onClick={handleAddUserClick}>
          <FaUserPlus size={20} />
          Agregar Usuario
        </button>
      </main>
    </div>
  );
}

export default ViewsUsuarios;
