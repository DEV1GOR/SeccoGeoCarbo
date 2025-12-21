import heroBg from "../../assets/hero-bg-landing.jpg";

const Hero = () => {
  return (
    <header className="relative h-screen min-h-[600px] flex flex-col justify-center">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Caatinga Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/80"></div>
      </div>

      {/* Conteúdo */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 mt-10">
        <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight drop-shadow-lg">
          Monitoramento e precificação de <br />
          <span className="text-[#10B981]">Estoque de Carbono</span> na Caatinga
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-200 font-medium max-w-3xl drop-shadow-md">
          Tecnologia de IA e Sensoriamento para Medição Precisa <br />
          de Captura de Carbono
        </p>

        <button className="mt-10 bg-[#10B981] hover:bg-green-600 text-white px-10 py-3 rounded-full font-bold text-lg shadow-xl transition transform hover:scale-105">
          Comece Agora
        </button>
      </div>
    </header>
  );
};

export default Hero;
