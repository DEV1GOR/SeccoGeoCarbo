import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import {
  TreePine,
  MapPin,
  Leaf,
  AlertCircle,
  CheckCircle,
  Brain,
} from "lucide-react";

const dataLine = [
  { name: "Jan", value: 400 },
  { name: "Fev", value: 300 },
  { name: "Mar", value: 600 },
  { name: "Abr", value: 800 },
  { name: "Mai", value: 500 },
  { name: "Jun", value: 900 },
  { name: "Jul", value: 1000 },
];

const dataBar = [
  { name: "VGB", value: 1200 },
  { name: "TFF", value: 900 },
  { name: "BCC", value: 1600 },
  { name: "VIM", value: 600 },
  { name: "MOU", value: 400 },
];

const DashboardHome = () => {
  return (
    <div className="p-6 bg-[#FDFBF7] min-h-screen space-y-6">
      {/* 1. Área do Mapa (Topo) */}
      <div className="w-full h-64 bg-gray-200 rounded-3xl overflow-hidden relative shadow-sm group">
        <img
          src="https://mt1.google.com/vt/lyrs=s&x=1&y=1&z=1"
          alt="Mapa de Satélite"
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-4 left-4 bg-white/90 p-2 rounded-lg shadow-lg">
          <div className="font-bold text-xs text-gray-600 mb-1">CONTROLES</div>
          <div className="space-y-1">
            <div className="w-6 h-6 bg-gray-100 rounded text-center leading-6 cursor-pointer hover:bg-gray-200">
              +
            </div>
            <div className="w-6 h-6 bg-gray-100 rounded text-center leading-6 cursor-pointer hover:bg-gray-200">
              -
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded">
          Google Maps Satélite
        </div>
      </div>

      {/* 2. Cards de Estatísticas (Meio) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-full text-green-600">
            <TreePine size={32} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">
              Estoque de Carbono
            </p>
            <h3 className="text-2xl font-bold text-green-700">1.2 Milhões</h3>
            <span className="text-xs text-gray-400">ton CO2e</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-full text-orange-600">
            <MapPin size={32} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Área Monitorada</p>
            <h3 className="text-2xl font-bold text-gray-800">85.000</h3>
            <span className="text-xs text-gray-400">Hectares</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-teal-100 rounded-full text-teal-600">
            <Leaf size={32} />
          </div>
          <div>
            <p className="text-gray-500 text-sm font-medium">Sequestro Anual</p>
            <h3 className="text-2xl font-bold text-teal-700">500.000</h3>
            <span className="text-xs text-gray-400">ton CO2e</span>
          </div>
        </div>
      </div>

      {/* 3. Área de Gráficos e Status (Fundo) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-80">
        {/* Gráfico de Linha */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">
            Tendência de Sequestro (12 meses)
          </h4>
          <ResponsiveContainer width="100%" height="80%">
            <LineChart data={dataLine}>
              <XAxis dataKey="name" hide />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Barras */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h4 className="text-sm font-semibold text-gray-700 mb-4">
            Distribuição por Vegetação
          </h4>
          <ResponsiveContainer width="100%" height="80%">
            <BarChart data={dataBar}>
              <Tooltip cursor={{ fill: "transparent" }} />
              <Bar dataKey="value" fill="#3F6212" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Lista de Status (Direita) */}
        <div className="flex flex-col gap-4">
          {/* Status Itens */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-3">
            <AlertCircle className="text-orange-400 w-5 h-5 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-800">
                Alerta: Desmatamento zona 4
              </p>
              <span className="text-xs text-gray-400">
                Detectado há 2 horas
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-3">
            <CheckCircle className="text-blue-500 w-5 h-5 mt-1" />
            <div>
              <p className="text-sm font-medium text-gray-800">
                Processamento de Satélite
              </p>
              <span className="text-xs text-green-600 font-bold">
                Concluído
              </span>
            </div>
          </div>

          {/* Card IA (Destaque) */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-2xl shadow-lg text-white flex items-center gap-3 mt-auto">
            <div className="bg-white/20 p-2 rounded-lg animate-pulse">
              <Brain className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <p className="text-sm font-bold">Processamento de IA</p>
              <p className="text-xs text-gray-300">Analisando novos dados...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
