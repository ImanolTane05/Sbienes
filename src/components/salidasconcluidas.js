import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const firestore = getFirestore();

function SalidasConcluidas() {
  const [salidas, setSalidas] = useState([]);
  const [usuarios, setUsuarios] = useState({}); // Mapa de IDs a nombres de usuarios
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalidas = async () => {
      try {
        const salidasCollection = collection(firestore, 'salidas');
        const salidasSnapshot = await getDocs(salidasCollection);
        const salidasList = salidasSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setSalidas(salidasList);
      } catch (error) {
        console.error('Error fetching salidas:', error);
      }
    };

    const fetchUsuarios = async () => {
      try {
        const usuariosCollection = collection(firestore, 'usuarios');
        const usuariosSnapshot = await getDocs(usuariosCollection);
        const usuariosList = usuariosSnapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          acc[doc.id] = `${data.nombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`;
          return acc;
        }, {});
        setUsuarios(usuariosList);
      } catch (error) {
        console.error('Error fetching usuarios:', error);
      }
    };

    fetchSalidas();
    fetchUsuarios();
  }, []);

  const handleViewSalida = (id) => {
    navigate(`/infosalida/${id}`);
  };

  return (
    <div>
      <h1>Salidas Concluidas</h1>
      <div>
        <h2>Lista de Salidas Concluidas</h2>
        <ul>
          {salidas.filter(salida => salida.concluida).map(salida => (
            <li key={salida.id}>
              <strong>Fecha de Salida:</strong> {salida.fechaSalida}<br />
              <strong>Resguardante:</strong> {usuarios[salida.resguardante] || 'Desconocido'}<br />
              <strong>Órgano Foráneo:</strong> {salida.organoForaneo}<br />
              <strong>Motivo:</strong> {salida.motivo}<br />
              <button onClick={() => handleViewSalida(salida.id)}>Ver Detalles</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default SalidasConcluidas;
