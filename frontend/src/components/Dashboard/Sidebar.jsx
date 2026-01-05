import {
  LayoutDashboard,
  Map,
  FileText,
  DollarSign,
  Settings,
  Leaf,
  PlusCircle // Novo ícone para o botão de cadastro
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation(); // Hook para saber em qual URL estamos

const menuItems = [
    // Rota principal (Dashboard)
    { 
      icon: LayoutDashboard, 
      label: "Dashboard", 
      path: "/dashboard" 
    },
    // CORREÇÃO AQUI: Adicionado o prefixo /dashboard
    { 
      icon: PlusCircle, 
      label: "Nova Propriedade", 
      path: "/dashboard/propriedades/nova" 
    }, 
    // Para os outros botões não quebrarem futuramente, também precisam do prefixo:
    { 
      icon: Map, 
      label: "Monitoramento", 
      path: "/dashboard/monitoramento" 
    },
    { 
      icon: FileText, 
      label: "Relatório", 
      path: "/dashboard/relatorio" 
    },
    { 
      icon: DollarSign, 
      label: "Precificação", 
      path: "/dashboard/precificacao" 
    },
    { 
      icon: Settings, 
      label: "Configuração", 
      path: "/dashboard/configuracao" 
    },
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
        {menuItems.map((item, index) => {
          // Verifica se a rota atual é igual ao path do item para ativar o estilo
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                isActive
                  ? "bg-white shadow-md text-green-700 font-medium border border-gray-50"
                  : "text-gray-500 hover:bg-gray-50 hover:text-green-600"
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;