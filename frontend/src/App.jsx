import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Páginas Públicas
import LoginPage from "./pages/Login.jsx";
import ForgotPassword from "./pages/Forgot-Password.jsx";
import Landing from "./pages/Landing";

// Layouts e Páginas do Dashboard
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/Dashboard/Home";
import NewProperty from "./pages/Dashboard/NewProperty"; // <--- 1. IMPORTANTE: Importe o arquivo aqui

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota inicial */}
        <Route path="/" element={<Landing />} />

        {/* Rotas de Autenticação */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Rota do Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Index = /dashboard */}
          <Route index element={<DashboardHome />} />

          {/* 2. NOVA ROTA ADICIONADA AQUI */}
          {/* A URL final será: /dashboard/propriedades/nova */}
          <Route path="propriedades/nova" element={<NewProperty />} />

          {/* Placeholders */}
          <Route
            path="monitoramento"
            element={<div className="p-8">🚧 Tela de Monitoramento em construção</div>}
          />
          <Route
            path="relatorio"
            element={<div className="p-8">🚧 Tela de Relatórios em construção</div>}
          />
          <Route
            path="configuracao"
            element={<div className="p-8">🚧 Tela de Configurações em construção</div>}
          />
        </Route>

        {/* Rota de Segurança (404) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;