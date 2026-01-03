import { useState, useMemo } from "react";
import { Download, PlusCircle } from "lucide-react";

/**
 * MOCK DE DADOS
 * (substituível por API depois)
 */
const reportsMock = [
  {
    id: 1,
    propertyName: "Fazenda Boa Esperança",
    referenceDate: "2025-01-01",
    status: "Concluído",
    fileUrl: "/mock/relatorio-1.pdf",
  },
  {
    id: 2,
    propertyName: "Sítio Verde Vale",
    referenceDate: "2025-01-10",
    status: "Processando",
    fileUrl: null,
  },
  {
    id: 3,
    propertyName: "Fazenda São José",
    referenceDate: "2025-02-01",
    status: "Concluído",
    fileUrl: "/mock/relatorio-2.pdf",
  },
];

export default function Reports() {
  const [nameFilter, setNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  /**
   * FILTROS (nome + data)
   */
  const filteredReports = useMemo(() => {
    return reportsMock.filter((report) => {
      const matchesName = report.propertyName
        .toLowerCase()
        .includes(nameFilter.toLowerCase());

      const matchesDate = dateFilter
        ? report.referenceDate === dateFilter
        : true;

      return matchesName && matchesDate;
    });
  }, [nameFilter, dateFilter]);

  /**
   * DOWNLOAD FAKE (DoD)
   */
  const handleDownload = (fileUrl) => {
    if (!fileUrl) return;

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = "relatorio.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">
          Relatórios
        </h1>

        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
          <PlusCircle size={18} />
          Gerar Novo Relatório
        </button>
      </div>

      {/* FILTROS */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Filtrar por nome da propriedade"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
          className="w-full md:w-1/3 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full md:w-1/4 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* TABELA */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Nome da Propriedade
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Data de Referência
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                Ação
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredReports.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  className="text-center py-6 text-gray-500"
                >
                  Nenhum relatório encontrado.
                </td>
              </tr>
            ) : (
              filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {report.propertyName}
                  </td>

                  <td className="px-4 py-3">
                    {new Date(report.referenceDate).toLocaleDateString("pt-BR")}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium
                        ${
                          report.status === "Concluído"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {report.status}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDownload(report.fileUrl)}
                      disabled={report.status !== "Concluído"}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition
                        ${
                          report.status === "Concluído"
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}