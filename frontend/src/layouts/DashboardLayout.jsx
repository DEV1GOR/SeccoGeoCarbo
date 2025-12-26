import { Outlet } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Dashboard/Header";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Barra Lateral Fixa */}
      <Sidebar />

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col">
        {/* Barra de Topo */}
        <Header />

        {/* Aqui é onde as páginas vão mudar (O Buraco Mágico) */}
        <main className="flex-1 p-6 ml-64 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// ESSA LINHA É A MAIS IMPORTANTE PARA O ERRO SUMIR:
export default DashboardLayout;
