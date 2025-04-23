import { Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

// Landing components
import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import CallToAction from "../components/CallToAction";
import Navbar from "../components/Navbar";

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
        <Navbar />
      </motion.header>

      {/* MAIN */}
      <main className={`flex-grow w-full ${location.pathname === "/market" ? "" : "max-w-7xl mx-auto px-4 py-10"}`}>
        {isLanding ? (
          <>
            <HeroSection />
            <Features />
            <CallToAction />
          </>
        ) : (
          <Outlet />
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
