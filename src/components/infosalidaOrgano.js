import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

const firestore = getFirestore();

function InfoSalidaOrgano() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salida, setSalida] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSalida = async () => {
      try {
        const salidaDoc = doc(firestore, 'salidas', id);
        const salidaSnapshot = await getDoc(salidaDoc);
        if (salidaSnapshot.exists()) {
          setSalida(salidaSnapshot.data());
        } else {
          setError('Salida no encontrada.');
        }
      } catch (error) {
        console.error('Error fetching salida:', error);
        setError('Error fetching salida.');
      }
    };

    fetchSalida();
  }, [id]);

  const handleUpdate = () => {
    navigate(`/editSalida/${id}`); // Asegúrate de tener una ruta para editar la salida
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(firestore, 'salidas', id));
      navigate('/salidas'); // Redirige a la lista de salidas después de eliminar
    } catch (error) {
      console.error('Error deleting salida:', error);
      setError('Error deleting salida.');
    }
  };

  const handleConclude = async () => {
    try {
      await updateDoc(doc(firestore, 'salidas', id), {
        estado: 'Concluida' // Asegúrate de que 'estado' sea un campo en tu documento
      });
      setSalida(prevState => ({ ...prevState, estado: 'Concluida' }));
    } catch (error) {
      console.error('Error concluding salida:', error);
      setError('Error concluding salida.');
    }
  };

  return (
    <div>
      <h1>Detalles de la Salida</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {salida ? (
        <div>
          <p><strong>Fecha de Salida:</strong> {salida.fechaSalida}</p>
          <p><strong>Resguardante:</strong> {salida.resguardante}</p>
          <p><strong>Órgano Foráneo:</strong> {salida.organoForaneo}</p>
          <p><strong>Motivo:</strong> {salida.motivo}</p>
          <p><strong>Estado:</strong> {salida.estado || 'Pendiente'}</p> {/* Asegúrate de que 'estado' esté en el documento */}
          <button onClick={handleUpdate}>Actualizar</button>
          <button onClick={handleDelete} style={{ color: 'red' }}>Eliminar</button>
          <button onClick={handleConclude} style={{ color: 'green' }}>Concluir Salida</button>
        </div>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}

export default InfoSalidaOrgano;
