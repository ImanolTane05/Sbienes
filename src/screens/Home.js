import React, { useEffect, useState } from "react";
import AdminView from "../components/AdminView";
import UserView from "../components/UserViews";
import firebaseApp from "../firebase/credenciales";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDoc = doc(firestore, `usuarios/${currentUser.uid}`);
          const userSnapshot = await getDoc(userDoc);

          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            setUser({
              uid: currentUser.uid,
              email: currentUser.email,
              nombre: userData.nombre,
              rol: userData.rol
            });
          }
        } catch (error) {
          console.error("Error obteniendo datos del usuario:", error.message);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {user.rol === "admin" ? <AdminView user={user} /> : <UserView user={user} />}
    </div>
  );
}

export default Home;
