import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { saveAs } from 'file-saver';
import styles from '../styles/entregascon.module.css'; 
import logo from "../img/logo.png";
import Pie from "../img/Pie.png";

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

        const [completedSnapshot, pendingSnapshot] = await Promise.all([
          getDocs(query(collection(firestore, "entregas"), where("completada", "==", true))),
          getDocs(query(collection(firestore, "entregas"), where("completada", "==", false))),
        ]);

        const filterByDate = (docs) =>
          docs.map(doc => ({ id: doc.id, ...doc.data() }))
               .filter(entrega => new Date(entrega.fechaLlegada) >= startDate && new Date(entrega.fechaLlegada) <= endDate);

        setEntregasConcluidas(filterByDate(completedSnapshot.docs));
        setEntregasPendientes(filterByDate(pendingSnapshot.docs));
      } catch (error) {
        console.error("Error fetching entregas:", error);
      }
    };

    fetchEntregas();
  }, [selectedWeek]);

  const handleWeekChange = (increment) => {
    setSelectedWeek(prevDate => increment ? addWeeks(prevDate, 1) : subWeeks(prevDate, 1));
  };

  const handleGenerateReport = () => {
    const startDateFormatted = format(startOfWeek(selectedWeek, { locale: es }), 'dd MMM yyyy');
    const endDateFormatted = format(endOfWeek(selectedWeek, { locale: es }), 'dd MMM yyyy');

    const formatEntrega = (entrega) => `- ${entrega.nombreProducto} (Área Resguardante: ${entrega.areaResguardante}, Resguardante: ${entrega.nombreResguardante}, Fecha de Llegada: ${new Date(entrega.fechaLlegada).toLocaleDateString()})`;

    const report = [
      `Reporte de Entregas del ${startDateFormatted} al ${endDateFormatted}\n\nEntregas Concluidas:\n`,
      ...entregasConcluidas.map(formatEntrega),
      `\nEntregas Pendientes:\n`,
      ...entregasPendientes.map(formatEntrega),
    ].join('\n');

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `Reporte_Entregas_${startDateFormatted}_al_${endDateFormatted}.txt`);
  };

  const startDate = startOfWeek(selectedWeek, { locale: es });
  const endDate = endOfWeek(selectedWeek, { locale: es });

  return (
    <div className={styles.entregasContainer}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button className={styles.generateReportButton} onClick={handleGenerateReport}>Generar Reporte</button>
          <button className={styles.backButton} onClick={() => navigate('/')}><i className="fas fa-arrow-left"></i> Regresar</button>
        </div>
        <h1>Entregas Concluidas</h1>
        <img src={logo} alt="Logo" className={styles.logo} />
      </header>
      <div className={styles.navButtons}>
        <button onClick={() => navigate('/entregaspendientes')}>Ver Entregas Pendientes</button>
        <button onClick={() => handleWeekChange(false)}>Semana Anterior</button>
        <span>Semana del {format(startDate, 'dd MMM yyyy', { locale: es })} al {format(endDate, 'dd MMM yyyy', { locale: es })}</span>
        <button onClick={() => handleWeekChange(true)}>Semana Siguiente</button>
      </div>
      <div className={styles.tableContainer}>
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
          <p className={styles.emptyMessage}>No hay entregas concluidas para esta semana.</p>
        )}
      </div>
      <footer className={styles.footer}>
        <img src={Pie} alt="Pie de página" className={styles.footerDecoration} />
      </footer>
    </div>
  );
}

export default EntregasConcluidas;
