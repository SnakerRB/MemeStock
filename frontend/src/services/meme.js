export const getMemes = async () => {
  const res = await fetch("http://tfc.snakernet.net:3000/api/meme/GetMemes");
  if (!res.ok) {
    throw new Error("Error al obtener los memes desde el backend");
  }
  return res.json();
};

export const getMemeById = async (memeId) => {
  const res = await fetch(`http://tfc.snakernet.net:3000/api/meme/GetMeme/${memeId}`);
  if (!res.ok) {
    throw new Error("Error al obtener el meme por ID desde el backend");
  }
  return res.json();
};

export const getMemesSummary = async () => {
  const res = await fetch("http://tfc.snakernet.net:3000/api/meme/GetMemesSummary");
  if (!res.ok) {
    throw new Error("Error al obtener el resumen de memes");
  }
  return res.json();
};