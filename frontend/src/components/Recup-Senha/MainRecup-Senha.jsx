import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react'; 
import { Link } from 'react-router-dom';

const MainRecupSenha = () => {
  const [enviado, setEnviado] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) setEnviado(true);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md text-center">
      <h2 className="text-3xl font-bold text-[#1a4731] mb-8 font-georgia">
        Recuperar Senha
      </h2>

      <form className="space-y-4 w-full" onSubmit={handleSubmit}>
        <input
          required
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-400 rounded-xl focus:ring-2 focus:ring-green-700 bg-white/80"
        />

        <button
          type="submit"
          className="w-full bg-[#407c4c] hover:bg-[#35663e] text-white py-3 rounded-xl rounded-xl shadow-md"
        >
          Enviar Link de Recuperação
        </button>
      </form>

      {enviado && (
        <div className="mt-4 flex items-center gap-2 w-full bg-[#d1d5db] py-3 rounded-xl justify-center">
          <CheckCircle2 className="text-green-600" size={20} />
          <span className="text-sm">Verifique seu email</span>
        </div>
      )}
    </div>
  );
};


export default MainRecupSenha;