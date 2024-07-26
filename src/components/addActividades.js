import React, { useState } from "react";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import firebaseApp from "../firebase/credenciales"; // Asegúrate de que esta ruta es correcta

const firestore = getFirestore(firebaseApp);

function AddActividad() {
  const [titulo, setTitulo] = useState("");
  const [asunto, setAsunto] = useState("");
  const [prioridad, setPrioridad] = useState("");
  const [fecha, setFecha] = useState("");

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
      // Redirige al usuario a la vista de actividades después de agregar la actividad
      window.location.href = "/actividades";
    } catch (error) {
      console.error("Error añadiendo actividad:", error);
    }
  };

  return (
    <div>
      <h1>Añadir Actividad</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Asunto:</label>
          <input
            type="text"
            value={asunto}
            onChange={(e) => setAsunto(e.target.value)}
            required
          />
        </div>
        <div>
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
        <div>
          <label>Fecha:</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>
        <button type="submit">Añadir Actividad</button>
      </form>
    </div>
  );
}

export default AddActividad;
