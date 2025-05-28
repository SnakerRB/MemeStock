import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMemeById } from "../services/meme";
import { useUser } from "../context/UserContext";

const MemeDetail = () => {
  const { id } = useParams();
  const { comprarMeme } = useUser();

  const [meme, setMeme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    const fetchMeme = async () => {
      try {
        const data = await getMemeById(id);
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

    const exito = await comprarMeme(meme);
    setMensaje(exito ? `✅ Has comprado ${meme.nombre}` : "❌ Saldo insuficiente");
    setTimeout(() => setMensaje(null), 2000);
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  if (loading) return <p className="text-gray-400">Cargando datos del meme...</p>;
  if (!meme) return <p className="text-red-500">❌ Meme no encontrado</p>;

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

      {/* DATOS PRINCIPALES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <span className="text-gray-400 block">Precio</span>
          <span className="font-semibold text-xl">{currencyFormatter.format(meme.precio)}</span>
        </div>
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <span className="text-gray-400 block">Cambio 24h</span>
          <span
            className={`font-semibold text-xl ${
              parseFloat(meme.change) >= 0 ? "text-green-400" : "text-red-400"
            }`}
          >
            {parseFloat(meme.change) >= 0 ? "📈" : "📉"} {parseFloat(meme.change).toFixed(2)}%
          </span>
        </div>
        <div className="bg-white/5 p-4 rounded-lg border border-white/10">
          <span className="text-gray-400 block">Volumen</span>
          <span className="font-semibold text-xl">
            ${parseInt(meme.volume).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-center">
          <button
            onClick={handleCompra}
            className="bg-pink-500 hover:bg-pink-600 px-6 py-2 rounded font-semibold text-white"
          >
            Comprar
          </button>
        </div>
      </div>

      {/* GRÁFICA (placeholder por ahora) */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6 h-64 flex items-center justify-center text-gray-400 italic">
        📊 Aquí irá la gráfica de evolución del precio
      </div>
    </div>
  );
};

export default MemeDetail;
