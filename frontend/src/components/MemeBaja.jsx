import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const MemeBaja = () => {
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
        // Filtrar memes a la baja
        const memesABaja = data
          .filter((meme) => meme.cambio24h < 0)
          .sort((a, b) => a.cambio24h - b.cambio24h); // Orden ascendente
        setMemes(memesABaja);
      } catch (err) {
        console.error("Error cargando memes:", err);
      } finally {
        setLoading(false);
      }
    };

    cargarMemes();
  }, []);

  const handleCompra = async (meme, e) => {
    e.stopPropagation(); // Evita navegar al pulsar comprar
    const exito = await comprarMeme(meme);
    setMensaje(exito ? `✅ Has comprado ${meme.nombre}` : "❌ No se pudo completar la compra");
    setTimeout(() => setMensaje(null), 2000);
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  if (loading) return <p className="text-gray-400">Cargando memes a la baja...</p>;

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
              <th className="px-4 py-3">Cambio 24h</th>
              <th className="px-4 py-3">Rareza</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {memes.map((meme, index) => (
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
  );
};

export default MemeBaja;
