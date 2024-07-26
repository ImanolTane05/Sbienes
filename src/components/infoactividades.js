import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import firebaseApp from "../firebase/credenciales"; // Asegúrate de que esta ruta es correcta

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
    try {
      const actividadDoc = doc(firestore, "actividades", id);
      await updateDoc(actividadDoc, { concluida: true });
      setActividad((prev) => ({ ...prev, concluida: true }));
    } catch (error) {
      console.error("Error concluding actividad:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const actividadDoc = doc(firestore, "actividades", id);
      await deleteDoc(actividadDoc);
      navigate('/actividades');
    } catch (error) {
      console.error("Error deleting actividad:", error);
    }
  };

  if (!actividad) return <p>Cargando...</p>;

  return (
    <div>
      <h1>Detalles de la Actividad</h1>
      <p><strong>Título:</strong> {actividad.titulo}</p>
      <p><strong>Asunto:</strong> {actividad.asunto}</p>
      <p><strong>Prioridad:</strong> {actividad.prioridad}</p>
      <p><strong>Fecha:</strong> {actividad.fecha}</p>
      <p><strong>Concluida:</strong> {actividad.concluida ? "Sí" : "No"}</p>
      <button onClick={handleConclude}>Concluir Actividad</button>
      <button onClick={handleDelete}>Eliminar Actividad</button>
      <button onClick={() => navigate(`/editactividad/${id}`)}>Editar Actividad</button>
    </div>
  );
}

export default InfoActividad;
