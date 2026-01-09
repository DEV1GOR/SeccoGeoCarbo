import {
  TreeDeciduous,
  CloudRain,
  ArrowUpRight,
  Map as MapIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import MapComponent from "../../components/Dashboard/MapComponent";

/**
 * Card de Estatística 
 */
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

/**
 * Card de Fazenda (NOVO)
 * → Clicável
 * → Leva para /analysis/:id
 */
const FarmCard = ({ farm, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition"
  >
    <h3 className="text-lg font-semibold text-gray-800">
      {farm.name}
    </h3>

    <p className="text-sm text-gray-500 mt-1">
      Área Total: {farm.area} ha
    </p>

    <span className="inline-flex items-center mt-3 text-[11px] sm:text-xs font-medium bg-green-100 text-green-700 px-3 py-1 rounded-full whitespace-nowrap">
    ✔ Análise disponível
    </span>
  </div>
);

const DashboardHome = () => {
  const navigate = useNavigate();

  /**
   * MOCK DE FAZENDAS
   * Depois vira API
   */
  const farms = [
    {
      id: 1,
      name: "Fazenda Boa Esperança",
      area: 1200,
    },
  ];

  /**
   * Coordenadas de Exemplo (mapa)
   */
  const exemploFazenda = [
    [-23.5505, -46.6333],
    [-23.5555, -46.6333],
    [-23.5555, -46.64],
    [-23.5505, -46.64],
  ];

  return (
    <div className="space-y-8">
      {/* TÍTULO */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Visão Geral
        </h1>
        <p className="text-gray-500">
          Monitoramento de Carbono na Caatinga
        </p>
      </div>

      {/* CARDS DE ESTATÍSTICAS */}
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

      {/* LISTA DE FAZENDAS (PARTE MAIS IMPORTANTE DA TASK) */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Fazendas Monitoradas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {farms.map((farm) => (
            <FarmCard
              key={farm.id}
              farm={farm}
              onClick={() => navigate(`/analysis/${farm.id}`)}
            />
          ))}
        </div>
      </div>

      {/* MAPA */}
      <div className="bg-white p-2 rounded-xl border border-gray-100 h-96 shadow-sm relative z-0">
        <MapComponent
          coords={exemploFazenda}
          farmName="Fazenda Boa Esperança"
        />
      </div>
    </div>
  );
};

export default DashboardHome;