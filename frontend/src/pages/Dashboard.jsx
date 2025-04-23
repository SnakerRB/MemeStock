const Dashboard = () => {
  return (
    <div className="px-6 py-10 max-w-7xl mx-auto space-y-10">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-pink-400 mb-2">Dashboard</h1>
        <p className="text-gray-300">Bienvenido a MemeStock 🧃</p>
      </header>

      {/* SECCIÓN 1: Resumen global */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {["Total de Memes", "Volumen 24h", "Top Comprado", "Meme más Rentable"].map((item, index) => (
          <div
            key={index}
            className="bg-white/10 backdrop-blur-xl p-4 rounded-xl shadow border border-white/10"
          >
            <p className="text-sm text-gray-400 uppercase mb-2">{item}</p>
            <p className="text-2xl font-bold text-white">--</p>
            <p className="text-xs text-green-400 mt-1">+0.00% hoy</p>
          </div>
        ))}
      </section>

      {/* SECCIÓN 2: Rankings */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[
          "🔥 Top Memes del Día",
          "🛒 Más Comprados",
          "📉 Más Vendidos",
          "📈 Top % de Subida",
          "📉 Top % de Bajada",
          "⭐ Favoritos del Mes",
        ].map((title, i) => (
          <div
            key={i}
            className="bg-white/10 p-5 rounded-2xl border border-white/10 shadow-sm backdrop-blur"
          >
            <h3 className="text-lg font-semibold text-pink-400 mb-4">{title}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="italic">Datos próximamente...</li>
              {/* futuro: map() de datos */}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Dashboard;
