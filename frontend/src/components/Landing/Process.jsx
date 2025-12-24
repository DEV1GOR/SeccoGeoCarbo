import { ArrowRight, ArrowDown } from "lucide-react";

const Process = () => {
  // Links Temporários (Placeholders)
  // Lembrar de trocar depois para as imagens do processo principal
  const p1 = "https://cdn-icons-png.flaticon.com/512/3222/3222797.png"; // Satélite
  const p2 = "https://cdn-icons-png.flaticon.com/512/2920/2920329.png"; // Servidores/Processamento
  const p3 = "https://cdn-icons-png.flaticon.com/512/2942/2942544.png"; // Natureza/Dados
  const p4 = "https://cdn-icons-png.flaticon.com/512/3094/3094851.png"; // Gráfico/Precificação

  return (
    <section className="py-20 bg-[#1a1a1a] text-white">
      <div className="container mx-auto px-6 text-center max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-16">
          Processo de Medição de Captura de Carbono
        </h2>

        <div className="flex flex-col md:flex-row justify-center items-start gap-8 relative">
          {/* Passo 1 */}
          <div className="flex-1 flex flex-col items-center group">
            <div className="relative mb-6 transition-transform duration-300 group-hover:-translate-y-2">
              <img
                src={p1}
                alt="Satélite"
                className="h-32 w-auto object-contain"
              />
              {/* Efeito de brilho verde atrás da imagem */}
              <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h4 className="text-xl font-bold mb-2">Imagem de satélite</h4>
            <p className="text-gray-400 text-sm">
              Coleta de dados brutos via sensoriamento remoto.
            </p>
          </div>

          {/* Seta 1 */}
          <div className="hidden md:flex pt-12 text-green-500">
            <ArrowRight size={32} />
          </div>
          <div className="md:hidden text-green-500 my-[-10px]">
            <ArrowDown size={32} />
          </div>

          {/* Passo 2 */}
          <div className="flex-1 flex flex-col items-center group">
            <div className="relative mb-6 transition-transform duration-300 group-hover:-translate-y-2">
              <img
                src={p2}
                alt="Processamento IA"
                className="h-32 w-auto object-contain"
              />
              <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h4 className="text-xl font-bold mb-2">Processamento</h4>
            <p className="text-gray-400 text-sm">
              Análise de Inteligência Artificial para identificar biomassa.
            </p>
          </div>

          {/* Seta 2 */}
          <div className="hidden md:flex pt-12 text-green-500">
            <ArrowRight size={32} />
          </div>
          <div className="md:hidden text-green-500 my-[-10px]">
            <ArrowDown size={32} />
          </div>

          {/* Passo 3 */}
          <div className="flex-1 flex flex-col items-center group">
            <div className="relative mb-6 transition-transform duration-300 group-hover:-translate-y-2">
              <img
                src={p3}
                alt="Estoque de Carbono"
                className="h-32 w-auto object-contain"
              />
              <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h4 className="text-xl font-bold mb-2">Dados de Estoque</h4>
            <p className="text-gray-400 text-sm">
              Mapeamento preciso do carbono na região.
            </p>
          </div>

          {/* Seta 3 */}
          <div className="hidden md:flex pt-12 text-green-500">
            <ArrowRight size={32} />
          </div>
          <div className="md:hidden text-green-500 my-[-10px]">
            <ArrowDown size={32} />
          </div>

          {/* Passo 4 */}
          <div className="flex-1 flex flex-col items-center group">
            <div className="relative mb-6 transition-transform duration-300 group-hover:-translate-y-2">
              <img
                src={p4}
                alt="Precificação"
                className="h-32 w-auto object-contain"
              />
              <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
            <h4 className="text-xl font-bold mb-2">Precificação</h4>
            <p className="text-gray-400 text-sm">
              Geração de valor e créditos de carbono.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
