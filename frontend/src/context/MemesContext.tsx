import React, { createContext, useContext } from "react";
import { memesMock } from "../data/memesMock";

const MemesContext = createContext(memesMock);

export const useMemes = () => useContext(MemesContext);

export const MemesProvider = ({ children }: { children: React.ReactNode }) => {
  return <MemesContext.Provider value={memesMock}>{children}</MemesContext.Provider>;
};
