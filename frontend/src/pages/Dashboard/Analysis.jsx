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
  const { id } = useParams(); // id da fazenda (mock). VAI SER USADO COM A API, NÃO TEM ERRO. SÓ NÃO TÁ SENDO UTILIZADO NO MOMENTO ( ANTES DA API )

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/mock/relatorio-analise.pdf";
    link.download = "relatorio-analise.pdf";
    link.click();
  };

  return (
    <div className="p-8">
      {/* CABEÇALHO */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {analysisMock.farmName}
          </h1>
          <p className="text-sm text-gray-500">
            Área Total: {analysisMock.totalArea} ha •
            Data da Análise:{" "}
            {new Date(analysisMock.analysisDate).toLocaleDateString("pt-BR")}
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          <Download size={18} />
          Baixar Relatório
        </button>
      </div>

      {/* GRID DE GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PIZZA — USO DO SOLO */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-medium mb-4">
            Uso do Solo
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analysisMock.landUse}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={5}
              >
                {analysisMock.landUse.map((_, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BARRA — ESTOQUE DE CARBONO */}
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-lg font-medium mb-4">
            Estoque de Carbono (t CO₂e)
          </h2>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analysisMock.carbonStock}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#16a34a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}