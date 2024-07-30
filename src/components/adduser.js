import React, { useState } from 'react';
import firebaseApp from '../firebase/credenciales';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

function AddUser() {
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('user');
  const [error, setError] = useState('');
  const [foto, setFoto] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Subir foto de perfil a Firebase Storage
      let fotoUrl = '';
      if (foto) {
        const fotoRef = ref(storage, `profile_pictures/${user.uid}`);
        await uploadBytes(fotoRef, foto);
        fotoUrl = await getDownloadURL(fotoRef);
      }

      // Guardar datos adicionales en Firestore
      const userRef = doc(firestore, `usuarios/${user.uid}`);
      await setDoc(userRef, {
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        email,
        rol,
        foto: fotoUrl, // Guarda la URL de la foto en Firestore
      });

      // Redirigir después de crear el usuario
      navigate('/usuarios');
    } catch (error) {
      console.error('Error creando usuario:', error.message);
      setError('Error creando usuario. Verifica tus datos e intenta nuevamente.');
    }
  };

  return (
    <div>
      <h1>Agregar Usuario</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Nombre:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Apellido Paterno:
          <input
            type="text"
            value={apellidoPaterno}
            onChange={(e) => setApellidoPaterno(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Apellido Materno:
          <input
            type="text"
            value={apellidoMaterno}
            onChange={(e) => setApellidoMaterno(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Correo electrónico:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Contraseña:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Rol:
          <select value={rol} onChange={(e) => setRol(e.target.value)} required>
            <option value="admin">Administrador</option>
            <option value="user">Usuario</option>
          </select>
        </label>
        <br />
        <label>
          Foto de perfil:
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFoto(e.target.files[0])}
          />
        </label>
        <br />
        <input type="submit" value="Agregar Usuario" />
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default AddUser;