import { useUser } from "../context/UserContext";
import React, { useState } from "react";
import { registrarOperacion } from "../services/operaciones";

const Cartera = () => {
  const { cartera, venderMeme } = useUser();
  const [mensaje, setMensaje] = useState<string | null>(null);

  const handleVenta = async (meme) => {
    const exito = venderMeme(meme.id, () => registrarOperacion(meme, "venta"));
    setMensaje(exito ? `✅ Has vendido ${meme.name}` : "❌ No puedes vender este meme");
    setTimeout(() => setMensaje(null), 2000);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-white mb-4">👜 Mi Cartera de Memes</h1>

      {mensaje && (
        <div className="mb-3 px-4 py-2 bg-black/30 text-white text-sm rounded shadow">
          {mensaje}
        </div>
      )}

      {cartera.length === 0 ? (
        <p className="text-white/60">Aún no has comprado ningún meme.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cartera.map((meme) => (
            <div
              key={meme.id}
              className="border rounded-xl p-4 bg-white/5 text-white backdrop-blur shadow-md flex flex-col"
            >
              <img
                src={meme.image}
                alt={meme.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-bold">{meme.name}</h3>
              <p className="text-sm text-white/70">💰 {meme.price} coins</p>
              <p className="text-xs text-pink-300 mb-4">{meme.change}</p>
              <button
                onClick={() => handleVenta(meme)}
                className="mt-auto bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded transition"
              >
                Vender
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Cartera;