import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns";
import { es } from "date-fns/locale";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import logo from '../img/logo.png';
import Pie from '../img/Pie.png';
import styles from '../styles/activ.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faArrowLeft, faFileExport, faToggleOn, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const firestore = getFirestore();

function Actividades() {
  const [actividades, setActividades] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [viewConcluidas, setViewConcluidas] = useState(false);
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
    if (!viewConcluidas) {
      navigate(`/infoactividad/${id}`);
    }
  };

  const handleAddActividad = () => {
    navigate('/addactividad');
  };

  const toggleViewConcluidas = () => {
    setViewConcluidas(prevViewConcluidas => !prevViewConcluidas);
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
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>Extras</h1>
        <div className={styles.headerButtons}>
          <button className={styles.addButton} onClick={handleAddActividad}>
            <FontAwesomeIcon icon={faCirclePlus} /> Agregar
          </button>
          <button className={styles.regresarButton} onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} /> Regresar
          </button>
          <button className={styles.exportButton} onClick={handleExport}>
            <FontAwesomeIcon icon={faFileExport} /> Exportar
          </button>
          <button className={styles.toggleButton} onClick={toggleViewConcluidas}>
            <FontAwesomeIcon icon={faToggleOn} /> {viewConcluidas ? 'Ver No Concluidas' : 'Ver Concluidas'}
          </button>
        </div>
      </header>
      <div className={styles.mainContent}>
        <div className={styles.calendarContainer}>
          <Calendar className={styles.calendar} />
        </div>
        <div className={styles.activitiesContainer}>
          <div className={styles.weekNavigator}>
            <button className={styles.weekButton} onClick={() => handleWeekChange(false)}>
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <span className={styles.weekText}>
              {format(startDate, 'dd/MM/yyyy', { locale: es })} - {format(endDate, 'dd/MM/yyyy', { locale: es })}
            </span>
            <button className={styles.weekButton} onClick={() => handleWeekChange(true)}>
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>
          <div className={styles.activities}>
            {filteredActividades.map((actividad) => (
              <div
                key={actividad.id}
                className={`${styles.activityCard} ${actividad.concluida ? styles.activityCardDisabled : ''}`}
                onClick={() => handleViewActividad(actividad.id)}
              >
                <div className={styles.activityDate}>{actividad.fecha}</div>
                <div className={styles.activityTitle}>{actividad.titulo}</div>
                <div className={styles.activityContent}>
                  <p>{actividad.asunto}</p>
                  <p>Prioridad: {actividad.prioridad}</p>
                </div>
              </div>
            ))}
          </div>
        </div> 
      </div>
      <footer className={styles.footer}>
        <img src={Pie} alt="Footer Decoration" className={styles.footerDecoration} />
      </footer>
    </div>
  );
}

export default Actividades;
