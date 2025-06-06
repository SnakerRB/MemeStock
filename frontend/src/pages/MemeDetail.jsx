import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMemeById } from "../services/meme";
import { useUser } from "../context/UserContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const timeRanges = [
  { label: "Histórico", value: "all" },
  { label: "Último año", value: "1y" },
  { label: "Últimos 5 meses", value: "5m" },
  { label: "Último mes", value: "1m" },
  { label: "Última semana", value: "1w" },
  { label: "Últimas 24h", value: "24h" },
  { label: "Últimas 5h", value: "5h" },
];

const MemeDetail = () => {
  const { id } = useParams();
  const { comprarMeme } = useUser();

  const [meme, setMeme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [precioActual, setPrecioActual] = useState(0);
  const [cambio24h, setCambio24h] = useState(0);
  const [volumen24h, setVolumen24h] = useState(0);
  const [range, setRange] = useState("all");
  const [cantidad, setCantidad] = useState(1); // 🆕 NUEVO

  useEffect(() => {
    const fetchMeme = async () => {
      try {
        const data = await getMemeById(id);

        const historial = data.historial || [];
        if (historial.length > 0) {
          const precios = historial.map((h) => h.precio);
          const timestamps = historial.map((h) => new Date(h.timestamp));
          const ahora = new Date();

          const ultimo = precios[precios.length - 1];
          setPrecioActual(ultimo);

          const hace24hIndex = timestamps.findLastIndex(
            (t) => ahora - t >= 24 * 60 * 60 * 1000
          );

          const precioHace24h = hace24hIndex !== -1 ? precios[hace24hIndex] : precios[0];
          const cambio = ((ultimo - precioHace24h) / precioHace24h) * 100;
          setCambio24h(cambio.toFixed(2));

          const volumen = precios
            .filter((_, i) => ahora - timestamps[i] <= 24 * 60 * 60 * 1000)
            .reduce((a, b) => a + b, 0);
          setVolumen24h(volumen.toFixed(2));
        }

        setMeme(data);
      } catch (error) {
        console.error("Error al cargar el meme:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeme();
  }, [id]);

  const handleCompra = async () => {
    if (!meme) return;
    const exito = await comprarMeme({ ...meme, precio: precioActual, cantidad }); // 🆕 PASAR cantidad
    setMensaje(exito ? `✅ Has comprado ${cantidad} ${meme.nombre}` : "❌ Saldo insuficiente");
    setTimeout(() => setMensaje(null), 2000);
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  if (loading) return <p className="text-gray-400">Cargando datos del meme...</p>;
  if (!meme) return <p className="text-red-500">❌ Meme no encontrado</p>;

  const filtrarHistorial = (historial) => {
    if (!historial) return [];

    const ahora = new Date();
    let desdeFecha;

    switch (range) {
      case "1y":
        desdeFecha = new Date(ahora.getFullYear() - 1, ahora.getMonth(), ahora.getDate());
        break;
      case "5m":
        desdeFecha = new Date(ahora.getFullYear(), ahora.getMonth() - 5, ahora.getDate());
        break;
      case "1m":
        desdeFecha = new Date(ahora.getFullYear(), ahora.getMonth() - 1, ahora.getDate());
        break;
      case "1w":
        desdeFecha = new Date(ahora.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "24h":
        desdeFecha = new Date(ahora.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "5h":
        desdeFecha = new Date(ahora.getTime() - 5 * 60 * 60 * 1000);
        break;
      case "all":
      default:
        desdeFecha = null;
        break;
    }

    return historial
      .filter((h) => !desdeFecha || new Date(h.timestamp) >= desdeFecha)
      .map((entry) => ({
        ...entry,
        fecha: new Date(entry.timestamp).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
        }),
      }));
  };

  const historialFiltrado = filtrarHistorial(meme.historial);

  return (
    <div className="w-full px-4 py-6 space-y-6">
      {mensaje && (
        <div className="px-4 py-2 bg-black/30 text-white text-sm rounded shadow">
          {mensaje}
        </div>
      )}

      {/* ENCABEZADO */}
      <div className="flex items-center gap-6">
        <img
          src={meme.imagen || "/placeholder.png"}
          alt={meme.nombre}
          className="w-20 h-20 rounded-full bg-white/10 object-cover"
        />
        <div>
          <h1 className="text-3xl font-bold">{meme.nombre}</h1>
          <p className="text-gray-400 text-sm">ID: {meme.id}</p>
        </div>
      </div>

      {/* DATOS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <span className="text-gray-400 block">Precio</span>
          <span className="font-semibold text-xl">
            {currencyFormatter.format(precioActual)}
          </span>
        </div>
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <span className="text-gray-400 block">Cambio 24h</span>
          <span
            className={`font-semibold text-xl ${
              parseFloat(cambio24h) >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {parseFloat(cambio24h) >= 0 ? "📈" : "📉"} {cambio24h}%
          </span>
        </div>
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <span className="text-gray-400 block">Volumen</span>
          <span className="font-semibold text-xl">
            ${parseFloat(volumen24h).toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col items-center justify-center gap-2">
          {/* Selector de cantidad */}
          <input
            type="number"
            min="1"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            className="w-20 text-center text-sm rounded-lg px-3 py-1 bg-white/10 text-white border border-white/20 focus:outline-none"
          />
          <button
            onClick={handleCompra}
            className="bg-pink-500 hover:bg-pink-600 px-6 py-2 rounded font-semibold text-white"
          >
            Comprar
          </button>
        </div>
      </div>

      {/* GRÁFICA */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 h-[400px]">
        <h2 className="text-white text-sm mb-4 font-semibold">Evolución del precio</h2>

        {/* Botones de rango temporal */}
        <div className="flex flex-wrap gap-2 mb-6">
          {timeRanges.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={`px-3 py-1 rounded-full text-sm border ${
                range === opt.value
                  ? "bg-pink-500 text-white border-pink-500"
                  : "bg-gray-800 text-gray-300 border-white/10 hover:bg-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Gráfica */}
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historialFiltrado}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="fecha" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip
                formatter={(value) => `$${value.toFixed(2)}`}
                labelStyle={{ color: "#fff" }}
              />
              <Line
                type="monotone"
                dataKey="precio"
                stroke="#14b8a6"
                strokeWidth={2}
                dot
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default MemeDetail;
