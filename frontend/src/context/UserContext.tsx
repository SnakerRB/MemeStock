import React, { createContext, useContext, useEffect, useState } from "react";
import { realizarOperacion } from "../services/operaciones";
import { getUserData, Meme } from "../services/usuario";

type UserContextType = {
  saldo: number;
  cartera: Meme[];
  comprarMeme: (meme: { id: string; precio: number }, onCompraExitosa?: () => void) => Promise<boolean>;
  venderMeme: (meme: { id: string; precio: number }, onVentaExitosa?: () => void) => Promise<boolean>;
};

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser debe usarse dentro de UserProvider");
  return ctx;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [saldo, setSaldo] = useState<number>(0);
  const [cartera, setCartera] = useState<Meme[]>([]);
  const userId = localStorage.getItem("userId") || "";

  useEffect(() => {
    if (!userId) return;
    getUserData(userId)
      .then((u) => {
        setSaldo(u.saldo);
        setCartera(u.cartera);
      })
      .catch(console.error);
  }, [userId]);

  const comprarMeme = async (
    meme: { id: string; precio: number },
    onCompraExitosa?: () => void
  ): Promise<boolean> => {
    try {
      await realizarOperacion("compra", meme.id, meme.precio, 1);
      const u = await getUserData(userId);
      setSaldo(u.saldo);
      setCartera(u.cartera);
      onCompraExitosa?.();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const venderMeme = async (
    meme: { id: string; precio: number },
    onVentaExitosa?: () => void
  ): Promise<boolean> => {
    try {
      await realizarOperacion("venta", meme.id, meme.precio, 1);
      const u = await getUserData(userId);
      setSaldo(u.saldo);
      setCartera(u.cartera);
      onVentaExitosa?.();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <UserContext.Provider value={{ saldo, cartera, comprarMeme, venderMeme }}>
      {children}
    </UserContext.Provider>
  );
};
