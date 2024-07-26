import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { parseISO } from "date-fns";

const firestore = getFirestore();

function ActConcluidas() {
  const [actividades, setActividades] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const location = useLocation();

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const actividadesCollection = collection(firestore, "actividades");
        const actividadesSnapshot = await getDocs(actividadesCollection);
        const actividadesList = actividadesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Filtrar actividades concluidas y por fecha
        setActividades(
          actividadesList.filter(
            (actividad) =>
              actividad.concluida &&
              new Date(actividad.fecha) >= startDate &&
              new Date(actividad.fecha) <= endDate
          )
        );
      } catch (error) {
        console.error("Error fetching actividades:", error);
      }
    };

    const queryParams = new URLSearchParams(location.search);
    const start = queryParams.get("start");
    const end = queryParams.get("end");

    if (start && end) {
      setStartDate(parseISO(start));
      setEndDate(parseISO(end));
    }

    fetchActividades();
  }, [location.search, startDate, endDate]);

  return (
    <div>
      <h1>Actividades Concluidas</h1>
      <button onClick={() => window.history.back()}>Regresar</button>
      <h2>Lista de Actividades Concluidas</h2>
      <ul>
        {actividades.map((actividad) => (
          <li key={actividad.id}>
            <strong>Título:</strong> {actividad.titulo}<br />
            <strong>Asunto:</strong> {actividad.asunto}<br />
            <strong>Prioridad:</strong> {actividad.prioridad}<br />
            <strong>Fecha:</strong> {actividad.fecha}<br />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActConcluidas;
