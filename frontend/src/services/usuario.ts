export type Meme = {
  id: string;
  nombre: string;
  imagen: string;
  categoria: string;
  rareza: "popular" | "raro" | "nuevo";
  cantidad: number;
  precioCompra: number;         // Precio en el momento de la compra
  fechaCompra: string;          // Timestamp de la operación
  precioActual?: number; 
};

export type UserData = {
  saldo: number;
  cartera: Meme[];
  avatar: string;         
};

export const getUserData = async (userId: string): Promise<UserData> => {
  const res = await fetch(`http://tfc.snakernet.net:3000/api/user/${userId}`);
  if (!res.ok) throw new Error("Error al obtener datos de usuario");
  return await res.json();
};
