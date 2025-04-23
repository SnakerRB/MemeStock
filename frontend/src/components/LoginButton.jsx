import { auth, provider } from "../services/firebase";
import { signInWithPopup } from "firebase/auth";

const LoginButton = () => {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error al iniciar sesión", error);
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
