import LoginButton from "../components/LoginButton";
import { motion } from "framer-motion";

const Login = () => (
  <div className="relative flex justify-center items-center h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] overflow-hidden">
    
    {/* Capa de partículas/sombras animadas */}
    <div className="absolute w-full h-full animate-pulse bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-800/10 to-transparent blur-3xl" />

    {/* Caja principal animada con glassmorphism */}
    <motion.div
      className="z-10 text-center backdrop-blur-xl bg-white/10 p-10 rounded-3xl border border-white/20 shadow-2xl max-w-md w-full"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <h1 className="text-white text-4xl font-extrabold mb-6 tracking-wide drop-shadow-lg">
        🚀 Bienvenido a <span className="text-pink-400">MemeStock</span>
      </h1>
      <p className="text-gray-300 mb-6">
        Invierte en lo más viral del internet. ¡Los memes del mañana!
      </p>
      <LoginButton />
    </motion.div>
  </div>
);

export default Login;
