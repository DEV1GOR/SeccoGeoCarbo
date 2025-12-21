import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Instagram,
  Twitter,
} from "lucide-react";

// Certifique-se que os caminhos estão corretos para suas imagens
import footerPlant from "../../assets/footer-plant.png";
import footerMolecule from "../../assets/footer-molecule.png";

const Footer = () => {
  return (
    <footer className="font-sans">
      {/* --- PARTE 1: SOBRE (Fundo Branco) --- */}
      <div className="bg-white py-20 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-bold mb-8 text-black">
            Sobre SECCO GeoCarbo
          </h2>

          <p className="text-gray-800 font-medium leading-relaxed mb-8 max-w-4xl mx-auto">
            Nossa missão é impulsionar a bioeconomia na Caatinga através de
            tecnologia de ponta para a quantificação e valorização do carbono.
            Combinamos inteligência artificial e sensoriamento remoto para
            oferecer dados precisos, transparentes e auditáveis.
          </p>

          {/* Linha Azul Separadora */}
          <div className="w-32 h-1 bg-cyan-400 mx-auto mb-10"></div>

          <div className="space-y-4 text-sm md:text-base">
            <p>
              <span className="text-green-500 font-bold">
                Benefícios Chave:{" "}
              </span>
              <span className="font-bold text-gray-800">
                Quantificação Precisa, Monitoramento Contínuo, Geração de
                Receita.
              </span>
            </p>
            <p>
              <span className="text-green-500 font-bold">Estatísticas: </span>
              <span className="font-bold text-gray-800">
                +1 Milhão de Hectares Monitorados, 99% de Precisão na Medição.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* --- PARTE 2: LINKS E CONTATO (Fundo Escuro) --- */}
      <div className="bg-[#222222] text-gray-400 py-16 px-6 relative overflow-hidden">
        {/* Planta Esquerda */}
        <img
          src={footerPlant}
          alt=""
          className="absolute bottom-0 left-0 w-32 md:w-48 opacity-20 pointer-events-none z-0 translate-y-6"
        />
        {/* Planeta Direita */}
        <img
          src={footerMolecule}
          alt=""
          className="absolute bottom-0 right-0 w-32 md:w-56 opacity-20 pointer-events-none z-0 translate-y-6"
        />

        {/* Conteúdo (z-10 garante que fica na frente das imagens) */}
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Coluna 1: Contatos */}
            <div>
              <h4 className="text-white font-bold mb-6">Contatos</h4>
              <ul className="space-y-4 text-sm">
                <li className="flex items-center gap-3 hover:text-green-400 transition cursor-pointer">
                  <Mail size={18} /> <span>gruposeccolab@gmail.com</span>
                </li>
                <li className="flex items-center gap-3 hover:text-green-400 transition cursor-pointer">
                  <Phone size={18} /> <span>(81) 99141-3580</span>
                </li>
                <li className="flex items-center gap-3 hover:text-green-400 transition cursor-pointer">
                  <MapPin size={18} /> <span>Caruaru, Pernambuco</span>
                </li>
              </ul>
            </div>

            {/* Coluna 2: Links Úteis */}
            <div>
              <h4 className="text-white font-bold mb-6">Links Úteis</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-green-400 transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition">
                    Termos de Uso
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition">
                    Políticas de Privacidade
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-green-400 transition">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Coluna 3: Redes Sociais */}
            <div>
              <h4 className="text-white font-bold mb-6">Redes Sociais</h4>
              <div className="flex gap-4">
                <a
                  href="https://www.linkedin.com/company/seccolab/?viewAsMember=true"
                  className="bg-gray-800 p-2 rounded hover:bg-green-600 hover:text-white transition"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="https://www.instagram.com/seccolab/"
                  className="bg-gray-800 p-2 rounded hover:bg-pink-600 hover:text-white transition"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="#"
                  className="bg-gray-800 p-2 rounded hover:bg-blue-400 hover:text-white transition"
                >
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
