import {
  LayoutDashboard,
  Map,
  FileText,
  DollarSign,
  Settings,
  Leaf,
} from "lucide-react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Map, label: "Monitoramento", active: false },
    { icon: FileText, label: "Relatório", active: false },
    { icon: DollarSign, label: "Precificação", active: false },
    { icon: Settings, label: "Configuração", active: false },
  ];

  return (
    <aside className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-100 z-10 flex flex-col">
      {/* Logo */}
      <div className="p-8 flex items-center gap-2">
        <div className="bg-green-100 p-1 rounded-full">
          <Leaf className="w-6 h-6 text-green-600" />
        </div>
        <h1 className="text-xl font-bold text-gray-800">
          SECCO <span className="font-normal text-gray-500">GeoCarbo</span>
        </h1>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
              item.active
                ? "bg-white shadow-md text-green-700 font-medium border border-gray-50"
                : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
