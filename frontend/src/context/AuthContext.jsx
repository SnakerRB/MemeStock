import { createContext, useEffect, useState, useContext } from "react";
import { auth } from "../services/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

// Creamos el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listener de Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Función para cerrar sesión
  const logout = () => signOut(auth);

  // Proveedor del contexto
  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {!loading ? children : null}
    </AuthContext.Provider>
  );
};
