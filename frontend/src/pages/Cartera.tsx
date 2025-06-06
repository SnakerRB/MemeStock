import { useUser } from "../context/UserContext";
import React, { useEffect, useState } from "react";
import { getMemesSummary, getMemeById } from "../services/meme";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  ResponsiveContainer,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

// Tipos
type MemeSummary = {
  id: string;
  nombre: string;
  imagen: string;
  rareza: "popular" | "raro" | "nuevo";
  precio: number;
  cambio24h: number;
  volumen24h: number;
};

type MemeHistorial = {
  precio: number;
  timestamp: string;
};

// 🔥 ESTE tipo nuevo es el que faltaba
type HistorialRow = {
  fecha: string;
  [memeId: string]: number | string;
};

const COLORS = [
  "#14b8a6", "#f43f5e", "#f59e0b", "#6366f1", "#ec4899", "#8b5cf6", "#10b981", "#3b82f6",
  "#ef4444", "#eab308", "#06b6d4", "#a855f7", "#f97316", "#22c55e", "#0ea5e9", "#db2777"
];

const Cartera = () => {
  const { cartera, venderMeme } = useUser();
  const [preciosActuales, setPreciosActuales] = useState<MemeSummary[]>([]);
  const [historial, setHistorial] = useState<Record<string, MemeHistorial[]>>({});
  const [selectedMemes, setSelectedMemes] = useState<string[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const handleVenta = async (meme: { id: string; precioCompra: number; nombre: string; }) => {
    const exito = await venderMeme(
      { id: meme.id, precio: meme.precioCompra },
      () => setMensaje(`✅ Has vendido ${meme.nombre}`)
    );
    if (!exito) setMensaje("❌ No puedes vender este meme");
    setTimeout(() => setMensaje(null), 2000);
  };

  useEffect(() => {
    console.log("👜 Cartera actual:", cartera); 
    const fetchData = async () => {
      if (cartera.length === 0) return;

      try {
        const precios = await getMemesSummary();
        console.log("📈 Precios actuales:", precios);
        
        const historialData: Record<string, MemeHistorial[]> = {};
        for (const meme of cartera) {
          const datos = await getMemeById(meme.id);
          historialData[meme.id] = datos.historial;
        }
        console.log("📚 Historial completo:", historialData);
        setPreciosActuales(precios);
        setHistorial(historialData);
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };

    fetchData();
  }, [cartera]);


  const obtenerPrecioActual = (id: string) => {
    const meme = preciosActuales.find((m) => m.id === id);
    return meme ? meme.precio : null;
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const dataGrafico = cartera.map((meme) => {
    const precioActual = obtenerPrecioActual(meme.id) || 0;
    return {
      name: meme.nombre,
      value: precioActual * meme.cantidad,
    };
  }).filter(item => item.value > 0);

  const handleSelectMeme = (id: string) => {
    setSelectedMemes((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((memeId) => memeId !== id)
        : [...prevSelected, id]
    );
  };

  const memesToShow = selectedMemes.length > 0 ? selectedMemes : cartera.map((m) => m.id);

  const combinedHistorial = () => {
    const result: HistorialRow[] = [];

    for (const id of memesToShow) {
      const memeHistorial = historial[id] || [];
      for (const point of memeHistorial) {
        const fecha = new Date(point.timestamp).toLocaleDateString("es-ES");
        let existing = result.find((r) => r.fecha === fecha);
        if (!existing) {
          existing = { fecha };
          result.push(existing);
        }
        existing[id] = point.precio;
      }
    }

    return result.sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  };

  // 👉 Para mapear ID -> nombre en tooltip
  const idToNameMap = Object.fromEntries(cartera.map((meme) => [meme.id, meme.nombre]));

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold text-white mb-4">👜 Mi Cartera de Memes</h1>

      {mensaje && (
        <div className="mb-6 px-4 py-2 bg-green-500/20 text-white text-sm rounded shadow">
          {mensaje}
        </div>
      )}

      {/* Gráficos en Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* PieChart */}
        {dataGrafico.length > 0 && (
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-md backdrop-blur">
            <h2 className="text-xl font-semibold text-white mb-4 text-center">📊 Distribución de tu Cartera</h2>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  dataKey="value"
                  data={dataGrafico}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {dataGrafico.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `${currencyFormatter.format(value)}`}
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#f9fafb",
                  }}
                  itemStyle={{ color: "#f9fafb" }}
                  labelStyle={{ color: "#d1d5db" }}
                />
                <Legend
                  verticalAlign="bottom"
                  align="center"
                  iconType="circle"
                  wrapperStyle={{ marginTop: "0px", color: "white" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* LineChart */}
        {Object.keys(historial).length > 0 && (
          <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-md backdrop-blur">
            <h2 className="text-xl font-semibold text-white mb-4 text-center">📈 Evolución de precios</h2>
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {cartera.map((meme) => (
                <button
                  key={meme.id}
                  onClick={() => handleSelectMeme(meme.id)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    selectedMemes.includes(meme.id)
                      ? "bg-pink-500 text-white"
                      : "bg-white/10 text-white hover:bg-pink-500 hover:text-white"
                  }`}
                >
                  {meme.nombre}
                </button>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={combinedHistorial()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="fecha" stroke="#ccc" />
                <YAxis stroke="#ccc" />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-slate-800 p-3 rounded-lg text-white shadow-md">
                          <p className="text-sm">{label}</p>
                          {payload.map((entry, index) => (
                            <p key={`item-${index}`} className="text-xs">
                              {idToNameMap[entry.dataKey as string]}: {currencyFormatter.format(entry.value as number)}
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {memesToShow.map((id, index) => (
                  <Line
                    key={id}
                    type="monotone"
                    dataKey={id}
                    stroke={`hsl(${(index * 45) % 360}, 70%, 60%)`}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Detalles en Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cartera.map((meme) => {
          const precioActual = obtenerPrecioActual(meme.id);
          const valorActual = precioActual ? precioActual * meme.cantidad : null;
          const variacionPorcentaje =
            precioActual != null
              ? ((precioActual - meme.precioCompra) / meme.precioCompra) * 100
              : null;

          return (
            <div
              key={meme.id}
              className="border border-white/10 rounded-2xl p-4 bg-white/5 text-white backdrop-blur shadow-md flex flex-col transition hover:scale-[1.02]"
            >
              <img
                src={meme.imagen || "/placeholder.png"}
                alt={meme.nombre}
                className="w-full h-40 object-cover rounded mb-4"
              />
              <h3 className="text-lg font-bold">{meme.nombre}</h3>
              <p className="text-sm text-white/70 mb-2">🎯 Rareza: {meme.rareza}</p>
              <p className="text-sm">📦 Cantidad: {meme.cantidad}</p>
              <p className="text-sm">💸 Compra: {currencyFormatter.format(meme.precioCompra)}</p>
              <p className="text-sm">
                📊 Valor Actual: {valorActual != null ? currencyFormatter.format(valorActual) : "--"}
              </p>
              <p className="text-sm">
                📈 Variación:{" "}
                {variacionPorcentaje != null ? (
                  <span className={variacionPorcentaje >= 0 ? "text-green-400" : "text-red-400"}>
                    {variacionPorcentaje.toFixed(2)}%
                  </span>
                ) : "--"}
              </p>
              <p className="text-xs text-white/50 italic mt-2">
                Fecha compra: {new Date(meme.fechaCompra).toLocaleDateString()}
              </p>

              <button
                onClick={() => handleVenta(meme)}
                className="mt-auto bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded transition"
              >
                Vender
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Cartera;
