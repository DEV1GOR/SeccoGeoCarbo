import logo from '../../assets/NovaLogoGeoCarbo.png';

const Navbar = () => {
  return (
    // 'absolute top-0' cola a barra no topo da tela
    // 'bg-white' cria a faixa branca que você marcou
    <nav className="absolute top-0 left-0 w-full bg-white py-3 pl-0 pr-4 sm:pl-8 shadow-sm z-10">
      <div className="w-full flex items-center gap-2 min-w-0">
        {/* Logo responsivo: alturas em breakpoints diferentes */}
        <img src={logo} alt="Logo" className="h-8 sm:h-10 md:h-12 w-auto flex-shrink-0" />


      </div>
    </nav>
  );
};

export default Navbar;