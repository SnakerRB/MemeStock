export type Meme = {
  id: string;
  nombre: string;
  imagen: string;
  categoria: string;
  rareza: "popular" | "raro" | "nuevo";
  cantidad: number;
  precioCompra: number;         // Precio en el momento de la compra
  fechaCompra: string;          // Timestamp de la operación
};

export const getUserData = async (userId: string): Promise<{
  saldo: number;
  cartera: Meme[];
}> => {
  const res = await fetch(`http://localhost:3000/api/user/${userId}`);
  if (!res.ok) throw new Error("Error al obtener datos de usuario");
  return await res.json();
};
