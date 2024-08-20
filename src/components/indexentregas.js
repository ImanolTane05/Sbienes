import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';
import Pie from '../img/Pie.png';
import styles from '../styles/indexEntregas.module.css'; // Importando estilos como módulo
import { FaShoppingCart, FaCalendarAlt, FaFileAlt, FaArrowCircleLeft } from 'react-icons/fa';

function IndexEntregas() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleBack = () => {
    navigate(-1); // Navegar a la página anterior
  };

  return (
    <div>
      <header className={styles.header}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <FaArrowCircleLeft 
          size={30} 
          className={styles.backButton} 
          onClick={handleBack} 
        />
      </header>
      <main className={styles.mainContent}>
        <div className={styles.textSection}>
          <div className={styles.titleContainer}>
            <h1>Entregas</h1>
            <p>Atendiendo una necesidad urgente de modernizar la administración de Justicia</p>
          </div>
        </div>
        <div className={styles.buttonContainer}>
          <div className={`${styles.button} ${styles.button1}`} onClick={() => handleNavigation('/addentregas')}>
            <FaShoppingCart size={40} />
            <span>Agregar Entrega</span>
          </div>
          <div className={`${styles.button} ${styles.button2}`} onClick={() => handleNavigation('/entregasconcluidas')}>
            <FaFileAlt size={40} />
            <span>Entregas Concluidas</span>
          </div>
          <div className={`${styles.button} ${styles.button3}`} onClick={() => handleNavigation('/entregaspendientes')}>
            <FaCalendarAlt size={40} />
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
