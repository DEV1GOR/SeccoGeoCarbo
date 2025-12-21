import { Link } from "react-router-dom";
import { LayoutDashboard, Map, FileText, Settings, Leaf } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <Leaf className="text-geo-green mr-2" size={24} />
        <span className="font-bold text-xl text-gray-800">
          Secco<span className="text-geo-green">GeoCarbo</span>
        </span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/app"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50"
        >
          <LayoutDashboard size={20} /> <span>Início</span>
        </Link>
        <Link
          to="/app/map"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50"
        >
          <Map size={20} /> <span>Mapa</span>
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
