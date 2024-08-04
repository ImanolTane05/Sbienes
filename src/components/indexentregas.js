import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';
import Pie from '../img/Pie.png';
import styles from '../styles/entregas.module.css'; // Importando estilos como módulo
import { FaShoppingCart, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';

function IndexEntregas() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div>
      <header className={styles.header}>
        <img src={logo} alt="Logo" className={styles.logo} />
      </header>
      <main>
        <h1>Index de Entregas</h1>
        <div className={styles.buttonGrid}>
          <div className={styles.gridItem} onClick={() => handleNavigation('/addentregas')}>
            <FaShoppingCart size={50} />
            <span>Agregar Entrega</span>
          </div>
          <div className={styles.gridItem} onClick={() => handleNavigation('/entregasconcluidas')}>
            <FaFileAlt size={50} />
            <span>Entregas Concluidas</span>
          </div>
          <div className={styles.gridItem} onClick={() => handleNavigation('/entregaspendientes')}>
            <FaCalendarAlt size={50} />
            <span>Entregas Pendientes</span>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <img src={Pie} alt="Decoración de pie de página" className={styles.footerDecoration} />
      </footer>
    </div>
  );
}

export default IndexEntregas;
