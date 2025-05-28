import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChevronDown } from "lucide-react";
import { useUser } from "../context/UserContext";
import LogoutButton from "./LogoutButton";

const navItems = [
  { label: "📊 Dashboard", path: "/dashboard" },
  { label: "💰 Market", path: "/market" },
];

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { saldo } = useUser();

  const handleProfileClick = () => setDropdownOpen((prev) => !prev);

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <div className="w-full px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-pink-400 tracking-wider">
        MemeStock
      </Link>

      {user && (
        <div className="flex items-center space-x-6">
          {/* Navegación principal */}
          <nav className="hidden md:flex space-x-6 text-sm uppercase font-semibold tracking-wide">
            {navItems.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                className={`transition hover:text-pink-400 ${
                  location.pathname === path ? "text-pink-500 underline" : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* PERFIL */}
          <div className="relative">
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 text-white font-medium hover:text-pink-300 transition"
            >
              <img
                src={user.photoURL || "/default-avatar.png"}
                alt="avatar"
                className="w-8 h-8 rounded-full object-cover border border-white/20"
              />
              <span className="hidden sm:inline">
                {user.displayName}
                <br />
                <span className="text-xs text-green-400 font-mono">
                  💰 {currencyFormatter.format(saldo)} coins
                </span>
              </span>
              <ChevronDown size={16} className={`${dropdownOpen ? "rotate-180" : ""} transition`} />
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-lg rounded-xl shadow-lg p-3 space-y-2 border border-white/20 z-50">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm hover:bg-white/10 rounded transition"
                >
                  👤 Ver perfil
                </Link>
                <Link
                  to="/cartera"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm hover:bg-white/10 rounded transition"
                >
                  👜 Mi cartera
                </Link>
                <div className="border-t border-white/20" />
                <LogoutButton />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
