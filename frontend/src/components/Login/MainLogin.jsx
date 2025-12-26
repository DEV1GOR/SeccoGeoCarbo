import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();

  // Estados de controle
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Função que conecta com o Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Tenta fazer Login
      const loginResponse = await fetch("http://127.0.0.1:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginResponse.json();

      if (!loginResponse.ok) {
        throw new Error(loginData.detail || "Falha ao autenticar");
      }

      // 2. Salva o Token
      const token = loginData.access_token;
      localStorage.setItem("access_token", token);

      // 3. Valida se tem Perfil (/api/users/me)
      const userResponse = await fetch("http://127.0.0.1:8000/api/users/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // 4. Redireciona conforme o status
      if (userResponse.status === 200) {
        navigate("/dashboard"); // Usuário completo -> Dashboard
      } else if (userResponse.status === 404) {
        navigate("/complete-profile"); // Usuário sem perfil -> Completar cadastro
      } else {
        throw new Error("Erro ao verificar perfil do usuário");
      }
    } catch (err) {
      setError(
        err.message === "Email ou senha incorretos"
          ? "Email ou senha incorretos."
          : "Erro de conexão. Tente novamente."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm p-10 rounded-[40px] shadow-2xl w-full max-w-md text-center">
      <h2 className="text-2xl font-bold text-green-900 mb-1 font-serif">
        Bem-Vindo ao GeoCarbo
      </h2>
      <p className="text-gray-600 text-sm mb-8">
        faça login na sua conta para continuar
      </p>

      {/* Exibe erro se houver */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo de Email */}
        <div className="relative">
          <Mail
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        {/* Campo de Senha */}
        <div className="relative">
          <Lock
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type={showPassword ? "text" : "password"}
            placeholder="senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-700"
          >
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

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#358a4d] hover:bg-green-800 text-white font-bold py-3 rounded-full mt-2 transition-all shadow-lg active:scale-95 flex justify-center items-center
            ${loading ? "opacity-70 cursor-not-allowed" : ""}`}
        >
          {loading ? (
            // Spinner simples feito com CSS
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Entrar"
          )}
        </button>
      </form>

      <p className="mt-6 text-sm text-gray-600">
        Não tem conta?{" "}
        <Link
          to="/register"
          className="text-green-700 font-bold hover:underline"
        >
          Cadastre-se
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
