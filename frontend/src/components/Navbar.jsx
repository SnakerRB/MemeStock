import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ChevronDown, Menu, X } from "lucide-react";
import { useUser } from "../context/UserContext";
import LogoutButton from "./LogoutButton";

const navItems = [
  { label: "📊 Dashboard", path: "/dashboard" },
  { label: "💰 Market", path: "/market" },
  { label: "🏆 Ranking", path: "/ranking" },
];

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false); // para el perfil en mobile
  const { saldo } = useUser();
  const dropdownRef = useRef(null);

  const handleProfileClick = () => setDropdownOpen((prev) => !prev);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleProfileMenu = () => setProfileMenuOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarUrl = user ? `http://tfc.snakernet.net:3000/avatars/${user.uid}.jpg` : "/default-avatar.png";

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return (
    <header className="w-full px-6 py-4 flex justify-between items-center bg-gray-900 shadow-md relative z-50">
      <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-pink-400 tracking-wider">
        <img
          src="/logoMS.png"
          alt="MemeStock Logo"
          className="w-8 h-8 object-contain" // ajusta el tamaño aquí si quieres más grande o más pequeño
        />
        MemeStock
      </Link>

      {user && (
        <div className="flex items-center space-x-6">
          {/* Botón de menú móvil */}
          <button
            onClick={toggleMenu}
            className="text-white md:hidden focus:outline-none"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>

          {/* Navegación principal (desktop) */}
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

          {/* Perfil (desktop) */}
          <div className="relative hidden md:flex" ref={dropdownRef}>
            <button
              onClick={handleProfileClick}
              className="flex items-center gap-2 text-white font-medium hover:text-pink-300 transition"
            >
              <img
                src={avatarUrl}
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

            {dropdownOpen && (
              <div className="absolute right-0 mt-15 w-48 bg-gray-800 rounded-xl shadow-lg p-3 space-y-2 border border-white/20 z-40">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm hover:bg-gray-700 rounded transition"
                >
                  👤 Ver perfil
                </Link>
                <Link
                  to="/cartera"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm hover:bg-gray-700 rounded transition"
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

      {/* Menú móvil */}
      {menuOpen && (
      <div className="fixed top-0 left-0 w-64 h-full bg-gray-900 shadow-lg p-6 flex flex-col justify-between z-50">
        {/* Navegación */}
        <div className="space-y-6">
          <div className="text-2xl font-bold text-pink-400 mb-10">MemeStock</div>
          <nav className="flex flex-col space-y-6">
            {navItems.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 text-white text-lg font-semibold hover:text-pink-400 ${
                  location.pathname === path ? "text-pink-400" : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Perfil */}
        <div className="flex flex-col items-center space-y-2 mt-10">
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-16 h-16 rounded-full border border-white/20 object-cover"
          />
          <span className="text-white font-semibold">{user.displayName}</span>
          <span className="text-green-400 font-mono text-sm">
            💰 {currencyFormatter.format(saldo)} coins
          </span>
          <div className="w-full mt-4 space-y-2">
            <Link
              to="/profile"
              onClick={() => {
                setProfileMenuOpen(false);
                setMenuOpen(false);
              }}
              className="block w-full text-center py-2 bg-pink-400 hover:bg-pink-500 rounded-lg text-white"
            >
              👤 Ver perfil
            </Link>
            <Link
              to="/cartera"
              onClick={() => {
                setProfileMenuOpen(false);
                setMenuOpen(false);
              }}
              className="block w-full text-center py-2 bg-pink-400 hover:bg-pink-500 rounded-lg text-white"
            >
              👜 Mi cartera
            </Link>
            <div className="border-t border-white/20 my-2" />
            <LogoutButton />
          </div>
        </div>
      </div>
    )}

    </header>
  );
};

export default Navbar;
