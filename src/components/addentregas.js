import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';
import styles from '../styles/entregas.module.css';
import logo from '../img/logo.png';
import Pie from '../img/Pie.png'; 
import Swal from 'sweetalert2';

const firestore = getFirestore();

const areasResguardantes = [
  "PRESIDENCIA", "DIRECCION JURIDICA", "DIRECCION DE TRANSPARENCIA",
  "UNIDAD INTERNA DE PROTECCION CIVIL", "SALA CIVIL-FAMILIAR - SEGUNDA PONENCIA",
  "SALA CIVIL-FAMILIAR - PRIMERA PONENCIA", "SALA CIVIL-FAMILIAR - TERCERA PONENCIA",
  "SALA PENAL Y ESPECIALIZADA EN ADMINISTRACION DE JUSTICIA PARA ADOLESCENTES",
  "SECRETARIA GENERAL DE ACUERDOS", "EXHORTOS", "OFICIALIA DE PARTES",
  "DEPARTAMENTO DE SERVICIOS PERICIALES", "COMITE DE TRANSPARENCIA DEL PODER JUDICIAL DEL ESTADO DE TLAXCALA",
  "ARCHIVO DEL PODER JUDICIAL", "CONSEJO DE LA JUDICATURA DEL ESTADO DE TLAXCALA",
  "SECRETARIA EJECUTIVA DEL CONSEJO DE LA JUDICATURA DEL ESTADO DE TLAXCALA",
  "DIRECCION DE RECURSOS HUMANOS Y MATERIALES", "DEPARTAMENTO DE RECURSOS HUMANOS",
  "DEPARTAMENTO DE RECURSOS MATERIALES", "DEPARTAMENTO DE MANTENIMIENTO",
  "ALMACEN", "DEPARTAMENTO DE CONTROL DE BIENES MUEBLES E INMUEBLES",
  "MODULO MEDICO DEL PODER JUDICIAL", "DIRECCION DE TECNOLOGIAS DE LA INFORMACION Y COMUNICACION DEL PODER JUDICIAL DEL ESTADO DE TLAXCALA",
  "DEPARTAMENTO DE DESARROLLO E INNOVACION TECNOLOGICA", "TESORERIA", "CONTRALORIA",
  "INSTITUTO DE ESPECIALIZACION JUDICIAL", "UNIDAD DE IGUALDAD DE GENERO",
  "JUZGADO PRIMERO DE LO CIVIL DEL DISTRITO JUDICIAL DE CUAUHTEMOC",
  "JUZGADO SEGUNDO DE LO CIVIL DEL DISTRITO JUDICIAL DE CUAUHTEMOC",
  "JUZGADO TERCERO DE LO CIVIL DEL DISTRITO JUDICIAL DE CUAUHTEMOC Y DE EXTINCION DE DOMINIO DEL ESTADO DE TLAXCALA",
  "JUZGADO CUARTO DE LO CIVIL DEL DISTRITO JUDICIAL DE CUAUHTEMOC",
  "OFICIALIA DE PARTES COMUN DE LOS JUZGADOS DEL DISTRITO JUDICIAL DE CUAUHTEMOC",
  "JUZGADO MERCANTIL Y DE ORALIDAD MERCANTIL DEL DISTRITO JUDICIAL DE CUAUHTEMOC",
  "JUZGADO DE LO CIVIL DEL DISTRITO JUDICIAL DE JUAREZ", "JUZGADO DE LO CIVIL DEL DISTRITO JUDICIAL DE MORELOS",
  "JUZGADO DE LO CIVIL Y FAMILIAR DEL DISTRITO JUDICIAL DE OCAMPO",
  "JUZGADO DE LO CIVIL Y FAMILIAR DEL DISTRITO JUDICIAL DE XICOHTENCATL",
  "JUZGADO DE LO CIVIL DEL DISTRITO JUDICIAL DE ZARAGOZA", "JUZGADO PRIMERO DE LO FAMILIAR DEL DISTRITO JUDICIAL DE CUAUHTEMOC",
  "JUZGADO SEGUNDO DE LO FAMILIAR DEL DISTRITO JUDICIAL DE CUAUHTEMOC",
  "JUZGADO TERCERO DE LO FAMILIAR DEL DISTRITO JUDICIAL DE CUAUHTEMOC",
  "JUZGADO CUARTO DE LO FAMILIAR DEL DISTRITO JUDICIAL DE CUAUHTEMOC",
  "JUZGADO DE LO FAMILIAR DEL DISTRITO JUDICIAL DE JUAREZ", "JUZGADO FAMILIAR DEL DISTRITO JUDICIAL DE MORELOS",
  "JUZGADO DE LO FAMILIAR DEL DISTRITO JUDICIAL DE ZARAGOZA",
  "JUZGADO DEL SISTEMA TRADICIONAL PENAL Y ESPECIALIZADO EN ADMINISTRACION DE JUSTICIA PARA ADOLESCENTES",
  "JUZGADO DE CONTROL Y DE JUICIO ORAL DEL DISTRITO JUDICIAL DE GURIDI Y ALCOCER",
  "TRIBUNAL DE ENJUICIAMIENTO DEL JUZGADO DE CONTROL Y DE JUICIO ORAL DEL DISTRITO JUDICIAL DE GURIDI Y ALCOCER",
  "PRIMER TRIBUNAL DE ENJUICIAMIENTO UNITARIO DEL JUZGADO DE CONTROL Y DE JUICIO ORAL DEL DISTRITO JUDICIAL DE GURIDI Y ALCOCER",
  "JUZGADO DE CONTROL Y DE JUICIO ORAL DEL DISTRITO JUDICIAL DE SANCHEZ PIEDRAS",
  "TRIBUNAL DE ENJUICIAMIENTO DEL JUZGADO DE CONTROL Y DE JUICIO ORAL DEL DISTRITO JUDICIAL DE SANCHEZ PIEDRAS ",
  "JUZGADO DE EJECUCION ESPECIALIZADO DE MEDIDAS APLICABLES A ADOLESCENTES Y DE EJECUCION DE SANCIONES PENALES",
  "JUZGADO PRIMERO DE LO LABORAL DEL PODER JUDICIAL DEL ESTADO DE TLAXCALA",
  "CENTRO ESTATAL DE JUSTICIA ALTERNATIVA DEL ESTADO", "DIRECCION DE INFORMACION Y COMUNICACION SOCIAL",
  "CENTRO REGIONAL DE JUSTICIA ALTERNATIVA HUAMANTLA", "CENTRO REGIONAL DE JUSTICIA ALTERNATIVA ZACATELCO",
  "CENTRO REGIONAL DE JUSTICIA ALTERNATIVA TLAXCO", "CENTRO REGIONAL DE JUSTICIA ALTERNATIVA CALPULALPAN",
  "CENTRO REGIONAL DE JUSTICIA ALTERNATIVA SAN PABLO DEL MONTE"
];

const organosResguardantes = [
  "DISTRITO JUDICIAL DE CUAUHTEMOC", "DISTRITO JUDICIAL DE JUAREZ",
  "DISTRITO JUDICIAL DE MORELOS", "DISTRITO JUDICIAL DE OCAMPO",
  "DISTRITO JUDICIAL DE XICOHTENCATL"
];

function AddEntregas() {
  const [nombreProducto, setNombreProducto] = useState('');
  const [nombreResguardante, setNombreResguardante] = useState('');
  const [areaResguardante, setAreaResguardante] = useState('');
  const [newArea, setNewArea] = useState('');
  const [organos, setOrganos] = useState([]);
  const [organoResguardante, setOrganoResguardante] = useState('');
  const [newOrgano, setNewOrgano] = useState('');
  const [fechaLlegada, setFechaLlegada] = useState('');
  const [cargoResguardante, setCargoResguardante] = useState('');
  const [cantidad, setCantidad] = useState(''); // Nuevo estado para la cantidad
  const [areas, setAreas] = useState(areasResguardantes);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const organosCollection = collection(firestore, 'organos');
        const organosSnapshot = await getDocs(organosCollection);
        const organosList = organosSnapshot.docs.map(doc => doc.data().nombre);
        setOrganos([...organosResguardantes, ...organosList]);

        const areasCollection = collection(firestore, 'areas');
        const areasSnapshot = await getDocs(areasCollection);
        const areasList = areasSnapshot.docs.map(doc => doc.data().nombre);
        setAreas([...areasResguardantes, ...areasList]);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAddEntrega = async (e) => {
    e.preventDefault();

    try {
      await addDoc(collection(firestore, 'entregas'), {
        nombreProducto,
        nombreResguardante,
        areaResguardante: newArea || areaResguardante,
        organoResguardante: newOrgano || organoResguardante,
        fechaLlegada,
        cargoResguardante,
        cantidad, // Incluye la cantidad
      });

      if (newArea) {
        await addDoc(collection(firestore, 'areas'), { nombre: newArea });
        setNewArea(''); // Limpiar campo
      }

      if (newOrgano) {
        await addDoc(collection(firestore, 'organos'), { nombre: newOrgano });
        setNewOrgano(''); // Limpiar campo
      }

      Swal.fire({
        title: 'Éxito',
        text: 'Entrega agregada con éxito.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
      }).then(() => {
        navigate('/entregasPendientes');
      });
    } catch (error) {
      console.error('Error adding entrega:', error);
      Swal.fire({
        title: 'Error',
        text: 'Error al agregar la entrega.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
      });
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <img src={logo} alt="Logo" className={styles.logo} />
        <h1 className={styles.title}>Agregar Entregas</h1>
        <button type="button" className={styles.cancelButton} onClick={() => navigate(-1)}>Cancelar</button>
      </header>
      <form className={styles.form} onSubmit={handleAddEntrega}>
        <div className={styles.formGroup}>
          <label htmlFor="nombreProducto">Nombre del Producto</label>
          <input
            id="nombreProducto"
            type="text"
            value={nombreProducto}
            onChange={(e) => setNombreProducto(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="nombreResguardante">Nombre del Resguardante</label>
          <input
            id="nombreResguardante"
            type="text"
            value={nombreResguardante}
            onChange={(e) => setNombreResguardante(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
  <label htmlFor="areaResguardante">Área del Resguardante</label>
  <select
    id="areaResguardante"
    value={areaResguardante}
    onChange={(e) => setAreaResguardante(e.target.value)}
  >
    <option value="">Seleccione un área</option>
    {areas.map(area => (
      <option key={area} value={area}>{area}</option>
    ))}
  </select>
  <input
    type="text"
    placeholder="Agregar nueva área"
    value={newArea}
    onChange={(e) => setNewArea(e.target.value)}
  />
</div>
        <div className={styles.formGroup}>
          <label htmlFor="organoResguardante">Órgano del Resguardante</label>
          <select
            id="organoResguardante"
            value={organoResguardante}
            onChange={(e) => setOrganoResguardante(e.target.value)}
          >
            <option value="">Seleccione un órgano</option>
            {organos.map(organo => (
              <option key={organo} value={organo}>{organo}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Agregar nuevo órgano"
            value={newOrgano}
            onChange={(e) => setNewOrgano(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="cantidad">Cantidad</label>
          <input
            id="cantidad"
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="fechaLlegada">Fecha de Llegada</label>
          <input
            id="fechaLlegada"
            type="date"
            value={fechaLlegada}
            onChange={(e) => setFechaLlegada(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="cargoResguardante">Cargo del Resguardante</label>
          <input
            id="cargoResguardante"
            type="text"
            value={cargoResguardante}
            onChange={(e) => setCargoResguardante(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.submitButton}>Agregar Entrega</button>
      </form>
      <footer className={styles.footer}>
        <img src={Pie} alt="Pie" className={styles.footerDecoration} />
      </footer>
    </div>
  );
}

export default AddEntregas;