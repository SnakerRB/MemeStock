import { createContext, useEffect, useState, useContext } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

// Creamos el contexto
const AuthContext = createContext();

// Hook personalizado para consumir el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // Guardar userId en localStorage
      if (firebaseUser?.uid) {
        localStorage.setItem("userId", firebaseUser.uid);
      } else {
        localStorage.removeItem("userId");
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    localStorage.removeItem("userId");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};
