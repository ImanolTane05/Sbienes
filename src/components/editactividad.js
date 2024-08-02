import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import firebaseApp from "../firebase/credenciales"; // Asegúrate de que esta ruta es correcta
import logo from '../img/logo.png'; // Asegúrate de que la ruta es correcta
import Pie from '../img/Pie.png'; // Asegúrate de que la ruta es correcta
import styles from '../styles/activ.module.css'; // Asegúrate de que esta ruta es correcta
import Swal from 'sweetalert2'; // Importa SweetAlert

const firestore = getFirestore(firebaseApp);

function EditActividad() {
  const { id } = useParams();
  const [titulo, setTitulo] = useState("");
  const [asunto, setAsunto] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [fecha, setFecha] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActividad = async () => {
      try {
        const actividadDoc = doc(firestore, "actividades", id);
        const actividadSnapshot = await getDoc(actividadDoc);
        if (actividadSnapshot.exists()) {
          const data = actividadSnapshot.data();
          setTitulo(data.titulo);
          setAsunto(data.asunto);
          setPrioridad(data.prioridad);
          setFecha(data.fecha);
        } else {
          console.log("Actividad no encontrada");
        }
      } catch (error) {
        console.error("Error fetching actividad:", error);
      }
    };

    fetchActividad();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const actividadDoc = doc(firestore, "actividades", id);
      await updateDoc(actividadDoc, {
        titulo,
        asunto,
        prioridad,
        fecha,
      });
      // Muestra la alerta de éxito
      Swal.fire({
        icon: 'success',
        title: 'Actividad Actualizada',
        text: 'La actividad se ha actualizado con éxito.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        navigate(`/infoactividad/${id}`); // Redirige a la vista de información de la actividad
      });
    } catch (error) {
      console.error("Error updating actividad:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al actualizar la actividad.',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const handleCancel = () => {
    navigate(`/infoactividad/${id}`); // Redirige a la página de información de la actividad
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.cancelButton} onClick={handleCancel}>
          <i className="fa-times"></i> Cancelar
        </button>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>Editar Actividad</h1>
      </header>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Título:</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Asunto:</label>
          <input
            type="text"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label>Prioridad:</label>
          <select
            value={prioridad}
            onChange={(e) => setPrioridad(e.target.value)}
            required
          >
            <option value="">Seleccionar...</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label>Fecha:</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>
        <button type="submit" className={styles.submitButton}>Actualizar Actividad</button>
      </form>
      <footer className={styles.footer}>
        <img src={Pie} alt="Footer Decoration" className={styles.footerDecoration} />
      </footer>
    </div>
  );
}

export default EditActividad;
