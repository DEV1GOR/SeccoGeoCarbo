import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
      <div className="w-24"></div>

      <div className="hidden md:flex gap-8 text-white font-medium text-lg tracking-wide">
        <a
          href="#sobre"
          className="hover:text-green-400 transition cursor-pointer"
        >
          Sobre
        </a>
        <a
          href="#plataforma"
          className="hover:text-green-400 transition cursor-pointer"
        >
          Plataforma
        </a>
        <a
          href="#solucoes"
          className="hover:text-green-400 transition cursor-pointer"
        >
          Soluções
        </a>
        <a
          href="#contato"
          className="hover:text-green-400 transition cursor-pointer"
        >
          Contato
        </a>
      </div>

      <Link
        to="/login"
        className="bg-[#10B981] hover:bg-green-600 text-white px-8 py-2 rounded-full font-bold transition shadow-lg inline-flex items-center justify-center"
      >
        Login
      </Link>
    </nav>
  );
};

export default Navbar;
