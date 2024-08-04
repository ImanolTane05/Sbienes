import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore'; // Asegúrate de importar todos los métodos necesarios
import Swal from 'sweetalert2';
import styles from '../styles/salidas.module.css';
import logo from '../img/logo.png';
import Pie from '../img/Pie.png';

const firestore = getFirestore();

function EditSalida() {
  const { id } = useParams();
  const [salida, setSalida] = useState({
    fechaSalida: '',
    resguardante: '',
    organoForaneo: '',
    motivo: ''
  });
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalida = async () => {
      try {
        const salidaDoc = doc(firestore, 'salidas', id);
        const salidaSnapshot = await getDoc(salidaDoc);
        if (salidaSnapshot.exists()) {
          setSalida(salidaSnapshot.data());
        } else {
          setError('Salida no encontrada.');
        }
      } catch (error) {
        console.error('Error fetching salida:', error);
        setError('Error fetching salida.');
      }
    };

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

    fetchSalida();
    fetchUsuarios();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalida(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(firestore, 'salidas', id), salida);
      Swal.fire({
        icon: 'success',
        title: 'Actualizado',
        text: 'La salida ha sido actualizada con éxito.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        navigate('/salidas'); // Redirige a la vista Organos
      });
    } catch (error) {
      console.error('Error updating salida:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al actualizar la salida.',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.cancelButton} onClick={() => navigate('/salidas')}>
          <i className="fa fa-arrow-left"></i> 
        </button>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>Actualizar Salida de Órgano</h1>
      </header>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Fecha de Salida:</label>
          <input
            type="date"
            name="fechaSalida"
            value={salida.fechaSalida}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Resguardante:</label>
          <select
            name="resguardante"
            value={salida.resguardante}
            onChange={handleChange}
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
            name="organoForaneo"
            value={salida.organoForaneo}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Motivo:</label>
          <textarea
            name="motivo"
            value={salida.motivo}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Actualizar</button>
        <button type="button" className={styles.cancelButton} onClick={() => navigate('/salidas')}>Cancelar</button>
      </form>
      <footer className={styles.footer}>
        <img src={Pie} alt="Footer Decoration" className={styles.footerDecoration} />
      </footer>
    </div>
  );
}

export default EditSalida;
