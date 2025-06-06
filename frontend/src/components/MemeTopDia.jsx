import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const MemeTopDia = () => {
  const { comprarMeme } = useUser();
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarMemes = async () => {
      try {
        const response = await fetch("http://tfc.snakernet.net:3000/api/meme/GetMemesSummary");
        const data = await response.json();
        setMemes(data);
      } catch (err) {
        console.error("Error cargando memes:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarMemes();
  }, []);

  const handleCompra = async (meme, e) => {
    e.stopPropagation();
    const exito = await comprarMeme(meme);
    setMensaje(exito ? `✅ Has comprado ${meme.nombre}` : "❌ No se pudo completar la compra");
    setTimeout(() => setMensaje(null), 2000);
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  if (loading) return <p className="text-gray-400">Cargando datos...</p>;

  const top5Alza = memes
    .filter((meme) => meme.cambio24h > 0)
    .sort((a, b) => b.cambio24h - a.cambio24h)
    .slice(0, 5);

  const top5Baja = memes
    .filter((meme) => meme.cambio24h < 0)
    .sort((a, b) => a.cambio24h - b.cambio24h)
    .slice(0, 5);

  // Mapeamos nombres para tooltips
  const idToNameMap = {};
  [...top5Alza, ...top5Baja].forEach((meme) => {
    idToNameMap[meme.id] = meme.nombre;
  });

  // Generamos un historial simulado para 24 horas (cada hora)
  const generarHistorial24h = (meme) => {
    const ahora = new Date();
    const precios = [];

    for (let i = 24; i >= 0; i--) {
      const fecha = new Date(ahora.getTime() - i * 60 * 60 * 1000);
      const formattedHour = `${fecha.getHours()}:00`;
      precios.push({
        hora: formattedHour,
        [meme.id]: meme.precio + (Math.random() - 0.5) * 1.5, // Variación pequeña
      });
    }
    return precios;
  };

  // Combinar históricos
  const combinedHistorial = (memesList) => {
    const historyByMeme = memesList.map(generarHistorial24h);

    // Juntar por hora
    const combined = historyByMeme.reduce((acc, curr) => {
      curr.forEach((entry, i) => {
        if (!acc[i]) acc[i] = { hora: entry.hora };
        acc[i] = { ...acc[i], ...entry };
      });
      return acc;
    }, []);

    return combined;
  };

  return (
    <div className="px-4 sm:px-8 py-4">
      {mensaje && (
        <div className="mb-3 px-4 py-2 bg-black/30 text-white text-sm rounded shadow">
          {mensaje}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alza */}
        <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <h2 className="text-white text-xl mb-4 font-bold">Top 5 Memes en Alza (24h)</h2>
          <div className="w-full h-64 mb-8">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={combinedHistorial(top5Alza)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="hora" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-800 p-3 rounded-lg text-white shadow-md">
                          <p className="text-sm">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={`item-${index}`} className="text-xs">
                              {idToNameMap[entry.dataKey]}: {currencyFormatter.format(entry.value)}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {top5Alza.map((meme, index) => (
                  <Line
                    key={meme.id}
                    type="monotone"
                    dataKey={meme.id}
                    stroke={`hsl(${(index * 60) % 360}, 70%, 60%)`}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tabla Alza */}
          <div className="overflow-x-auto rounded-xl">
            <table className="min-w-full text-white text-sm border border-white/10">
              <thead className="bg-white/10 text-left text-xs uppercase text-pink-300 tracking-wider">
                <tr>
                  <th className="px-4 py-3">Meme</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Cambio 24h</th>
                  <th className="px-4 py-3">Rareza</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {top5Alza.map((meme, index) => (
                  <tr
                    key={meme.id}
                    onClick={() => navigate(`/market/${meme.id}`)}
                    className={`cursor-pointer border-t border-white/10 hover:bg-white/10 transition ${
                      index % 2 === 0 ? "bg-white/5" : "bg-transparent"
                    }`}
                  >
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img
                        src={meme.imagen || "/placeholder.png"}
                        alt={meme.nombre}
                        className="w-10 h-10 rounded-full object-cover bg-white/10"
                      />
                      <span className="font-medium">{meme.nombre}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-green-400">
                      {currencyFormatter.format(meme.precio)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-green-500">
                      {meme.cambio24h.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 capitalize text-pink-300">{meme.rareza}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => handleCompra(meme, e)}
                        className="bg-pink-500 hover:bg-pink-600 px-4 py-1 text-xs rounded-md font-bold transition"
                      >
                        Comprar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Baja */}
        <div className="bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
          <h2 className="text-white text-xl mb-4 font-bold">Top 5 Memes en Baja (24h)</h2>
          <div className="w-full h-64 mb-8">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={combinedHistorial(top5Baja)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="hora" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-800 p-3 rounded-lg text-white shadow-md">
                          <p className="text-sm">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={`item-${index}`} className="text-xs">
                              {idToNameMap[entry.dataKey]}: {currencyFormatter.format(entry.value)}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {top5Baja.map((meme, index) => (
                  <Line
                    key={meme.id}
                    type="monotone"
                    dataKey={meme.id}
                    stroke={`hsl(${(index * 60) % 360}, 70%, 60%)`}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tabla Baja */}
          <div className="overflow-x-auto rounded-xl">
            <table className="min-w-full text-white text-sm border border-white/10">
              <thead className="bg-white/10 text-left text-xs uppercase text-pink-300 tracking-wider">
                <tr>
                  <th className="px-4 py-3">Meme</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Cambio 24h</th>
                  <th className="px-4 py-3">Rareza</th>
                  <th className="px-4 py-3">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {top5Baja.map((meme, index) => (
                  <tr
                    key={meme.id}
                    onClick={() => navigate(`/market/${meme.id}`)}
                    className={`cursor-pointer border-t border-white/10 hover:bg-white/10 transition ${
                      index % 2 === 0 ? "bg-white/5" : "bg-transparent"
                    }`}
                  >
                    <td className="px-4 py-3 flex items-center gap-3">
                      <img
                        src={meme.imagen || "/placeholder.png"}
                        alt={meme.nombre}
                        className="w-10 h-10 rounded-full object-cover bg-white/10"
                      />
                      <span className="font-medium">{meme.nombre}</span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-red-400">
                      {currencyFormatter.format(meme.precio)}
                    </td>
                    <td className="px-4 py-3 font-semibold text-red-500">
                      {meme.cambio24h.toFixed(2)}%
                    </td>
                    <td className="px-4 py-3 capitalize text-pink-300">{meme.rareza}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => handleCompra(meme, e)}
                        className="bg-pink-500 hover:bg-pink-600 px-4 py-1 text-xs rounded-md font-bold transition"
                      >
                        Comprar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeTopDia;
