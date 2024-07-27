import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { saveAs } from 'file-saver';

const firestore = getFirestore();

function EntregasConcluidas() {
  const [entregasConcluidas, setEntregasConcluidas] = useState([]);
  const [entregasPendientes, setEntregasPendientes] = useState([]);
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntregas = async () => {
      try {
        const startDate = startOfWeek(selectedWeek, { locale: es });
        const endDate = endOfWeek(selectedWeek, { locale: es });

        const completedQuery = query(
          collection(firestore, "entregas"),
          where("completada", "==", true)
        );
        const pendingQuery = query(
          collection(firestore, "entregas"),
          where("completada", "==", false)
        );

        const [completedSnapshot, pendingSnapshot] = await Promise.all([
          getDocs(completedQuery),
          getDocs(pendingQuery),
        ]);

        const fetchedCompletedEntregas = completedSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(entrega => {
            const fechaLlegada = new Date(entrega.fechaLlegada);
            return fechaLlegada >= startDate && fechaLlegada <= endDate;
          });

        const fetchedPendingEntregas = pendingSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(entrega => {
            const fechaLlegada = new Date(entrega.fechaLlegada);
            return fechaLlegada >= startDate && fechaLlegada <= endDate;
          });

        setEntregasConcluidas(fetchedCompletedEntregas);
        setEntregasPendientes(fetchedPendingEntregas);
      } catch (error) {
        console.error("Error fetching entregas:", error);
      }
    };

    fetchEntregas();
  }, [selectedWeek]);

  const handleWeekChange = (increment) => {
    setSelectedWeek(prevDate =>
      increment ? addWeeks(prevDate, 1) : subWeeks(prevDate, 1)
    );
  };

  const handleGenerateReport = () => {
    const startDate = format(startOfWeek(selectedWeek, { locale: es }), 'dd MMM yyyy', { locale: es });
    const endDate = format(endOfWeek(selectedWeek, { locale: es }), 'dd MMM yyyy', { locale: es });

    let report = `Reporte de Entregas del ${startDate} al ${endDate}\n\nEntregas Concluidas:\n`;
    entregasConcluidas.forEach(entrega => {
      report += `- ${entrega.nombreProducto} (Área Resguardante: ${entrega.areaResguardante}, Resguardante: ${entrega.nombreResguardante}, Fecha de Llegada: ${new Date(entrega.fechaLlegada).toLocaleDateString()})\n`;
    });

    report += `\nEntregas Pendientes:\n`;
    entregasPendientes.forEach(entrega => {
      report += `- ${entrega.nombreProducto} (Área Resguardante: ${entrega.areaResguardante}, Resguardante: ${entrega.nombreResguardante}, Fecha de Llegada: ${new Date(entrega.fechaLlegada).toLocaleDateString()})\n`;
    });

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `Reporte_Entregas_${startDate}_al_${endDate}.txt`);
  };

  const startDate = startOfWeek(selectedWeek, { locale: es });
  const endDate = endOfWeek(selectedWeek, { locale: es });

  return (
    <div>
      <h1>Entregas Concluidas</h1>
      <div>
        <button onClick={() => navigate('/entregaspendientes')}>Ver Entregas Pendientes</button>
        <button onClick={() => handleWeekChange(false)}>Semana Anterior</button>
        <span>Semana del {format(startDate, 'dd MMM yyyy', { locale: es })} al {format(endDate, 'dd MMM yyyy', { locale: es })}</span>
        <button onClick={() => handleWeekChange(true)}>Semana Siguiente</button>
        <button onClick={handleGenerateReport}>Generar Reporte</button>
      </div>
      {entregasConcluidas.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Nombre del Producto</th>
              <th>Área Resguardante</th>
              <th>Nombre del Resguardante</th>
              <th>Fecha de Entrega</th>
            </tr>
          </thead>
          <tbody>
            {entregasConcluidas.map((entrega) => (
              <tr key={entrega.id}>
                <td>{entrega.nombreProducto}</td>
                <td>{entrega.areaResguardante}</td>
                <td>{entrega.nombreResguardante}</td>
                <td>{new Date(entrega.fechaLlegada).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay entregas concluidas para la semana seleccionada.</p>
      )}
    </div>
  );
}

export default EntregasConcluidas;
