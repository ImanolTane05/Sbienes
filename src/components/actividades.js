import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns";
import { es } from "date-fns/locale";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

const firestore = getFirestore();

function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [viewConcluidas, setViewConcluidas] = useState(false); // Estado para controlar la vista de actividades concluidas
  const [date] = useState(new Date()); // Fecha actual
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        const actividadesCollection = collection(firestore, "actividades");
        const actividadesSnapshot = await getDocs(actividadesCollection);
        const actividadesList = actividadesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setActividades(actividadesList);
      } catch (error) {
        console.error("Error fetching actividades:", error);
      }
    };

    fetchActividades();
  }, []);

  const handleWeekChange = (increment) => {
    setSelectedWeek(prevDate => 
      increment ? addWeeks(prevDate, 1) : subWeeks(prevDate, 1)
    );
  };

  const handleExport = () => {
    const startDate = startOfWeek(selectedWeek, { locale: es });
    const endDate = endOfWeek(selectedWeek, { locale: es });

    const actividadesConcluidas = actividades.filter(
      actividad =>
        actividad.concluida &&
        new Date(actividad.fecha) >= startDate &&
        new Date(actividad.fecha) <= endDate
    );

    const actividadesNoConcluidas = actividades.filter(
      actividad =>
        !actividad.concluida &&
        new Date(actividad.fecha) >= startDate &&
        new Date(actividad.fecha) <= endDate
    );

    let content = `Actividades Concluidas (Semana del ${format(startDate, 'dd MMM yyyy', { locale: es })} al ${format(endDate, 'dd MMM yyyy', { locale: es })}):\n\n`;
    actividadesConcluidas.forEach(actividad => {
      content += `Título: ${actividad.titulo}\nAsunto: ${actividad.asunto}\nPrioridad: ${actividad.prioridad}\nFecha: ${actividad.fecha}\n\n`;
    });

    content += `\nActividades No Concluidas:\n\n`;
    actividadesNoConcluidas.forEach(actividad => {
      content += `Título: ${actividad.titulo}\nAsunto: ${actividad.asunto}\nPrioridad: ${actividad.prioridad}\nFecha: ${actividad.fecha}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `actividades_${format(startDate, 'yyyyMMdd')}_${format(endDate, 'yyyyMMdd')}.txt`;
    link.click();
  };

  const handleViewActividad = (id) => {
    navigate(`/infoactividad/${id}`);
  };

  const startDate = startOfWeek(selectedWeek, { locale: es });
  const endDate = endOfWeek(selectedWeek, { locale: es });

  const filteredActividades = viewConcluidas
    ? actividades.filter(actividad =>
        actividad.concluida &&
        new Date(actividad.fecha) >= startDate &&
        new Date(actividad.fecha) <= endDate
      )
    : actividades.filter(actividad =>
        !actividad.concluida &&
        new Date(actividad.fecha) >= startDate &&
        new Date(actividad.fecha) <= endDate
      );

  return (
    <div>
      <h1>Actividades</h1>
      <div>
        <button onClick={() => navigate('/addactividad')}>Añadir Actividad</button>
        <button onClick={() => setViewConcluidas(false)}>Actividades No Concluidas</button>
        <button onClick={() => setViewConcluidas(true)}>Actividades Concluidas</button>
        <button onClick={handleExport}>Exportar Actividades</button>
      </div>
      <div>
        <h2>Lista de Actividades</h2>
        <div>
          <button onClick={() => handleWeekChange(false)}>Semana Anterior</button>
          <span>Semana del {format(startDate, 'dd MMM yyyy', { locale: es })} al {format(endDate, 'dd MMM yyyy', { locale: es })}</span>
          <button onClick={() => handleWeekChange(true)}>Semana Siguiente</button>
        </div>
        <ul>
          {filteredActividades.map((actividad) => (
            <li key={actividad.id}>
              <strong>Título:</strong> {actividad.titulo}<br />
              <strong>Asunto:</strong> {actividad.asunto}<br />
              <strong>Prioridad:</strong> {actividad.prioridad}<br />
              <strong>Fecha:</strong> {actividad.fecha}<br />
              {!viewConcluidas && (
                <button onClick={() => handleViewActividad(actividad.id)}>Ver Detalles</button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Fecha Actual</h3>
        <Calendar value={date} />
      </div>
    </div>
  );
}

export default Actividades;
