import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseApp from "../firebase/credenciales"; // Asegúrate de que esta ruta es correcta
import logo from '../img/logo.png';
import Pie from '../img/Pie.png';
import styles from '../styles/activ.module.css'; 
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; // Importa SweetAlert

const firestore = getFirestore(firebaseApp);

function AddActividad() {
  const [titulo, setTitulo] = useState("");
  const [asunto, setAsunto] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [fecha, setFecha] = useState("");
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/actividades'); // Redirige a la página de actividades
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const actividadesCollection = collection(firestore, "actividades");
      await addDoc(actividadesCollection, {
        titulo,
        asunto,
        prioridad,
        fecha,
        concluida: false, // Por defecto, la actividad no está concluida
      });
      // Muestra la alerta de éxito
      Swal.fire({
        icon: 'success',
        title: 'Actividad agregada',
        text: 'La actividad se ha agregado con éxito.',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        navigate("/actividades"); // Redirige a la vista de actividades
      });
    } catch (error) {
      console.error("Error añadiendo actividad:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al agregar la actividad.',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.cancelButton} onClick={handleCancel}>
          <i className="fa-times"></i> Cancelar
        </button>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>Añadir Actividad</h1>
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
        <button type="submit" className={styles.submitButton}>Añadir Actividad</button>
      </form>
      <footer className={styles.footer}>
        <img src={Pie} alt="Footer Decoration" className={styles.footerDecoration} />
      </footer>
    </div>
  );
}

export default AddActividad;
