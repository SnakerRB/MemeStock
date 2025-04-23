import React from "react";

interface Meme {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  rareza: string;
}

export const MemeCard = ({ meme }: { meme: Meme }) => {
  return (
    <div className="border rounded-xl p-4 bg-white shadow-md hover:shadow-lg transition w-full max-w-[240px]">
      <img src={meme.imagen} alt={meme.nombre} className="w-full h-48 object-cover rounded-lg mb-2" />
      <h3 className="text-lg font-bold">{meme.nombre}</h3>
      <p className="text-sm text-gray-600">💰 {meme.precio} coins</p>
      <p className="text-xs text-blue-500 mt-1">📁 {meme.categoria}</p>
      <span className={`inline-block mt-2 px-2 py-1 text-xs font-semibold rounded bg-${getRarezaColor(meme.rareza)}`}>
        {meme.rareza}
      </span>
    </div>
  );
};

const getRarezaColor = (rareza: string) => {
  switch (rareza.toLowerCase()) {
    case "popular":
      return "yellow-200 text-yellow-900";
    case "raro":
      return "purple-200 text-purple-900";
    case "nuevo":
      return "green-200 text-green-900";
    default:
      return "gray-200 text-gray-900";
  }
};
