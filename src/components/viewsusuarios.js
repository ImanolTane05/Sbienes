import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaEdit, FaTrash, FaArrowCircleLeft } from 'react-icons/fa'; // Importa los iconos para los botones
import { getFirestore, collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import firebaseApp from '../firebase/credenciales'; // Asegúrate de importar la configuración de Firebase
import logo from '../img/logo.png';
import Pie from '../img/Pie.png';
import '../styles/usuarios.css';

const firestore = getFirestore(firebaseApp);

function ViewsUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const usuariosCollection = collection(firestore, 'usuarios');
        const usuariosSnapshot = await getDocs(usuariosCollection);
        const usuariosList = usuariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsuarios(usuariosList);
      } catch (error) {
        console.error('Error obteniendo usuarios:', error);
      }
    };

    fetchUsuarios();
  }, []);

  const handleAddUserClick = () => {
    navigate('/adduser'); // Redirige a la página de agregar usuario
  };

  const handleEditClick = (id) => {
    navigate(`/edituser/${id}`); // Redirige a la página de editar usuario
  };

  const handleDeleteClick = async (id) => {
    try {
      await deleteDoc(doc(firestore, `usuarios/${id}`));
      setUsuarios(usuarios.filter(usuario => usuario.id !== id));
    } catch (error) {
      console.error('Error eliminando usuario:', error);
    }
  };

  const handleBackClick = () => {
    navigate('/adminview'); // Redirige a la página de administración
  };

  return (
    <div className="add-user-panel">
      <header className="add-user-header">
        <img src={logo} alt="Logo" className="logo" />
        <h1 className="header-title">Usuarios</h1>
        <button className="back-button" onClick={handleBackClick}>
          <FaArrowCircleLeft size={20} />
          Regresar
        </button>
      </header>
      <main className="add-user-content">
        <button className="add-user-button" onClick={handleAddUserClick}>
          <FaUserPlus size={20} />
          Agregar Usuario
        </button>
        <div className="usuarios-list">
          {usuarios.length === 0 ? (
            <p>No hay usuarios registrados.</p>
          ) : (
            usuarios.map(usuario => (
              <div key={usuario.id} className="usuario-card">
                <img src={usuario.foto || 'default-profile.png'} alt={`${usuario.nombre} ${usuario.apellidoPaterno}`} className="usuario-photo" />
                <div className="usuario-info">
                  <h3>{usuario.nombre} {usuario.apellidoPaterno} {usuario.apellidoMaterno}</h3>
                  <p>Correo: {usuario.email}</p>
                  <p>Rol: {usuario.rol}</p>
                </div>
                <div className="usuario-actions">
                  <button className="action-button edit-button" onClick={() => handleEditClick(usuario.id)}>
                    <FaEdit size={16} />
                    Editar
                  </button>
                  <button className="action-button delete-button" onClick={() => handleDeleteClick(usuario.id)}>
                    <FaTrash size={16} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <footer className="add-user-footer">
        <img src={Pie} alt="Footer Decoration" className="footer-decoration" />
      </footer>
    </div>
  );
}

export default ViewsUsuarios;
