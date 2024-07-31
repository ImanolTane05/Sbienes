import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, getDownloadURL, uploadBytes } from 'firebase/storage';
import firebaseApp from '../firebase/credenciales';
import Swal from 'sweetalert2';
import logo from '../img/logo.png';
import Pie from '../img/Pie.png';
import styles from '../styles/adduser.module.css';
import { FaArrowCircleLeft, FaUserPlus } from 'react-icons/fa'; // Asegúrate de incluir esta línea

const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

function EditUser() {
  const { id } = useParams();
  const [user, setUser] = useState({});
  const [error, setError] = useState('');
  const [foto, setFoto] = useState(null);
  const [fotoUrl, setFotoUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userRef = doc(firestore, `usuarios/${id}`);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUser(userData);
          if (userData.foto) {
            setFotoUrl(userData.foto);
          }
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

      // Actualizar la foto si se ha seleccionado una nueva
      if (foto) {
        const fotoRef = ref(storage, `profile_pictures/${id}`);
        await uploadBytes(fotoRef, foto);
        const newFotoUrl = await getDownloadURL(fotoRef);
        user.foto = newFotoUrl;
      }

      await updateDoc(userRef, user);
      Swal.fire({
        title: '¡Éxito!',
        text: 'Usuario actualizado exitosamente.',
        icon: 'success',
        confirmButtonColor: '#8A0046',
        confirmButtonText: 'Aceptar'
      });
      navigate('/usuarios'); // Redirige a la lista de usuarios después de la edición
    } catch (error) {
      setError('Error actualizando usuario');
      Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al actualizar el usuario. Inténtalo de nuevo.',
        icon: 'error',
        confirmButtonColor: '#8A0046',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({ ...prevUser, [name]: value }));
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackClick = () => {
    navigate('/home');
  };

  return (
    <div className={styles['add-user-panel']}>
      <header className={styles['add-user-header']}>
        <img src={logo} alt="Logo" className={styles['logo']} />
        <h1 className={styles['header-title']}>Editar Usuario</h1>
        <button className={styles['back-button']} onClick={handleBackClick}>
          <FaArrowCircleLeft size={20} />
          Regresar
        </button>
      </header>
      <main className={styles['add-user-content']}>
        <form onSubmit={handleSubmit} className={styles['add-user-form']}>
          <div className={styles['photo-upload-container']}>
            {fotoUrl ? (
              <img src={fotoUrl} alt="Foto de perfil" className={styles['photo-preview']} />
            ) : (
              <FaUserPlus className={styles['fa-user-plus']} />
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleFotoChange}
              className={styles['photo-upload-input']}
            />
          </div>
          <input
            type="text"
            name="nombre"
            value={user.nombre || ''}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
          <input
            type="text"
            name="apellidoPaterno"
            value={user.apellidoPaterno || ''}
            onChange={handleChange}
            placeholder="Apellido Paterno"
            required
          />
          <input
            type="text"
            name="apellidoMaterno"
            value={user.apellidoMaterno || ''}
            onChange={handleChange}
            placeholder="Apellido Materno"
            required
          />
          <input
            type="email"
            name="email"
            value={user.email || ''}
            onChange={handleChange}
            placeholder="Correo electrónico"
            required
          />
          <select
            name="rol"
            value={user.rol || 'user'}
            onChange={handleChange}
            required
          >
            <option value="admin">Administrador</option>
            <option value="user">Usuario</option>
          </select>
          <button type="submit" className={styles['add-user-button']}>Actualizar Usuario</button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </main>
      <footer className={styles['add-user-footer']}>
        <img src={Pie} alt="Footer Decoration" className={styles['footer-decoration']} />
      </footer>
    </div>
  );
}

export default EditUser;
