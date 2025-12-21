import logo from '../../assets/SECCO-LOGO.png';

const Navbar = () => {
  return (
    // 'absolute top-0' cola a barra no topo da tela
    // 'bg-white' cria a faixa branca que você marcou
    <nav className="absolute top-0 left-0 w-full bg-white py-3 pl-0 pr-4 sm:pl-8 shadow-sm z-10">
      <div className="w-full flex items-center gap-2 min-w-0">
        {/* Logo responsivo: alturas em breakpoints diferentes */}
        <img src={logo} alt="Logo" className="h-8 sm:h-10 md:h-12 w-auto flex-shrink-0" />

        {/* Texto responsivo: tamanhos diferentes e truncamento se necessário */}
        <span className="font-bold text-green-900 text-sm sm:text-base md:text-lg uppercase tracking-wider truncate">
          <strong>SECCO</strong> GeoCarbo
        </span>
      </div>
    </nav>
  );
};

export default Navbar;