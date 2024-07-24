import React from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import logo from '../src/img/logo.png';
import Pie from '../src/img/Pie.png';

function App() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login'); // Asegúrate de que esta ruta coincide con la que definiste en el enrutador
  };

  return (
    <div className="App">
      <header>
        <img src={logo} alt="Logo" className="logo" />
      </header>
      <main>
        <div className="content">
          <div className="left-side">
            <h1>Departamento de Control de Bienes Muebles e Inmuebles</h1>
            <p>Sistema de Gestión de Entregas y Actividades del Departamento de Control de Bienes Muebles e Inmuebles del Poder Judicial del Estado de Tlaxcala</p>
          </div>
          <div className="right-side">
            <button className="login-button" onClick={handleLoginClick}>
              <span className="text">Iniciar Sesión</span> <i className="fa fa-arrow-circle-right"></i>
            </button>
            <p>Gestión Transparente, Justicia Segura para el Estado de Tlaxcala</p>
            <a href="#" className="policies">
              Políticas y Condiciones <i className="fa fa-arrow-circle-right"></i>
            </a>
          </div>
        </div>
      </main>
      <footer>
        <img src={Pie} alt="Footer Decoration" className="footer-decoration" />
      </footer>
    </div>
  );
}

export default App;
