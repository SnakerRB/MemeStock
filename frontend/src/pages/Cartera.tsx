import { useUser } from "../context/UserContext";
import React, { useState } from "react";

const Cartera = () => {
  const { cartera, venderMeme } = useUser();
  const [mensaje, setMensaje] = useState<string | null>(null);

  const handleVenta = async (meme: {
    id: string;
    precioCompra: number;
    nombre: string;
  }) => {
    const exito = await venderMeme(
      { id: meme.id, precio: meme.precioCompra },
      () => {
        setMensaje(`✅ Has vendido ${meme.nombre}`);
      }
    );
    if (!exito) setMensaje("❌ No puedes vender este meme");
    setTimeout(() => setMensaje(null), 2000);
  };

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

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
                src={meme.imagen || "/placeholder.png"}
                alt={meme.nombre}
                className="w-full h-40 object-cover rounded mb-2"
              />
              <h3 className="text-lg font-bold">{meme.nombre}</h3>
              <p className="text-sm text-white/70">🎯 Rareza: {meme.rareza}</p>
              <p className="text-sm">📦 Cantidad: {meme.cantidad}</p>
              <p className="text-sm">
                💸 Precio Compra: {currencyFormatter.format(meme.precioCompra)}
              </p>
              <p className="text-xs text-white/50 italic">
                Fecha de compra: {new Date(meme.fechaCompra).toLocaleDateString()}
              </p>

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
