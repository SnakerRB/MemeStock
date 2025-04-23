// src/services/operaciones.ts

export const registrarOperacion = async (meme, tipo) => {
  const userId = localStorage.getItem("userId");

  await fetch("http://localhost:3000/api/operaciones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tipo,
      memeId: meme.id,
      nombre: meme.name,
      precio: meme.price,
      userId,
      timestamp: new Date().toISOString(),
    }),
  });
};

export const obtenerHistorial = async (userId: string) => {
  const res = await fetch(`http://localhost:3000/api/operaciones/${userId}`);
  if (!res.ok) throw new Error("Error al obtener historial");
  return await res.json();
};
