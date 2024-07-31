import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import firebaseApp from "../firebase/credenciales";
import logo from '../img/logo.png';
import Pie from '../img/Pie.png';
import { FaUsers, FaShoppingCart, FaBook, FaCalendarAlt, FaSignOutAlt, FaFileAlt } from 'react-icons/fa';
import styles from '../styles/admin.module.css'; // Importando estilos como módulo

const firestore = getFirestore(firebaseApp);

function AdminView({ user }) {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const entregasCollection = collection(firestore, 'entregas');
      const actividadesCollection = collection(firestore, 'actividades');
      const salidasCollection = collection(firestore, 'salidas');

      const [entregasSnapshot, actividadesSnapshot, salidasSnapshot] = await Promise.all([
        getDocs(entregasCollection),
        getDocs(actividadesCollection),
        getDocs(salidasCollection),
      ]);

      const entregas = entregasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const actividades = actividadesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const salidas = salidasSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setReportData({ entregas, actividades, salidas });
    };

    fetchData();
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const generateReport = () => {
    const currentWeek = new Date();
    const startDate = startOfWeek(currentWeek, { locale: es });
    const endDate = endOfWeek(currentWeek, { locale: es });

    const filterByWeek = (items, dateField) => items.filter(item => {
      const itemDate = new Date(item[dateField]);
      return itemDate >= startDate && itemDate <= endDate;
    });

    const pendingEntregas = filterByWeek(reportData.entregas, 'fechaLlegada').filter(entrega => !entrega.completada);
    const completedEntregas = filterByWeek(reportData.entregas, 'fechaLlegada').filter(entrega => entrega.completada);
    const pendingActividades = filterByWeek(reportData.actividades, 'fecha').filter(actividad => !actividad.completada);
    const completedActividades = filterByWeek(reportData.actividades, 'fecha').filter(actividad => actividad.completada);
    const pendingSalidas = filterByWeek(reportData.salidas, 'fecha').filter(salida => !salida.completada);
    const completedSalidas = filterByWeek(reportData.salidas, 'fecha').filter(salida => salida.completada);

    const reportContent = `
      Reporte Semanal (${format(startDate, 'dd MMM yyyy', { locale: es })} - ${format(endDate, 'dd MMM yyyy', { locale: es })})

      Entregas Pendientes:
      ${pendingEntregas.map(e => `- ${e.nombreProducto}`).join('\n')}

      Entregas Concluidas:
      ${completedEntregas.map(e => `- ${e.nombreProducto}`).join('\n')}

      Actividades Pendientes:
      ${pendingActividades.map(a => `- ${a.nombreActividad}`).join('\n')}

      Actividades Concluidas:
      ${completedActividades.map(a => `- ${a.nombreActividad}`).join('\n')}

      Salidas Pendientes:
      ${pendingSalidas.map(s => `- ${s.nombreSalida}`).join('\n')}

      Salidas Concluidas:
      ${completedSalidas.map(s => `- ${s.nombreSalida}`).join('\n')}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reporte_semanal_${format(startDate, 'dd-MM-yyyy')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.adminPanel}>
      <header className={styles.adminHeader}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <div className={styles.headerButtons}>
          <button className={styles.reportButton} onClick={generateReport}>
            Generar Reporte <FaFileAlt />
          </button>
          <button className={styles.logoutButton} onClick={() => handleNavigation('/login')}>
            Cerrar Sesión <FaSignOutAlt />
          </button>
        </div>
      </header>
      <main className={styles.adminContent}>
        <div className={styles.welcomeSection}>
          <h1>Bienvenido {user ? user.nombre : "Invitado"}</h1>
          <hr className={styles.welcomeDivider} />
          <p>Atendiendo una necesidad urgente de modernizar<br />la administración de Justicia</p>
        </div>
        <div className={styles.buttonGrid}>
          <div className={`${styles.gridItem} ${styles.users}`} onClick={() => handleNavigation('/usuarios')}>
            <FaUsers size={50} />
            <span>Usuarios</span>
          </div>
          <div className={`${styles.gridItem} ${styles.deliveries}`} onClick={() => handleNavigation('/indexentregas')}>
            <FaShoppingCart size={50} />
            <span>Entregas</span>
          </div>
          <div className={`${styles.gridItem} ${styles.exits}`} onClick={() => handleNavigation('/salidas')}>
            <FaBook size={50} />
            <span>Salidas</span>
          </div>
          <div className={`${styles.gridItem} ${styles.activities}`} onClick={() => handleNavigation('/actividades')}>
            <FaCalendarAlt size={50} />
            <span>Actividades</span>
          </div>
        </div>
      </main>
      <footer className={styles.adminFooter}>
        <img src={Pie} alt="Decoración de pie de página" className={styles.footerDecoration} />
      </footer>
    </div>
  );
}

export default AdminView;
