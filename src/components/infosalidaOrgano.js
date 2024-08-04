import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import styles from '../styles/salidas.module.css'; // Asegúrate de que la ruta sea correcta
import logo from '../img/logo.png';
import Pie from '../img/Pie.png';

const firestore = getFirestore();

function InfoSalidaOrgano() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salida, setSalida] = useState(null);
  const [resguardante, setResguardante] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSalida = async () => {
      try {
        const salidaDoc = doc(firestore, 'salidas', id);
        const salidaSnapshot = await getDoc(salidaDoc);
        if (salidaSnapshot.exists()) {
          const salidaData = salidaSnapshot.data();
          setSalida(salidaData);
          // Obtén el nombre del resguardante usando su UID
          if (salidaData.resguardante) {
            const userDoc = doc(firestore, 'usuarios', salidaData.resguardante);
            const userSnapshot = await getDoc(userDoc);
            if (userSnapshot.exists()) {
              const userData = userSnapshot.data();
              setResguardante(`${userData.nombre} ${userData.apellidoPaterno} ${userData.apellidoMaterno}`);
            } else {
              setResguardante('Resguardante no encontrado.');
            }
          }
        } else {
          setError('Salida no encontrada.');
        }
      } catch (error) {
        console.error('Error fetching salida:', error);
        setError('Error fetching salida.');
      }
    };

    fetchSalida();
  }, [id]);

  const handleUpdate = () => {
    navigate(`/editSalida/${id}`);
  };

  const handleDelete = async () => {
    try {
      // Confirmación de eliminación
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Una vez eliminada, no podrás recuperar esta salida.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#8A0046',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        // Eliminar salida
        await deleteDoc(doc(firestore, 'salidas', id));
        await Swal.fire(
          'Eliminado!',
          'La salida ha sido eliminada con éxito.',
          'success'
        );
        navigate('/salidas'); // Redirige a la página de salidas
      }
    } catch (error) {
      console.error('Error deleting salida:', error);
      setError('Error deleting salida.');
    }
  };

  const handleConclude = async () => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'Una vez concluida, no podrás modificar esta salida.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#8A0046',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, concluir',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await updateDoc(doc(firestore, 'salidas', id), {
          estado: 'Concluida'
        });
        setSalida(prevState => ({ ...prevState, estado: 'Concluida' }));
        await Swal.fire(
          'Concluida!',
          'La salida ha sido marcada como concluida.',
          'success'
        );
        navigate('/salidas'); // Redirige a la página de salidas
      }
    } catch (error) {
      console.error('Error concluding salida:', error);
      setError('Error concluding salida.');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>Detalles de la Salida</h1>
        <button className={styles.cancelButton} onClick={() => navigate('/salidas')}>Regresar</button>
      </header>
      <div className={styles.infoSection}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {salida ? (
          <div>
            <p><strong>Fecha de Salida:</strong> {salida.fechaSalida}</p>
            <p><strong>Resguardante:</strong> {resguardante}</p>
            <p><strong>Órgano Foráneo:</strong> {salida.organoForaneo}</p>
            <p><strong>Motivo:</strong> {salida.motivo}</p>
            <p><strong>Estado:</strong> {salida.estado || 'Pendiente'}</p>
            <div className={styles.buttonContainer}>
              <button className={styles.editButton} onClick={handleUpdate}>Actualizar</button>
              <button className={styles.deleteButton} onClick={handleDelete}>Eliminar</button>
              <button className={styles.concludeButton} onClick={handleConclude}>Concluir Salida</button>
            </div>
          </div>
        ) : (
          <p>Cargando...</p>
        )}
      </div>
      <footer className={styles.footer}>
        <img src={Pie} alt="Pie" className={styles.footerDecoration} />
      </footer>
    </div>
  );
}

export default InfoSalidaOrgano;
