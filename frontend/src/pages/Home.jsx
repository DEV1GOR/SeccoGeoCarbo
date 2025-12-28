import {
  TreeDeciduous,
  CloudRain,
  ArrowUpRight,
  Map as MapIcon,
} from "lucide-react";
import MapComponent from "../../components/Dashboard/MapComponent";

// Pequeno componente para os Cards (Fica no mesmo arquivo para facilitar)
const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="text-2xl font-bold mt-2 text-gray-800">{value}</h3>
      </div>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
    </div>
    <div className="mt-4 flex items-center text-sm text-green-600">
      <ArrowUpRight size={16} className="mr-1" />
      <span className="font-medium">+12.5%</span>
      <span className="text-gray-400 ml-1">vs mês anterior</span>
    </div>
  </div>
);

const DashboardHome = () => {
  // Coordenadas de Exemplo (Um quadrado em São Paulo para teste)
  const exemploFazenda = [
    [-23.5505, -46.6333],
    [-23.5555, -46.6333],
    [-23.5555, -46.64],
    [-23.5505, -46.64],
  ];

  return (
    <div className="space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Visão Geral</h1>
        <p className="text-gray-500">Monitoramento de Carbono na Caatinga</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Estoque Total"
          value="1,240 tC"
          icon={TreeDeciduous}
          color="bg-green-600"
        />
        <StatCard
          title="Área Monitorada"
          value="850 ha"
          icon={MapIcon}
          color="bg-blue-600"
        />
        <StatCard
          title="Precipitação"
          value="45 mm"
          icon={CloudRain}
          color="bg-cyan-500"
        />
      </div>

      {/* ÁREA DO MAPA (Aqui está a mudança!) */}
      <div className="bg-white p-2 rounded-xl border border-gray-100 h-96 shadow-sm relative z-0">
        {/* Chama o componente do mapa que criamos */}
        <MapComponent coords={exemploFazenda} farmName="Fazenda Modelo" />
      </div>
    </div>
  );
};

export default DashboardHome;
