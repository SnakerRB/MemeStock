import React, { useState } from "react";
import { memesMock } from "../data/memesMock";

const sidebarOptions = [
  "Resumen",
  "Memes en Alza",
  "Memes en Baja",
  "Ranking del Día",
  "Favoritos",
];

const Market = () => {
  const [activeOption, setActiveOption] = useState("Resumen");

  return (
    <div className="flex flex-col md:flex-row h-full min-h-[calc(100vh-120px)]">
      
      {/* SIDEBAR */}
      <aside className="md:w-64 w-full bg-white/10 backdrop-blur-md p-6 border-r border-white/10 shadow-lg">
        <h2 className="text-xl font-bold text-pink-400 mb-6 uppercase tracking-wider">
          Mercado
        </h2>
        <nav className="space-y-4">
          {sidebarOptions.map((option) => (
            <button
              key={option}
              onClick={() => setActiveOption(option)}
              className={`w-full text-left px-4 py-2 rounded-lg transition text-sm font-semibold ${
                activeOption === option
                  ? "bg-pink-500 text-white shadow-md"
                  : "text-gray-300 hover:bg-white/5"
              }`}
            >
              {option}
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 text-pink-400">
          🧠 {activeOption}
        </h1>

        {/* LISTA TIPO TABLA */}
        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-white/5 backdrop-blur-md text-white text-sm rounded-xl overflow-hidden border border-white/10">
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
                    <button className="bg-pink-500 hover:bg-pink-600 px-4 py-1 text-xs rounded-md font-bold transition">
                      Comprar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Market;
