import Navbar from "../components/Landing/Navbar";
import Hero from "../components/Landing/Hero";
import Features from "../components/Landing/Features";
import Process from "../components/Landing/Process";
import Footer from "../components/Landing/Footer";

const Landing = () => {
  return (
    <div className="font-sans text-gray-800">
      {/* Barra de Navegação */}
      <Navbar />

      {/* Seção Principal (Imagem de Fundo) */}
      <Hero />

      {/* Ícones de Soluções */}
      <Features />

      {/* Passo a Passo (Fundo Escuro) */}
      <Process />

      {/* Rodapé */}
      <Footer />
    </div>
  );
};

export default Landing;
