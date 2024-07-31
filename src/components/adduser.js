import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import firebaseApp from '../firebase/credenciales';
import Swal from 'sweetalert2';
import logo from '../img/logo.png';
import Pie from '../img/Pie.png';
import styles from '../styles/adduser.module.css';
import { FaArrowCircleLeft, FaUserPlus } from 'react-icons/fa';

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

function AddUser() {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('user');
  const [error, setError] = useState('');
  const [foto, setFoto] = useState(null);
  const [fotoUrl, setFotoUrl] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const confirm = await Swal.fire({
      title: '¿Estás seguro?',
      text: "Se creará un nuevo usuario.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8A0046',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, crear',
      cancelButtonText: 'Cancelar'
    });

    if (confirm.isConfirmed) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        let fotoUrl = '';
        if (foto) {
          const fotoRef = ref(storage, `profile_pictures/${user.uid}`);
          await uploadBytes(fotoRef, foto);
          fotoUrl = await getDownloadURL(fotoRef);
        }

        const userRef = doc(firestore, `usuarios/${user.uid}`);
        await setDoc(userRef, {
          nombre,
          apellidos,
          email,
          rol,
          foto: fotoUrl,
        });

        await Swal.fire({
          title: '¡Éxito!',
          text: 'Usuario creado exitosamente.',
          icon: 'success',
          confirmButtonColor: '#8A0046',
          confirmButtonText: 'Aceptar'
        });

        navigate('/usuarios');
      } catch (error) {
        console.error('Error creando usuario:', error.message);
        setError('Error creando usuario. Verifica tus datos e intenta nuevamente.');

        await Swal.fire({
          title: 'Error',
          text: 'Hubo un problema al crear el usuario. Verifica tus datos e intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#8A0046',
          confirmButtonText: 'Aceptar'
        });
      }
    }
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
        <h1 className={styles['header-title']}>Agregar Usuario</h1>
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
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
            required
          />
          <input
            type="text"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            placeholder="Apellidos"
            required
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
          <select
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            required
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </select>
          <button type="submit" className={styles['add-user-button']}>Agregar Usuario <FaUserPlus /></button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      </main>
      <footer className={styles['add-user-footer']}>
        <img src={Pie} alt="Footer Decoration" className={styles['footer-decoration']} />
      </footer>
    </div>
  );
}

export default AddUser;
