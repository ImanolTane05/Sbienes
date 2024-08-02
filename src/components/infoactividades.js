import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import firebaseApp from "../firebase/credenciales";
import styles from '../styles/activ.module.css'; // Importa los estilos
import logo from '../img/logo.png';
import Pie from '../img/Pie.png';
import Swal from 'sweetalert2';

const firestore = getFirestore(firebaseApp);

function InfoActividad() {
  const { id } = useParams();
  const [actividad, setActividad] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActividad = async () => {
      try {
        const actividadDoc = doc(firestore, "actividades", id);
        const actividadSnapshot = await getDoc(actividadDoc);
        if (actividadSnapshot.exists()) {
          setActividad({ id: actividadSnapshot.id, ...actividadSnapshot.data() });
        } else {
          console.log("Actividad no encontrada");
        }
      } catch (error) {
        console.error("Error fetching actividad:", error);
      }
    };

    fetchActividad();
  }, [id]);

  const handleConclude = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez que concluyas la actividad, no podrás deshacerlo.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8A0046',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, concluir',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const actividadDoc = doc(firestore, "actividades", id);
        await updateDoc(actividadDoc, { concluida: true });
        setActividad((prev) => ({ ...prev, concluida: true }));
        Swal.fire(
          '¡Concluida!',
          'La actividad ha sido concluida con éxito.',
          'success'
        );
      } catch (error) {
        console.error("Error concluding actividad:", error);
        Swal.fire(
          'Error',
          'Hubo un problema al concluir la actividad.',
          'error'
        );
      }
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Una vez que elimines la actividad, no podrás recuperarla.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#8A0046',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      try {
        const actividadDoc = doc(firestore, "actividades", id);
        await deleteDoc(actividadDoc);
        navigate('/actividades');
        Swal.fire(
          '¡Eliminada!',
          'La actividad ha sido eliminada con éxito.',
          'success'
        );
      } catch (error) {
        console.error("Error deleting actividad:", error);
        Swal.fire(
          'Error',
          'Hubo un problema al eliminar la actividad.',
          'error'
        );
      }
    }
  };

  if (!actividad) return <p>Cargando...</p>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.cancelButton} onClick={() => navigate('/actividades')}>
          <i className="fa-times"></i> Regresar
        </button>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>Detalles de la Actividad</h1>
      </header>
      <div className={styles.infoSection}>
        <p><strong>Título:</strong> {actividad.titulo}</p>
        <p><strong>Asunto:</strong> {actividad.asunto}</p>
        <p><strong>Prioridad:</strong> {actividad.prioridad}</p>
        <p><strong>Fecha:</strong> {actividad.fecha}</p>
        <p><strong>Concluida:</strong> {actividad.concluida ? "Sí" : "No"}</p>
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.concludeButton} onClick={handleConclude}>Concluir Actividad</button>
        <button className={styles.deleteButton} onClick={handleDelete}>Eliminar Actividad</button>
        <button className={styles.editButton} onClick={() => navigate(`/editactividad/${id}`)}>Editar Actividad</button>
      </div>
      <footer className={styles.footer}>
        <img src={Pie} alt="Footer Decoration" className={styles.footerDecoration} />
      </footer>
    </div>
  );
}

export default InfoActividad;
