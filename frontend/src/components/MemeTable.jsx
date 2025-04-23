import { memesMock } from "../data/memesMock";
import { useUser } from "../context/UserContext";
import { useState } from "react";
import { registrarOperacion } from "../services/operaciones"

const MemeTable = () => {
  const { comprarMeme } = useUser();
  const [mensaje, setMensaje] = useState(null);

  const handleCompra = async (meme) => {
    const exito = comprarMeme(meme, () => registrarOperacion(meme));
  
    setMensaje(exito ? `✅ Has comprado ${meme.name}` : "❌ Saldo insuficiente");
    setTimeout(() => setMensaje(null), 2000);
  };

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
              <th className="px-4 py-3">Volumen</th>
              <th className="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {memesMock.map((meme, index) => (
              <tr
                key={meme.id}
                className={`border-t border-white/10 ${
                  index % 2 === 0 ? "bg-white/5" : "bg-transparent"
                }`}
              >
                <td className="px-4 py-3 flex items-center gap-3">
                  <img src={meme.image} alt={meme.name} className="w-10 h-10 rounded-full" />
                  <span className="font-medium">{meme.name}</span>
                </td>
                <td className="px-4 py-3">${meme.price?.toFixed(2) ?? "--"}</td>
                <td className={`px-4 py-3 font-semibold ${meme.change > 0 ? "text-green-400" : "text-red-400"}`}>
                  {meme.change ? `${meme.change.toFixed(2)}%` : "--"}
                </td>
                <td className="px-4 py-3">${meme.volume ?? "--"}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleCompra(meme)}
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

export default MemeTable;
