import { useState } from 'react'; 
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'; 
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-white/90 backdrop-blur-sm p-10 rounded-[40px] shadow-2xl w-full max-w-md text-center">
      <h2 className="text-2xl font-bold text-green-900 mb-1 font-serif">Bem-Vindo ao GeoCarbo</h2>
      <p className="text-gray-600 text-sm mb-8">faça login na sua conta para continuar</p>

      <form className="space-y-4">
        {/* Campo de Email */}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type="email" placeholder="seu@email.com" className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500" />
        </div>

        {/* Campo de Senha */}
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input type={showPassword ? "text" : "password"} placeholder="senha" className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-700">
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Link Esqueceu a Senha */}
        <div className="flex justify-end px-1">
          <Link 
            to="/forgot-password" 
            className="text-xs text-gray-500 hover:text-green-700 hover:underline transition-colors"
          >
            Esqueceu a senha?
          </Link>
        </div>
        
        <button className="w-full bg-[#358a4d] hover:bg-green-800 text-white font-bold py-3 rounded-full mt-2 transition-all shadow-lg active:scale-95">
          Entrar
        </button>
      </form>
      
      <p className="mt-6 text-sm text-gray-600">
        Não tem conta? <a href="#" className="text-green-700 font-bold hover:underline">Cadastre-se</a>
      </p>
    </div>
  );
};

export default LoginForm;