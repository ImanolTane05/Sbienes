import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const firestore = getFirestore();

function Organos() {
  const [salidas, setSalidas] = useState([]);
  const [usuarios, setUsuarios] = useState({}); // Mapa de IDs a nombres de usuarios
  const [selectedWeek, setSelectedWeek] = useState(new Date()); // Semana seleccionada
  const [date] = useState(new Date()); // Fecha actual
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

  const handleViewSalida = (id) => {
    navigate(`/infosalida/${id}`);
  };

  const handleWeekChange = (increment) => {
    setSelectedWeek(prevDate => 
      increment ? addWeeks(prevDate, 1) : subWeeks(prevDate, 1)
    );
  };

  const handleExport = () => {
    const salidasConcluidas = salidas.filter(salida => salida.estado === 'Concluida');
    const salidasPorConcluir = salidas.filter(salida => salida.estado !== 'Concluida');

    let content = `Salidas Concluidas en la Semana:\n\n`;
    salidasConcluidas.forEach(salida => {
      content += `Fecha de Salida: ${salida.fechaSalida}\nResguardante: ${usuarios[salida.resguardante] || 'Desconocido'}\nÓrgano Foráneo: ${salida.organoForaneo}\nMotivo: ${salida.motivo}\n\n`;
    });

    content += `\nSalidas por Concluir en la Semana:\n\n`;
    salidasPorConcluir.forEach(salida => {
      content += `Fecha de Salida: ${salida.fechaSalida}\nResguardante: ${usuarios[salida.resguardante] || 'Desconocido'}\nÓrgano Foráneo: ${salida.organoForaneo}\nMotivo: ${salida.motivo}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'salidas.txt';
    link.click();
  };

  const startDate = startOfWeek(selectedWeek, { locale: es });
  const endDate = endOfWeek(selectedWeek, { locale: es });

  return (
    <div>
      <h1>Órganos de Salidas</h1>
      <p>Contenido de la vista de salidas.</p>
      <button onClick={() => navigate('/addsalida')}>Agregar Salida</button>
      <button onClick={() => navigate('/salidas-concluidas')}>Ver Salidas Concluidas</button>
      <button onClick={handleExport}>Exportar Datos</button>
      <div>
        <h2>Lista de Salidas</h2>
        <div>
          <button onClick={() => handleWeekChange(false)}>Semana Anterior</button>
          <span>Semana del {format(startDate, 'dd MMM yyyy', { locale: es })} al {format(endDate, 'dd MMM yyyy', { locale: es })}</span>
          <button onClick={() => handleWeekChange(true)}>Semana Siguiente</button>
        </div>
        <ul>
          {salidas.filter(salida => salida.estado !== 'Concluida' &&
            new Date(salida.fechaSalida) >= startDate && 
            new Date(salida.fechaSalida) <= endDate
          ).map(salida => (
            <li key={salida.id}>
              <strong>Fecha de Salida:</strong> {salida.fechaSalida}<br />
              <strong>Resguardante:</strong> {usuarios[salida.resguardante] || 'Desconocido'}<br />
              <strong>Órgano Foráneo:</strong> {salida.organoForaneo}<br />
              <strong>Motivo:</strong> {salida.motivo}<br />
              <button onClick={() => handleViewSalida(salida.id)}>Ver Detalles</button>
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

export default Organos;
