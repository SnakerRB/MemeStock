import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 py-20 relative overflow-hidden">
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-5xl sm:text-6xl font-bold text-pink-400 drop-shadow-md"
      >
        Invierte en los Memes del Futuro 🚀
      </motion.h1>
      <p className="text-gray-300 mt-6 max-w-xl text-lg">
        Bienvenido a MemeStock, la bolsa de los memes. Compra, vende y juega con lo más viral del internet.
      </p>
      <motion.a
        href="/login"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="mt-10 inline-block px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl shadow-lg transition"
      >
        Comienza ahora
      </motion.a>
    </section>
  );
};

export default HeroSection;
