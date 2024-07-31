import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowCircleLeft, FaUserPlus, FaEdit, FaTrash } from "react-icons/fa";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import firebaseApp from "../firebase/credenciales";
import logo from "../img/logo.png";
import Pie from "../img/Pie.png";
import Swal from 'sweetalert2';
import styles from "../styles/usuarios.module.css";

const firestore = getFirestore(firebaseApp);

function ViewsUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const usuariosCollection = collection(firestore, "usuarios");
        const usuariosSnapshot = await getDocs(usuariosCollection);
        const usuariosList = usuariosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsuarios(usuariosList);
      } catch (error) {
        console.error("Error obteniendo usuarios:", error);
      }
    };

    fetchUsuarios();
  }, []);

  const handleAddUserClick = () => {
    navigate("/adduser");
  };

  const handleEditClick = (id) => {
    navigate(`/edituser/${id}`);
  };

  const handleDeleteClick = async (id) => {
    try {
      // Mostrar alerta de confirmación
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Una vez eliminado, no podrás recuperar este usuario.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#8A0046',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        await deleteDoc(doc(firestore, `usuarios/${id}`));
        setUsuarios(usuarios.filter(usuario => usuario.id !== id));

        // Alerta de éxito
        Swal.fire({
          title: 'Eliminado!',
          text: 'El usuario ha sido eliminado con éxito.',
          icon: 'success',
          confirmButtonColor: '#8A0046'
        });
      }
    } catch (error) {
      console.error("Error eliminando usuario:", error);

      // Alerta de error
      Swal.fire({
        title: 'Error!',
        text: 'Hubo un problema al eliminar el usuario.',
        icon: 'error',
        confirmButtonColor: '#8A0046'
      });
    }
  };

  const handleBackClick = () => {
    navigate("/home");
  };

  return (
    <div className={styles["add-user-panel"]}>
      <header className={styles["add-user-header"]}>
        <img src={logo} alt="Logo" className={styles["logo"]} />
        <h1 className={styles["header-title"]}>Usuarios</h1>
        <button className={styles["back-button"]} onClick={handleBackClick}>
          <FaArrowCircleLeft size={20} />
          Regresar
        </button>
      </header>
      <main className={styles["add-user-content"]}>
        <button className={styles["add-user-button"]} onClick={handleAddUserClick}>
          <FaUserPlus size={20} />
          Agregar Usuario
        </button>
        <div className={styles["usuarios-list"]}>
          {usuarios.length === 0 ? (
            <p>No hay usuarios registrados.</p>
          ) : (
            usuarios.map(usuario => (
              <div key={usuario.id} className={styles["usuario-card"]}>
                <img src={usuario.foto || "default-profile.png"} alt={`${usuario.nombre} ${usuario.apellidoPaterno}`} className={styles["usuario-photo"]} />
                <div className={styles["usuario-info"]}>
                  <h3>{usuario.nombre} {usuario.apellidoPaterno} {usuario.apellidoMaterno}</h3>
                  <p>Correo: {usuario.email}</p>
                  <p>Rol: {usuario.rol}</p>
                </div>
                <div className={styles["usuario-actions"]}>
                  <button className={`${styles["action-button"]} ${styles["edit-button"]}`} onClick={() => handleEditClick(usuario.id)}>
                    <FaEdit size={16} />
                    Editar
                  </button>
                  <button className={`${styles["action-button"]} ${styles["delete-button"]}`} onClick={() => handleDeleteClick(usuario.id)}>
                    <FaTrash size={16} />
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <footer className={styles["add-user-footer"]}>
        <img src={Pie} alt="Footer Decoration" className={styles["footer-decoration"]} />
      </footer>
    </div>
  );
}

export default ViewsUsuarios;
