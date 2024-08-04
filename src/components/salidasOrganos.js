import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import logo from '../img/logo.png';
import Pie from '../img/Pie.png';
import styles from '../styles/salidas.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faFileExport, faToggleOn, faChevronLeft, faChevronRight, faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

const firestore = getFirestore();

function Salidas() {
  const [salidas, setSalidas] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [viewConcluidas, setViewConcluidas] = useState(false);
  const [date] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalidas = async () => {
      try {
        const salidasCollection = collection(firestore, 'salidas');
        const salidasSnapshot = await getDocs(salidasCollection);
        const salidasList = salidasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSalidas(salidasList);
      } catch (error) {
        console.error('Error fetching salidas:', error);
      }
    };

    const fetchUsuarios = async () => {
      try {
        const usuariosCollection = collection(firestore, 'usuarios');
        const usuariosSnapshot = await getDocs(usuariosCollection);
        const usuariosList = usuariosSnapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          acc[doc.id] = `${data.nombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`;
          return acc;
        }, {});
        setUsuarios(usuariosList);
      } catch (error) {
        console.error('Error fetching usuarios:', error);
      }
    };

    fetchSalidas();
    fetchUsuarios();
  }, []);

  const handleViewSalida = (id, estado) => {
    if (estado !== 'Concluida') {
      navigate(`/infosalida/${id}`);
    }
  };

  const handleWeekChange = (increment) => {
    setSelectedWeek(prevDate => 
      increment ? addWeeks(prevDate, 1) : subWeeks(prevDate, 1)
    );
  };

  const handleExport = () => {
    const startDate = startOfWeek(selectedWeek, { locale: es });
    const endDate = endOfWeek(selectedWeek, { locale: es });

    const salidasConcluidas = salidas.filter(salida =>
      salida.estado === 'Concluida' &&
      new Date(salida.fechaSalida) >= startDate &&
      new Date(salida.fechaSalida) <= endDate
    );

    const salidasNoConcluidas = salidas.filter(salida =>
      salida.estado !== 'Concluida' &&
      new Date(salida.fechaSalida) >= startDate &&
      new Date(salida.fechaSalida) <= endDate
    );

    let content = `Salidas Concluidas (Semana del ${format(startDate, 'dd MMM yyyy', { locale: es })} al ${format(endDate, 'dd MMM yyyy', { locale: es })}):\n\n`;
    salidasConcluidas.forEach(salida => {
      content += `Fecha de Salida: ${salida.fechaSalida}\nResguardante: ${usuarios[salida.resguardante] || 'Desconocido'}\nÓrgano Foráneo: ${salida.organoForaneo}\nMotivo: ${salida.motivo}\n\n`;
    });

    content += `\nSalidas No Concluidas:\n\n`;
    salidasNoConcluidas.forEach(salida => {
      content += `Fecha de Salida: ${salida.fechaSalida}\nResguardante: ${usuarios[salida.resguardante] || 'Desconocido'}\nÓrgano Foráneo: ${salida.organoForaneo}\nMotivo: ${salida.motivo}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `salidas_${format(startDate, 'yyyyMMdd')}_${format(endDate, 'yyyyMMdd')}.txt`;
    link.click();
  };

  const startDate = startOfWeek(selectedWeek, { locale: es });
  const endDate = endOfWeek(selectedWeek, { locale: es });

  const filteredSalidas = viewConcluidas
    ? salidas.filter(salida =>
        salida.estado === 'Concluida' &&
        new Date(salida.fechaSalida) >= startDate &&
        new Date(salida.fechaSalida) <= endDate
      )
    : salidas.filter(salida =>
        salida.estado !== 'Concluida' &&
        new Date(salida.fechaSalida) >= startDate &&
        new Date(salida.fechaSalida) <= endDate
      );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <div className={styles.headerButtons}>
          <button className={styles.addButton} onClick={() => navigate('/addsalida')}>
            <FontAwesomeIcon icon={faCirclePlus} /> Agregar
          </button>
          <button className={styles.regresarButton} onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowAltCircleLeft} /> Regresar
          </button>
          <button className={styles.exportButton} onClick={handleExport}>
            <FontAwesomeIcon icon={faFileExport} /> Exportar
          </button>
          <button className={styles.toggleButton} onClick={() => setViewConcluidas(!viewConcluidas)}>
            <FontAwesomeIcon icon={faToggleOn} /> {viewConcluidas ? 'Ver No Concluidas' : 'Ver Concluidas'}
          </button>
        </div>
      </header>
      <div className={styles.mainContent}>
        <div className={styles.calendarContainer}>
          <Calendar value={date} />
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
            {filteredSalidas.map((salida) => (
              <div
                key={salida.id}
                className={`${styles.activityCard} ${salida.estado === 'Concluida' ? styles.activityCardDisabled : ''}`}
                onClick={() => handleViewSalida(salida.id, salida.estado)}
                style={{ cursor: salida.estado === 'Concluida' ? 'not-allowed' : 'pointer' }}
              >
                <div className={styles.activityDate}>{salida.fechaSalida}</div>
                <div className={styles.activityTitle}>Resguardante: {usuarios[salida.resguardante] || 'Desconocido'}</div>
                <div className={styles.activityContent}>
                  <p>Órgano Foráneo: {salida.organoForaneo}</p>
                  <p>Motivo: {salida.motivo}</p>
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

export default Salidas;
