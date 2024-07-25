// src/components/EditUser.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import firebaseApp from '../firebase/credenciales';

const firestore = getFirestore(firebaseApp);

function EditUser() {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = doc(firestore, `usuarios/${id}`);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data());
        } else {
          setError('Usuario no encontrado');
        }
      } catch (error) {
        setError('Error cargando usuario');
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(firestore, `usuarios/${id}`);
      await updateDoc(userRef, user);
      navigate('/usuarios'); // Redirige a la lista de usuarios después de la edición
    } catch (error) {
      setError('Error actualizando usuario');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  return (
    <div>
      <h1>Editar Usuario</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            name="nombre"
            value={user.nombre || ''}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Apellido Paterno:
          <input
            type="text"
            name="apellidoPaterno"
            value={user.apellidoPaterno || ''}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Apellido Materno:
          <input
            type="text"
            name="apellidoMaterno"
            value={user.apellidoMaterno || ''}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Correo electrónico:
          <input
            type="email"
            name="email"
            value={user.email || ''}
            onChange={handleChange}
            required
          />
        </label>
        <br />
        <label>
          Rol:
          <select
            name="rol"
            value={user.rol || 'user'}
            onChange={handleChange}
            required
          >
            <option value="admin">Administrador</option>
            <option value="user">Usuario</option>
          </select>
        </label>
        <br />
        <input type="submit" value="Actualizar Usuario" />
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default EditUser;
