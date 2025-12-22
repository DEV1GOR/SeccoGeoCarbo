import NavbarRecupSenha from '../components/Recup-Senha/NavbarRecup-Senha.jsx';
import MainRecupSenha from '../components/Recup-Senha/MainRecup-Senha.jsx';
import { Link } from 'react-router-dom';
import bgImage from '../assets/photo-recup-senha.png';

const ForgotPassword = () => {
  return (
    <div
      className="min-h-screen w-full flex flex-col relative overflow-hidden bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <NavbarRecupSenha />

      {/* Conteúdo central */}
      <main className="flex-1 flex items-center justify-center z-10 p-4">
        <MainRecupSenha />
      </main>

      {/* Rodapé REAL */}
      <footer className="pb-6 text-center z-10">
        <Link
          to="/login"
          className="text-gray-500 hover:text-gray-700 font-medium text-sm transition-colors"
        >
          Voltar ao Login
        </Link>
      </footer>
    </div>
  );
};

export default ForgotPassword;
