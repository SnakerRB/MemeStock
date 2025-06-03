import { useEffect, useState } from "react";
import { getMemesSummary } from "../services/meme"; // asegúrate que aquí apuntes a tu nuevo endpoint

const Dashboard = () => {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemes = async () => {
      try {
        const data = await getMemesSummary();
        setMemes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMemes();
  }, []);

  const totalMemes = memes.length;

  const volumen24h = memes.reduce((total, meme) => total + (meme.volumen24h || 0), 0);

  const memeMasRentable = [...memes].sort((a, b) => b.cambio24h - a.cambio24h)[0];

  const topComprado = [...memes].sort((a, b) => b.volumen24h - a.volumen24h)[0];

  const topSubida = [...memes]
    .sort((a, b) => b.cambio24h - a.cambio24h)
    .slice(0, 5);

  const topBajada = [...memes]
    .sort((a, b) => a.cambio24h - b.cambio24h)
    .slice(0, 5);

  if (loading) return <p className="text-gray-400">Cargando dashboard...</p>;

  return (
    <div className="px-6 py-10 max-w-7xl mx-auto space-y-10">
      <header className="mb-6">
        <h1 className="text-4xl font-bold text-pink-400 mb-2">Dashboard</h1>
        <p className="text-gray-300">Bienvenido a MemeStock 🧃</p>
      </header>

      {/* SECCIÓN 1: Resumen global */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/10 backdrop-blur-xl p-4 rounded-xl shadow border border-white/10">
          <p className="text-sm text-gray-400 uppercase mb-2">Total de Memes</p>
          <p className="text-2xl font-bold text-white">{totalMemes}</p>
          <p className="text-xs text-green-400 mt-1">+{(totalMemes * 0.05).toFixed(2)}% hoy</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl p-4 rounded-xl shadow border border-white/10">
          <p className="text-sm text-gray-400 uppercase mb-2">Volumen 24h</p>
          <p className="text-2xl font-bold text-white">${volumen24h.toLocaleString()}</p>
          <p className="text-xs text-green-400 mt-1">+1.23% hoy</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl p-4 rounded-xl shadow border border-white/10">
          <p className="text-sm text-gray-400 uppercase mb-2">Top Comprado</p>
          <p className="text-2xl font-bold text-white">{topComprado?.nombre || "--"}</p>
          <p className="text-xs text-green-400 mt-1">{topComprado ? `+${topComprado.cambio24h}%` : "--"}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-xl p-4 rounded-xl shadow border border-white/10">
          <p className="text-sm text-gray-400 uppercase mb-2">Meme más Rentable</p>
          <p className="text-2xl font-bold text-white">{memeMasRentable?.nombre || "--"}</p>
          <p className={`text-xs mt-1 ${memeMasRentable?.cambio24h >= 0 ? "text-green-400" : "text-red-400"}`}>
            {memeMasRentable ? `${memeMasRentable.cambio24h > 0 ? "+" : ""}${memeMasRentable.cambio24h}%` : "--"}
          </p>
        </div>
      </section>

      {/* SECCIÓN 2: Rankings */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* 🔥 Top Memes del Día */}
        <div className="bg-white/10 p-5 rounded-2xl border border-white/10 shadow-sm backdrop-blur">
          <h3 className="text-lg font-semibold text-pink-400 mb-4">🔥 Top Memes del Día</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {topSubida.map((meme) => (
              <li key={meme.id} className="flex justify-between">
                <span>{meme.nombre}</span>
                <span className="text-green-400">+{meme.cambio24h}%</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 📈 Top % de Subida */}
        <div className="bg-white/10 p-5 rounded-2xl border border-white/10 shadow-sm backdrop-blur">
          <h3 className="text-lg font-semibold text-pink-400 mb-4">📈 Top % de Subida</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {topSubida.map((meme) => (
              <li key={meme.id} className="flex justify-between">
                <span>{meme.nombre}</span>
                <span className="text-green-400">+{meme.cambio24h}%</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 📉 Top % de Bajada */}
        <div className="bg-white/10 p-5 rounded-2xl border border-white/10 shadow-sm backdrop-blur">
          <h3 className="text-lg font-semibold text-pink-400 mb-4">📉 Top % de Bajada</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            {topBajada.map((meme) => (
              <li key={meme.id} className="flex justify-between">
                <span>{meme.nombre}</span>
                <span className="text-red-400">{meme.cambio24h}%</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
