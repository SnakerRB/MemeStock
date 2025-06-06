import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

const Profile = () => {
  const { user } = useAuth();
  const [memesComprados, setMemesComprados] = useState([]);
  const [transacciones, setTransacciones] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        try {
          const resMemes = await fetch(`http://tfc.snakernet.net:3000/api/user/${user.uid}/memes-comprados`);
          const memesData = await resMemes.json();
          setMemesComprados(memesData);

          const resTransacciones = await fetch(`http://tfc.snakernet.net:3000/api/user/${user.uid}/historial`);
          const transaccionesData = await resTransacciones.json();
          setTransacciones(transaccionesData);
        } catch (error) {
          console.error("Error al cargar datos de perfil:", error);
        }
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="px-6 py-12 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold text-pink-400 mb-10 text-center">
        Perfil del Usuario
      </h1>

      {user && (
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-xl border border-white/10 p-8 grid md:grid-cols-3 gap-8">
          {/* 🖼 Foto de perfil */}
          <div className="col-span-1 flex flex-col items-center">
            <img
              src={user.photoURL || "/default-avatar.png"}
              alt="Foto de perfil"
              className="w-32 h-32 rounded-full border-4 border-pink-400 shadow-lg mb-4"
            />
            <p className="text-lg font-semibold">{user.displayName}</p>
          </div>

          {/* 📊 Info del usuario */}
          <div className="col-span-2 space-y-6">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h2 className="text-pink-300 font-bold text-lg mb-2">Datos del Usuario</h2>
              <p><strong>Nombre:</strong> {user.displayName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>UID:</strong> {user.uid}</p>
            </div>

            {/* 🎨 Memes Comprados */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h2 className="text-pink-300 font-bold text-lg mb-2">Memes Comprados</h2>
              <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                {memesComprados.length > 0 ? (
                  memesComprados.map((meme) => (
                    <div
                      key={meme.id}
                      className="flex items-center gap-4 bg-white/10 p-3 rounded-lg hover:bg-white/20 transition"
                    >
                      <img
                        src={meme.imagen || "/placeholder.png"}
                        alt={meme.nombre}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold">{meme.nombre}</p>
                        <p className="text-sm text-gray-400 capitalize">{meme.rareza || "Rareza desconocida"}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">Todavía no has comprado ningún meme.</p>
                )}
              </div>
            </div>

            {/* 🧾 Historial de Transacciones */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h2 className="text-pink-300 font-bold text-lg mb-2">Historial de Transacciones</h2>
              <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
                {transacciones.length > 0 ? (
                  transacciones.map((transaccion, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-white/10 p-3 rounded-lg hover:bg-white/20 transition"
                    >
                      <div>
                        <p className="font-semibold">
                          {transaccion.tipo === "compra" ? "🛒 Compra" : "💸 Venta"}
                        </p>
                        <p className="text-sm text-gray-400">
                          {transaccion.memeNombre || "Meme desconocido"} — {new Date(transaccion.createdAt).toLocaleDateString("es-ES")}
                        </p>
                      </div>
                      <div className={`font-bold ${transaccion.tipo === "compra" ? "text-green-400" : "text-red-400"}`}>
                        {transaccion.tipo === "compra" ? "-" : "+"} ${transaccion.precio}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">No tienes transacciones registradas aún.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
