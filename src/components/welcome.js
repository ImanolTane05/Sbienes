import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../App.module.css'; // Importa los estilos como un módulo CSS
import logo from '../img/logo.png';
import Pie from '../img/Pie.png';

function Welcome() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Asegúrate de que esta ruta coincide con la que definiste en el enrutador
  };

  return (
    <div className={styles.App}>
      <header>
        <img src={logo} alt="Logo" className={styles.logo} />
      </header>
      <main>
        <div className={styles.content}>
          <div className={styles.leftSide}>
            <h1>Departamento de Control de Bienes Muebles e Inmuebles</h1>
            <p>Sistema de Gestión de Entregas y Actividades del Departamento de Control de Bienes Muebles e Inmuebles del Poder Judicial del Estado de Tlaxcala</p>
          </div>
          <div className={styles.rightSide}>
            <h2>Inicio de Sesión</h2>
            <button className={styles.loginButton} onClick={handleLoginClick}>
              <span className={styles.text}>Iniciar Sesión</span> <i className="fa fa-arrow-circle-right"></i>
            </button>
            <p>Gestión Transparente, Justicia Segura para el Estado de Tlaxcala</p>
            <a href="/politicas-condiciones" className={styles.policies}>
              Políticas y Condiciones <i className="fa fa-arrow-circle-right"></i>
            </a>
          </div>
        </div>
      </main>
      <footer>
        <img src={Pie} alt="Footer Decoration" className={styles.footerDecoration} />
      </footer>
    </div>
  );
}

export default Welcome;
