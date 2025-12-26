import { Bell, User } from "lucide-react";

const Header = () => {
  return (
    <header className="h-20 bg-[#FDFBF7] flex items-center justify-between px-8 ml-64">
      <h2 className="text-gray-500">Dashboard</h2>

      <div className="flex items-center gap-4">
        {/* Notificação com bolinha vermelha */}
        <div className="relative cursor-pointer bg-white p-2 rounded-full shadow-sm">
          <Bell className="w-5 h-5 text-gray-600" />
          <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
        </div>

        {/* Perfil */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src="https://github.com/shadcn.png" alt="User" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
