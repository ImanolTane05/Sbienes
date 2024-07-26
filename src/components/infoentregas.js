import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const firestore = getFirestore();

function InfoEntregas() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [entrega, setEntrega] = useState(null);
  const [impresionResguardo, setImpresionResguardo] = useState(false);
  const [firmaJefe, setFirmaJefe] = useState(false);
  const [firmaDirectora, setFirmaDirectora] = useState(false);
  const [firmaResguardante, setFirmaResguardante] = useState(false);
  const [comentarios, setComentarios] = useState('');

  useEffect(() => {
    const fetchEntrega = async () => {
      try {
        const docRef = doc(firestore, "entregas", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setEntrega(data);
          setImpresionResguardo(data.impresionResguardo || false);
          setFirmaJefe(data.firmaJefe || false);
          setFirmaDirectora(data.firmaDirectora || false);
          setFirmaResguardante(data.firmaResguardante || false);
          setComentarios(data.comentarios || '');
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching entrega:", error);
      }
    };

    fetchEntrega();
  }, [id]);

  const handleCheckboxChange = async (field, setter) => {
    setter(prevState => !prevState);
    try {
      const docRef = doc(firestore, "entregas", id);
      await updateDoc(docRef, { [field]: !field });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleComentariosChange = (event) => {
    setComentarios(event.target.value);
  };

  const handleSaveChanges = async () => {
    try {
      const docRef = doc(firestore, "entregas", id);
      await updateDoc(docRef, {
        impresionResguardo,
        firmaJefe,
        firmaDirectora,
        firmaResguardante,
        comentarios
      });
    } catch (error) {
      console.error("Error updating document:", error);
    }
  };

  const handleConcluirActividad = async () => {
    const confirmConclude = window.confirm("¿Está seguro de que desea concluir la actividad y marcar todas las fases como completadas?");
    if (confirmConclude) {
      try {
        const docRef = doc(firestore, "entregas", id);
        await updateDoc(docRef, {
          impresionResguardo: true,
          firmaJefe: true,
          firmaDirectora: true,
          firmaResguardante: true,
          comentarios,
          completada: true,
          fechaConclusión: new Date().toISOString()
        });
        alert("Actividad concluida y registrada exitosamente.");
        navigate('/entregasconcluidas'); // Redirigir a la página de entregas concluidas
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }
  };

  return (
    <div>
      {entrega ? (
        <>
          <h1>{entrega.nombreProducto}</h1>
          <div>
            <p><strong>Área Resguardante:</strong> {entrega.areaResguardante}</p>
            <p><strong>Órgano Resguardante:</strong> {entrega.organoResguardante}</p>
            <p><strong>Nombre del Resguardante:</strong> {entrega.nombreResguardante}</p>
            <p><strong>Fecha de Llegada:</strong> {entrega.fechaLlegada}</p>
            <p><strong>Cargo del Resguardante:</strong> {entrega.cargoResguardante}</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem' }}>
            <label>
              <input 
                type="checkbox" 
                checked={impresionResguardo} 
                onChange={() => handleCheckboxChange('impresionResguardo', setImpresionResguardo)} 
              />
              Impresión de Resguardo
            </label>
            <label>
              <input 
                type="checkbox" 
                checked={firmaJefe} 
                onChange={() => handleCheckboxChange('firmaJefe', setFirmaJefe)} 
              />
              Firma del Jefe de Departamento de Bienes Muebles
            </label>
            <label>
              <input 
                type="checkbox" 
                checked={firmaDirectora} 
                onChange={() => handleCheckboxChange('firmaDirectora', setFirmaDirectora)} 
              />
              Firma de Directora de Departamento de Recursos Humanos y Materiales
            </label>
            <label>
              <input 
                type="checkbox" 
                checked={firmaResguardante} 
                onChange={() => handleCheckboxChange('firmaResguardante', setFirmaResguardante)} 
              />
              Firma del Resguardante
              {entrega.nombreResguardante}
            </label>
          </div>
          <textarea 
            value={comentarios} 
            onChange={handleComentariosChange} 
            placeholder="Comentarios"
            rows="4"
            cols="50"
          />
          <div>
            <button onClick={handleSaveChanges}>Guardar</button>
            <button onClick={handleConcluirActividad}>Concluir Actividad</button>
            <button onClick={() => navigate(-1)}>Regresar</button>
          </div>
        </>
      ) : (
        <p>Cargando...</p>
      )}
    </div>
  );
}

export default InfoEntregas;
