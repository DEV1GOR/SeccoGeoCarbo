import { useParams } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Download } from "lucide-react";

/**
 * MOCK DE DADOS (simulando API)
 */
const analysisMock = {
  farmName: "Fazenda Boa Esperança",
  totalArea: 1200,
  analysisDate: "2025-01-15",

  landUse: [
    { name: "Área Preservada", value: 780 },
    { name: "Área Antropizada", value: 420 },
  ],

  carbonStock: [
    { name: "Fazenda", value: 1250 },
    { name: "Média Regional", value: 980 },
  ],
};

const COLORS = ["#16a34a", "#dc2626"];

export default function Analysis() {
  const { id } = useParams(); // será usado quando integrar API

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/mock/relatorio-analise.pdf";
    link.download = "relatorio-analise.pdf";
    link.click();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* CABEÇALHO */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {analysisMock.farmName}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Área Total: {analysisMock.totalArea} ha •{" "}
            {new Date(analysisMock.analysisDate).toLocaleDateString("pt-BR")}
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition shadow"
        >
          <Download size={18} />
          Baixar Relatório
        </button>
      </div>

      {/* GRID DE GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* CARD — USO DO SOLO */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Uso do Solo
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={analysisMock.landUse}
                dataKey="value"
                nameKey="name"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={4}
              >
                {analysisMock.landUse.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          {/* LEGENDA CUSTOM */}
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <span className="flex items-center gap-2 text-gray-600">
              <span className="w-3 h-3 bg-green-600 rounded-full"></span>
              Área Preservada
            </span>
            <span className="flex items-center gap-2 text-gray-600">
              <span className="w-3 h-3 bg-red-600 rounded-full"></span>
              Área Antropizada
            </span>
          </div>
        </div>

        {/* CARD — ESTOQUE DE CARBONO */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Estoque de Carbono (t CO₂e)
          </h2>

          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={analysisMock.carbonStock}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="value"
                fill="#16a34a"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>

          <p className="text-sm text-gray-500 mt-4">
            Comparação entre o estoque de carbono da fazenda e a média regional.
          </p>
        </div>
      </div>
    </div>
  );
}
