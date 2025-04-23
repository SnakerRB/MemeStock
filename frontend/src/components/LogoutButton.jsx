import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react"; // opcional para ícono bonito

const LogoutButton = () => {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold shadow hover:shadow-red-500/30 transition-all"
    >
      <LogOut size={18} />
      <span className="tracking-wide">Cerrar sesión</span>
    </button>
  );
};

export default LogoutButton;
