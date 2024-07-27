import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { saveAs } from 'file-saver';

const firestore = getFirestore();

function EntregasPendientes() {
  const [entregas, setEntregas] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntregas = async () => {
      try {
        const entregasCollection = collection(firestore, 'entregas');
        const entregasSnapshot = await getDocs(entregasCollection);
        const entregasList = entregasSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log('Entregas recuperadas:', entregasList); // Verifica los datos recuperados
        setEntregas(entregasList);
      } catch (error) {
        console.error('Error fetching entregas:', error);
      }
    };

    fetchEntregas();
  }, []);

  const handleWeekChange = (increment) => {
    setSelectedWeek(prevDate =>
      increment ? addWeeks(prevDate, 1) : subWeeks(prevDate, 1)
    );
  };

  const handleViewEntrega = (id) => {
    navigate(`/infoentrega/${id}`);
  };

  const handleExportPendientes = () => {
    const startDate = startOfWeek(selectedWeek, { locale: es });
    const endDate = endOfWeek(selectedWeek, { locale: es });

    const pendientes = entregas.filter(entrega => {
      const entregaFecha = new Date(entrega.fechaLlegada);
      return entregaFecha >= startDate && entregaFecha <= endDate && !entrega.completada;
    });

    let content = `Reporte de Entregas Pendientes (Semana del ${format(startDate, 'dd MMM yyyy', { locale: es })} al ${format(endDate, 'dd MMM yyyy', { locale: es })}):\n\n`;

    pendientes.forEach(entrega => {
      content += `Nombre del Producto: ${entrega.nombreProducto}\nÁrea Resguardante: ${entrega.areaResguardante}\nNombre del Resguardante: ${entrega.nombreResguardante}\nFecha de Entrega: ${entrega.fechaLlegada}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `reporte_entregas_pendientes_${format(startDate, 'yyyyMMdd')}_${format(endDate, 'yyyyMMdd')}.txt`);
  };

  const startDate = startOfWeek(selectedWeek, { locale: es });
  const endDate = endOfWeek(selectedWeek, { locale: es });

  const filteredEntregas = entregas.filter(entrega => {
    const entregaFecha = new Date(entrega.fechaLlegada);
    console.log('Comparando fecha:', entregaFecha.toISOString(), 'con rango:', startDate.toISOString(), 'a', endDate.toISOString()); // Verifica la comparación de fechas
    return entregaFecha >= startDate && entregaFecha <= endDate && !entrega.completada;
  });

  return (
    <div>
      <h1>Entregas Pendientes</h1>
      <div>
        <button onClick={() => handleWeekChange(false)}>Semana Anterior</button>
        <span>Semana del {format(startDate, 'dd MMM yyyy', { locale: es })} al {format(endDate, 'dd MMM yyyy', { locale: es })}</span>
        <button onClick={() => handleWeekChange(true)}>Semana Siguiente</button>
      </div>
      <button onClick={handleExportPendientes}>Generar Reporte de Entregas Pendientes</button>
      <ul>
        {filteredEntregas.length > 0 ? (
          filteredEntregas.map((entrega) => (
            <li key={entrega.id}>
              <strong>Nombre del Producto:</strong> {entrega.nombreProducto}<br />
              <strong>Área Resguardante:</strong> {entrega.areaResguardante}<br />
              <strong>Nombre del Resguardante:</strong> {entrega.nombreResguardante}<br />
              <strong>Fecha de Entrega:</strong> {entrega.fechaLlegada}<br />
              <button onClick={() => handleViewEntrega(entrega.id)}>Ver Detalles</button>
            </li>
          ))
        ) : (
          <p>No hay entregas pendientes para la semana seleccionada.</p>
        )}
      </ul>
    </div>
  );
}

export default EntregasPendientes;
