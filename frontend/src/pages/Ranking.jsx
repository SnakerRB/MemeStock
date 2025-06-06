import { useEffect, useState } from "react";
import { getRanking } from "../services/ranking";
import { Trophy } from "lucide-react";

const Ranking = () => {
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const data = await getRanking();
        setRanking(data);
      } catch (err) {
        console.error("Error cargando ranking:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  const getMedal = (index) => {
    if (index === 0) return "🥇";
    if (index === 1) return "🥈";
    if (index === 2) return "🥉";
    return `${index + 1}º`;
  };

  const API_BASE_URL = "http://tfc.snakernet.net:3000";

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-pink-400 mb-10 flex items-center gap-3 justify-center">
        <Trophy size={36} /> Ranking de Inversores
      </h1>

      {loading ? (
        <div className="text-center text-gray-300">Cargando ranking...</div>
      ) : ranking.length === 0 ? (
        <div className="text-center text-gray-400">No hay datos de ranking disponibles.</div>
      ) : (
        <div className="space-y-6">
          {ranking.map((user, index) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl backdrop-blur shadow-sm hover:scale-[1.02] transition-transform"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-pink-400">{getMedal(index)}</span>
                <img
                  src={user.avatar ? `${API_BASE_URL}${user.avatar}` : "/default-avatar.png"}
                  alt={user.nombre}
                  loading="lazy"
                  className="w-14 h-14 rounded-full border border-white/20 object-cover"
                />
                <span className="text-lg font-semibold text-white">{user.nombre}</span>
              </div>
              <span
                className={`text-xl font-bold ${
                  user.rentabilidad >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                {user.rentabilidad.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Ranking;
