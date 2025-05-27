export const getMemes = async () => {
  const res = await fetch("http://localhost:3000/api/meme/GetMemes");
  if (!res.ok) {
    throw new Error("Error al obtener los memes desde el backend");
  }
  return res.json();
};

export const getMemeById = async (memeId) => {
  const res = await fetch(`http://localhost:3000/api/meme/GetMeme/${memeId}`);
  if (!res.ok) {
    throw new Error("Error al obtener el meme por ID desde el backend");
  }
  return res.json();
};
