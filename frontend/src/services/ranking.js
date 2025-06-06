// src/services/ranking.ts
export const getRanking = async () => {
  const res = await fetch("http://tfc.snakernet.net:3000/api/operaciones/ranking");
  if (!res.ok) {
    throw new Error("Error al obtener el ranking de inversores");
  }
  return res.json();
};
