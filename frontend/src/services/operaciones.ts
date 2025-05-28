/**
 * Ejecuta una operación (compra o venta) llamando a POST /api/operaciones
 */
export const realizarOperacion = async (
  tipo: "compra" | "venta",
  memeId: string,
  precio: number,
  cantidad: number = 1
) => {
  const userId = localStorage.getItem("userId");

  if (!userId || !memeId || precio == null || cantidad == null || !tipo) {
    throw new Error("Faltan campos para registrar la operación");
  }

  const res = await fetch("http://localhost:3000/api/operaciones", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      tipo,
      memeId,
      precio,
      userId,
      cantidad,
    }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error al registrar operación");
  }

  return await res.json(); // { mensaje: "Operación registrada correctamente" }
};

/**
 * Obtiene el historial de operaciones de un usuario desde GET /api/operaciones/:userId
 */
export const obtenerHistorial = async (userId: string) => {
  const res = await fetch(`http://localhost:3000/api/operaciones/${userId}`);
  if (!res.ok) throw new Error("Error al obtener historial");
  return await res.json(); // Se espera un array de operaciones
};
