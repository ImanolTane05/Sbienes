import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const firestore = getFirestore();

function EditSalida() {
  const { id } = useParams();
  const [salida, setSalida] = useState({ fechaSalida: '', resguardante: '', organoForaneo: '', motivo: '' });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalida(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(firestore, 'salidas', id), salida);
      // Redirigir a la vista de detalles o lista después de actualizar
    } catch (error) {
      console.error('Error updating salida:', error);
      setError('Error updating salida.');
    }
  };

  return (
    <div>
      <h1>Actualizar Salida</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Fecha de Salida:
          <input type="date" name="fechaSalida" value={salida.fechaSalida} onChange={handleChange} />
        </label>
        <label>
          Resguardante:
          <input type="text" name="resguardante" value={salida.resguardante} onChange={handleChange} />
        </label>
        <label>
          Órgano Foráneo:
          <input type="text" name="organoForaneo" value={salida.organoForaneo} onChange={handleChange} />
        </label>
        <label>
          Motivo:
          <input type="text" name="motivo" value={salida.motivo} onChange={handleChange} />
        </label>
        <button type="submit">Actualizar</button>
      </form>
    </div>
  );
}

export default EditSalida;
