import React, { useState, useEffect } from 'react';
import firebaseApp from '../firebase/credenciales';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import logo from '../img/logo.png';
import Pie from '../img/Pie.png';
import styles from '../styles/salidas.module.css';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const firestore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

function AddSalidaOrgano() {
  const [fechaSalida, setFechaSalida] = useState('');
  const [resguardante, setResguardante] = useState('');
  const [organoForaneo, setOrganoForaneo] = useState(''); 
  const [motivo, setMotivo] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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

  const handleCancel = () => {
    navigate('/salidas');
  };

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

      Swal.fire({
        icon: 'success',
        title: 'Salida agregada',
        text: 'La salida se ha agregado con éxito.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        navigate("/salidas");
      });

      // Clear form after successful submission
      setFechaSalida('');
      setResguardante('');
      setOrganoForaneo('');
      setMotivo('');
    } catch (error) {
      console.error('Error adding salida:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al agregar la salida.',
        confirmButtonText: 'Aceptar'
      });
      setError('Error adding salida. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.cancelButton} onClick={handleCancel}>
          <i className="fa-times"></i> Cancelar
        </button>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>Agregar Salida de Órgano</h1>
      </header>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Fecha de Salida:</label>
          <input
            type="date"
            value={fechaSalida}
            onChange={(e) => setFechaSalida(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Resguardante:</label>
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
        </div>
        <div className={styles.formGroup}>
          <label>Órgano Foráneo:</label>
          <input
            type="text"
            value={organoForaneo}
            onChange={(e) => setOrganoForaneo(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Motivo:</label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Agregar Salida</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <footer className={styles.footer}>
        <img src={Pie} alt="Footer Decoration" className={styles.footerDecoration} />
      </footer>
    </div>
  );
}

export default AddSalidaOrgano;
