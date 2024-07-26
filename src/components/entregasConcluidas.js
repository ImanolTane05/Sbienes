import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const firestore = getFirestore();

function EntregasConcluidas() {
  const [entregas, setEntregas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntregasConcluidas = async () => {
      try {
        const q = query(collection(firestore, "entregas"), where("completada", "==", true));
        const querySnapshot = await getDocs(q);
        const fetchedEntregas = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEntregas(fetchedEntregas);
      } catch (error) {
        console.error("Error fetching entregas:", error);
      }
    };

    fetchEntregasConcluidas();
  }, []);

  const handleViewDetails = (id) => {
    navigate(`/infoentregas/${id}`);
  };

  return (
    <div>
      <h1>Entregas Concluidas</h1>
      {entregas.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Nombre del Producto</th>
              <th>Área Resguardante</th>
              <th>Nombre del Resguardante</th>
              <th>Fecha de Entrega</th>
              <th>Ver Detalles</th>
            </tr>
          </thead>
          <tbody>
            {entregas.map((entrega) => (
              <tr key={entrega.id}>
                <td>{entrega.nombreProducto}</td>
                <td>{entrega.areaResguardante}</td>
                <td>{entrega.nombreResguardante}</td>
                <td>{entrega.fechaLlegada}</td>
                <td>
                  <button onClick={() => handleViewDetails(entrega.id)}>Ver Detalles</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No hay entregas concluidas.</p>
      )}
    </div>
  );
}

export default EntregasConcluidas;
