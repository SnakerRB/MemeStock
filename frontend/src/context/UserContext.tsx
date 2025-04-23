import React, { createContext, useContext, useState } from "react";

type Meme = {
  id: string;
  name: string;
  price: number;
  image: string;
  change: string;
  volume: string;
};

type UserContextType = {
  saldo: number;
  cartera: Meme[];
  comprarMeme: (meme: Meme, onCompraExitosa?: () => void) => boolean;
  venderMeme: (memeId: string, onVentaExitosa?: () => void) => boolean;
};

const UserContext = createContext<UserContextType | null>(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe usarse dentro de un UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [saldo, setSaldo] = useState(1000);
  const [cartera, setCartera] = useState<Meme[]>([]);

  const comprarMeme = (meme: Meme, onCompraExitosa?: () => void): boolean => {
    if (saldo >= meme.price) {
      setSaldo((prev) => prev - meme.price);
      setCartera((prev) => [...prev, meme]);
      onCompraExitosa?.();
      return true;
    }
    return false;
  };

  const venderMeme = (memeId: string, onVentaExitosa?: () => void): boolean => {
    const meme = cartera.find((m) => m.id === memeId);
    if (!meme) return false;

    setSaldo((prev) => prev + meme.price);
    setCartera((prev) => prev.filter((m) => m.id !== memeId));
    onVentaExitosa?.();
    return true;
  };

  return (
    <UserContext.Provider value={{ saldo, cartera, comprarMeme, venderMeme }}>
      {children}
    </UserContext.Provider>
  );
};
