import React, { useState } from "react";
import MemeTable from "../components/MemeTable";
import MemeAlza from "../components/MemeAlza";
import MemeBaja from "../components/MemeBaja";
import MemeTopDia from "../components/MemeTopDia";

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
      <aside className="md:w-64 w-full bg-white/10 backdrop-blur-md px-4 py-6 border-r border-white/10 shadow-lg">
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
      <main className="flex-1 px-0 overflow-auto">
        <h1 className="text-3xl font-bold mb-6 text-pink-400">
          🧠 {activeOption}
        </h1>

        {activeOption === "Resumen" ? (
          <MemeTable />
        ) : activeOption === "Memes en Alza" ? (
          <MemeAlza />
        ) : activeOption === "Memes en Baja" ? (
          <MemeBaja />
        ) : activeOption === "Ranking del Día" ? (
          <MemeTopDia />
        ) : (
          <div className="text-gray-400 italic text-sm">
            Contenido próximamente...
          </div>
        )}
      </main>
    </div>
  );
};

export default Market;
