import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

// Landing components
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import CallToAction from "../components/CallToAction";

const navItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Market", path: "/market" },
  { label: "Perfil", path: "/profile" },
];

const DefaultLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isLanding = !user && location.pathname === "/";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white flex flex-col font-inter">
      
      {/* HEADER */}
      <motion.header
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/10 border-b border-white/10 shadow-md"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-pink-400 tracking-wider">
            MemeStock
          </Link>
          {user && (
            <nav className="flex space-x-6 text-sm uppercase font-semibold tracking-wide">
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
              <button
                onClick={logout}
                className="text-red-400 hover:text-red-500 transition"
              >
                Salir
              </button>
            </nav>
          )}
        </div>
      </motion.header>

      {/* MAIN */}
      <main className="flex-grow w-full">
        {isLanding ? (
          <>
            <HeroSection />
            <Features />
            <CallToAction />
          </>
        ) : (
          <div className="px-4 py-10 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="text-center py-6 text-xs text-gray-400 bg-white/5 border-t border-white/10">
        © 2025 MemeStock. Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default DefaultLayout;
