import { motion } from "framer-motion";

const CallToAction = () => {
  return (
    <section className="py-20 bg-pink-500 text-white text-center">
      <motion.h2
        className="text-3xl md:text-4xl font-bold mb-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        ¿Listo para ser un inversor de memes?
      </motion.h2>
      <p className="mb-8 text-white/80">Únete gratis y empieza a tradear lo viral.</p>
      <motion.a
        href="/login"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="inline-block px-8 py-3 bg-white text-pink-500 font-bold rounded-xl shadow-lg transition"
      >
        ¡Empieza ahora!
      </motion.a>
    </section>
  );
};

export default CallToAction;
