import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../img/logo.png';
import Pie from '../img/Pie.png';

function PoliticasCondiciones() {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate('/'); // Ajusta esta ruta según sea necesario
  };

  return (
    <div>
      <header>
        <img src={logo} alt="Logo" className="logo" />
        <h1>Términos y Condiciones</h1>
      </header>
      <main>
        <button className="back-button" onClick={handleBackClick}>
          <i className="fa fa-arrow-circle-left"></i> Regresar
        </button>
        <div className="content">
          <h2>Aceptación de los Términos</h2>
          <p>Al acceder y utilizar el SGEAADCBMIPJET, usted acepta estar sujeto a estos Términos y Condiciones, a todas las leyes y regulaciones aplicables, y acepta ser responsable del cumplimiento de todas las leyes locales aplicables. Si no está de acuerdo con alguno de estos términos, tiene prohibido usar o acceder a este sistema.</p>
          
          <h2>Uso del Sistema</h2>
          <p><strong>Elegibilidad:</strong> El uso del sistema está limitado a empleados autorizados del Poder Judicial del Estado de Tlaxcala. Los usuarios deben tener una cuenta válida y activa.</p>
          <p><strong>Autenticación:</strong> El acceso al sistema requiere autenticación mediante correo electrónico y contraseña. Los usuarios son responsables de mantener la confidencialidad de su información de inicio de sesión.</p>
          <p><strong>Actividades Prohibidas:</strong> Los usuarios no deben:</p>
          <ul>
            <li>Usar el sistema para cualquier propósito ilegal o no autorizado.</li>
            <li>Interferir con el funcionamiento del sistema o el acceso de otros usuarios.</li>
            <li>Intentar obtener acceso no autorizado a cualquier parte del sistema.</li>
          </ul>

          <h2>Privacidad y Seguridad</h2>
          <p><strong>Recolección de Datos:</strong> El sistema recolecta y almacena datos personales necesarios para su funcionamiento, como nombre, correo electrónico y roles de usuario.</p>
          <p><strong>Protección de Datos:</strong> Todos los datos sensibles se cifrarán y se almacenarán de manera segura para proteger la privacidad de los usuarios.</p>
          <p><strong>Uso de Datos:</strong> Los datos recolectados se utilizarán únicamente para los fines del sistema y no se compartirán con terceros sin el consentimiento explícito del usuario, excepto cuando lo exija la ley.</p>

          <h2>Responsabilidades del Usuario</h2>
          <p><strong>Información Veraz:</strong> Los usuarios deben proporcionar información precisa y veraz en el sistema.</p>
          <p><strong>Mantenimiento de Seguridad:</strong> Los usuarios deben mantener la seguridad de su cuenta y notificar de inmediato cualquier uso no autorizado o sospecha de violación de seguridad.</p>
          <p><strong>Cumplimiento de Políticas:</strong> Los usuarios deben cumplir con todas las políticas y procedimientos establecidos por el Poder Judicial del Estado de Tlaxcala en relación con el uso del sistema.</p>

          <h2>Limitación de Responsabilidad</h2>
          <p>El Poder Judicial del Estado de Tlaxcala no será responsable de ningún daño directo, indirecto, incidental, especial, consecuente o ejemplar, incluyendo, pero no limitado a, daños por pérdida de beneficios, buena voluntad, uso, datos u otras pérdidas intangibles resultantes de:</p>
          <ul>
            <li>El uso o la imposibilidad de usar el sistema.</li>
            <li>El acceso no autorizado o la alteración de sus transmisiones o datos.</li>
            <li>Declaraciones o conductas de cualquier tercero en el sistema.</li>
            <li>Cualquier otro asunto relacionado con el sistema.</li>
          </ul>

          <h2>Modificaciones del Sistema y de los Términos</h2>
          <p><strong>Modificaciones del Sistema:</strong> El Poder Judicial del Estado de Tlaxcala se reserva el derecho de modificar o descontinuar, temporal o permanentemente, el sistema o cualquier parte del mismo, con o sin previo aviso.</p>
          <p><strong>Modificaciones de los Términos:</strong> Nos reservamos el derecho de revisar estos términos en cualquier momento. Al usar el sistema, usted acepta estar sujeto a la versión actual de estos Términos y Condiciones.</p>

          <h2>Terminación</h2>
          <p>El Poder Judicial del Estado de Tlaxcala puede, a su discreción, suspender o terminar su acceso al sistema en cualquier momento, con o sin previo aviso, por cualquier motivo, incluyendo, pero no limitado a, el incumplimiento de estos Términos y Condiciones.</p>

          <h2>Ley Aplicable</h2>
          <p>Estos Términos y Condiciones se regirán e interpretarán de acuerdo con las leyes del Estado de Tlaxcala, sin dar efecto a ningún principio de conflicto de leyes.</p>

          <h2>Contacto</h2>
          <p>Si tiene alguna pregunta sobre estos Términos y Condiciones, por favor contáctenos a través de los canales oficiales del Poder Judicial del Estado de Tlaxcala.</p>
        </div>
      </main>
      <footer>
        <img src={Pie} alt="Footer Decoration" className="footer-decoration" />
      </footer>
    </div>
  );
}

export default PoliticasCondiciones;
