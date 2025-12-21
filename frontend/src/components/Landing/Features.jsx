import iconAi from "../../assets/icon-ai.jpg";
import iconSatellite from "../../assets/icon-satellite.jpg";
import iconSust from "../../assets/icon-sustainability.png";

const Features = () => {
  return (
    <section id="solucoes" className="py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid md:grid-cols-3 gap-12 text-center">
          {/* Card 1 - IA */}
          <div className="flex flex-col items-center">
            <div className="mb-6 h-24 flex items-end">
              <img
                src={iconAi}
                alt="Ícone Inteligência Artificial"
                className="h-20 w-auto object-contain hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Inteligência Artificial
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base px-4">
              Nossa IA avançada analisa dados com precisão para quantificar o
              estoque de carbono em tempo real.
            </p>
          </div>

          {/* Card 2 - Satélite */}
          <div className="flex flex-col items-center">
            <div className="mb-6 h-24 flex items-end">
              <img
                src={iconSatellite}
                alt="Ícone Satélite"
                className="h-20 w-auto object-contain hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Satélite</h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base px-4">
              Utilizamos imagens de satélite de alta resolução para
              monitoramento contínuo.
            </p>
          </div>

          {/* Card 3 - Sustentabilidade */}
          <div className="flex flex-col items-center">
            <div className="mb-6 h-24 flex items-end">
              <img
                src={iconSust}
                alt="Ícone Sustentabilidade"
                className="h-20 w-auto object-contain hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h3 className="text-2xl font-bold mb-4 text-gray-900">
              Sustentabilidade
            </h3>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base px-4">
              Promovemos a conservação ambiental e geramos valor econômico.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
