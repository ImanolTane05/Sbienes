import React, { useState, useEffect } from 'react';
import firebaseApp from '../firebase/credenciales';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

function AddSalidaOrgano() {
  const [fechaSalida, setFechaSalida] = useState('');
  const [resguardante, setResguardante] = useState('');
  const [organoForaneo, setOrganoForaneo] = useState('');
  const [motivo, setMotivo] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const usuariosCollection = collection(firestore, 'usuarios');
        const usuariosSnapshot = await getDocs(usuariosCollection);
        const usuariosList = usuariosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsuarios(usuariosList);
      } catch (error) {
        console.error('Error fetching users:', error);
        setError('Error fetching users.');
      }
    };

    fetchUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await addDoc(collection(firestore, 'salidas'), {
        fechaSalida,
        resguardante,
        organoForaneo,
        motivo,
        createdAt: new Date(),
        userId: auth.currentUser.uid
      });

      // Clear form after successful submission
      setFechaSalida('');
      setResguardante('');
      setOrganoForaneo('');
      setMotivo('');
    } catch (error) {
      console.error('Error adding salida:', error);
      setError('Error adding salida. Please try again.');
    }
  };

  return (
    <div>
      <h1>Agregar Salida de Órgano</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Fecha de Salida:
          <input
            type="date"
            value={fechaSalida}
            onChange={(e) => setFechaSalida(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Resguardante:
          <select
            value={resguardante}
            onChange={(e) => setResguardante(e.target.value)}
            required
          >
            <option value="">Selecciona un resguardante</option>
            {usuarios.map((usuario) => (
              <option key={usuario.id} value={usuario.id}>
                {usuario.nombre} {usuario.apellidoPaterno} {usuario.apellidoMaterno}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Órgano Foráneo:
          <input
            type="text"
            value={organoForaneo}
            onChange={(e) => setOrganoForaneo(e.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Motivo:
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Agregar Salida</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}

export default AddSalidaOrgano;
