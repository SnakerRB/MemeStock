import { useUser } from "../context/UserContext";
import { useEffect, useState } from "react";
import { getMemes } from "../services/meme";
import { useNavigate } from "react-router-dom";

const MemeTable = () => {
  const { comprarMeme } = useUser();
  const [mensaje, setMensaje] = useState(null);
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarMemes = async () => {
      try {
        const data = await getMemes();
        setMemes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarMemes();
  }, []);

  const handleCompra = async (meme, e) => {
    e.stopPropagation(); // Evita redirección al hacer clic en "Comprar"
    const exito = await comprarMeme(meme);
    setMensaje(exito ? `✅ Has comprado ${meme.nombre}` : "❌ No se pudo completar la compra");
    setTimeout(() => setMensaje(null), 2000);
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const dateFormatter = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const calcularCambio = (historial) => {
    if (!historial || historial.length === 0) return null;

    const precios = historial.map((h) => h.precio);
    const timestamps = historial.map((h) => new Date(h.timestamp));
    const ahora = new Date();

    const precioActual = precios[precios.length - 1];
    const hace24hIndex = timestamps.findLastIndex(
      (t) => ahora - t >= 24 * 60 * 60 * 1000
    );
    const precioHace24h =
      hace24hIndex !== -1 ? precios[hace24hIndex] : precios[0];

    const cambio = ((precioActual - precioHace24h) / precioHace24h) * 100;
    return cambio;
  };

  if (loading) return <p className="text-gray-400">Cargando memes...</p>;

  return (
    <div className="px-4 sm:px-8 py-4">
      {mensaje && (
        <div className="mb-3 px-4 py-2 bg-black/30 text-white text-sm rounded shadow">
          {mensaje}
        </div>
      )}
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full bg-white/5 backdrop-blur-md text-white text-sm border border-white/10">
          <thead className="bg-white/10 text-left text-xs uppercase text-pink-300 tracking-wider">
            <tr>
              <th className="px-4 py-3">Meme</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Última actualización</th>
              <th className="px-4 py-3">Rareza</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {memes.map((meme, index) => {
              const cambioCalculado = calcularCambio(meme.historial);
              const isPositive = cambioCalculado >= 0;

              return (
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
                  <td
                    className={`px-4 py-3 font-semibold ${
                      isPositive ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {meme.precio != null ? currencyFormatter.format(meme.precio) : "--"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-300">
                    {meme.precioTimestamp
                      ? dateFormatter(meme.precioTimestamp)
                      : "Sin datos"}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemeTable;
