import { Outlet } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Dashboard/Header";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar fixa */}
      <Sidebar />

      {/* Conteúdo deslocado pela sidebar */}
      <div className="min-h-screen md:pl-64 flex flex-col">
        <Header />

        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
