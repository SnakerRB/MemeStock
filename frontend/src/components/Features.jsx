import { motion } from "framer-motion";
import { Rocket, ShieldCheck, TrendingUp } from "lucide-react";

const features = [
  {
    icon: <Rocket size={32} />,
    title: "Rendimiento Explosivo",
    description: "Invierte en los memes antes de que se hagan virales. Gana tokens por tu intuición.",
  },
  {
    icon: <TrendingUp size={32} />,
    title: "Estadísticas en Tiempo Real",
    description: "Visualiza las tendencias de los memes más rentables del día.",
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Autenticación Segura",
    description: "Inicia sesión con Google y navega con confianza.",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-[#1c1c3a] text-white">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold mb-12 text-pink-400">¿Por qué usar MemeStock?</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {features.map(({ icon, title, description }, i) => (
            <motion.div
              key={i}
              className="p-6 bg-white/10 rounded-2xl shadow-lg border border-white/20 backdrop-blur"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 text-pink-400">{icon}</div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-gray-300">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
