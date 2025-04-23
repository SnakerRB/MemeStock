import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

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
            <p className="text-sm text-gray-300">{user.email}</p>
          </div>

          {/* 📊 Info del usuario */}
          <div className="col-span-2 space-y-6">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h2 className="text-pink-300 font-bold text-lg mb-2">Datos del Usuario</h2>
              <p><strong>Nombre:</strong> {user.displayName}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>UID:</strong> {user.uid}</p>
            </div>

            {/* 🧠 Placeholder para futuras secciones */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h2 className="text-pink-300 font-bold text-lg mb-2">Memes Comprados</h2>
              <p className="text-gray-400 italic">Aquí se mostrarán tus NFTs/memes adquiridos.</p>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <h2 className="text-pink-300 font-bold text-lg mb-2">Historial de Transacciones</h2>
              <p className="text-gray-400 italic">Aquí verás tus movimientos recientes en el mercado.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
