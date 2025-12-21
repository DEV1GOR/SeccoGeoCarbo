console.log("LOGIN JSX CARREGADO");


import Navbar from '../components/Login/Navbar.jsx';
import LoginForm from '../components/Login/MainLogin'; 
import bgLogin from '../assets/photo-login.png';

const LoginPage = () => {
  return (
    <div 
      // 'relative' permite que o Navbar absolute se posicione corretamente
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      // Note as crases (backticks) abaixo:
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      <Navbar /> 
      <LoginForm /> 
    </div>
  );
};

export default LoginPage;