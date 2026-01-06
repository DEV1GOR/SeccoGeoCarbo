import { Map, TreeDeciduous, CloudRain, ArrowUpRight } from "lucide-react";

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

const Home = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Visão Geral</h1>
        <p className="text-gray-500">Monitoramento de Carbono na Caatinga</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Estoque Total"
          value="1,240 tC"
          icon={TreeDeciduous}
          color="bg-geo-green"
        />
        <StatCard
          title="Área Monitorada"
          value="850 ha"
          icon={Map}
          color="bg-blue-600"
        />
        <StatCard
          title="Precipitação"
          value="45 mm"
          icon={CloudRain}
          color="bg-cyan-500"
        />
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-100 h-64 flex items-center justify-center text-gray-400">
        Área reservada para gráficos
      </div>
    </div>
  );
};

export default Home;
