import HeroSection from "../components/HeroSection";
import Features from "../components/Features";
import CallToAction from "../components/CallToAction";

const Landing = () => {
  return (
    <div className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <HeroSection />
      <Features />
      <CallToAction />
    </div>
  );
};

export default Landing;
