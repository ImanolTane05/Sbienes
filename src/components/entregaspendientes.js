import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';

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

  const startDate = startOfWeek(selectedWeek, { locale: es });
  const endDate = endOfWeek(selectedWeek, { locale: es });

  // Asegúrate de que las fechas sean comparables
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
