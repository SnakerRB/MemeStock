import { auth, provider } from "../services/firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";

const LoginButton = () => {
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userData = {
        id: user.uid,
        nombre: user.displayName,
        avatar: user.photoURL, // 👈 Añadimos el avatar aquí
      };

      // Llamada al backend para crear o actualizar el usuario
      await axios.post("http://localhost:3000/api/user/newuser", userData);

    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:brightness-110 active:scale-95"
    >
      🚀 Iniciar sesión con Google
    </button>
  );
};

export default LoginButton;
