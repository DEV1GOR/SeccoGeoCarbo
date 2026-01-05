import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Páginas Públicas
import LoginPage from "./pages/Login.jsx";
import ForgotPassword from "./pages/Forgot-Password.jsx";
import Landing from "./pages/Landing";

// Layout
import DashboardLayout from "./layouts/DashboardLayout";

// Dashboard Pages
import DashboardHome from "./pages/Dashboard/Home";
import NewProperty from "./pages/Dashboard/NewProperty";
import Reports from "./pages/Dashboard/Reports";
import Analysis from "./pages/Dashboard/Analysis";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Página pública */}
        <Route path="/" element={<Landing />} />

        {/* Autenticação */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* /dashboard */}
          <Route index element={<DashboardHome />} />

          {/* Propriedades */}
          <Route path="propriedades/nova" element={<NewProperty />} />

          {/* Monitoramento (visão geral) */}
          <Route path="monitoramento" element={<Analysis />} />

          {/* Detalhes da Análise (por fazenda) */}
          <Route path="analysis/:id" element={<Analysis />} />

          {/* Relatórios */}
          <Route path="relatorio" element={<Reports />} />

          {/* Configurações */}
          <Route
            path="configuracao"
            element={<div className="p-8">🚧 Tela de Configurações em construção</div>}
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
