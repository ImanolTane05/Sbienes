import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import firebaseApp from "../firebase/credenciales"; // Asegúrate de que esta ruta es correcta

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
      navigate(`/infoactividad/${id}`);
    } catch (error) {
      console.error("Error updating actividad:", error);
    }
  };

  return (
    <div>
      <h1>Editar Actividad</h1>
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
        <button type="submit">Actualizar Actividad</button>
      </form>
    </div>
  );
}

export default EditActividad;
