import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Páginas Públicas
import LoginPage from "./pages/Login.jsx";
import ForgotPassword from "./pages/Forgot-Password.jsx";
import Landing from "./pages/Landing";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardHome from "./pages/Dashboard/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota inicial */}
        <Route path="/" element={<Landing />} />

        {/* Rotas de Autenticação */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* 2. Rota do Dashboard (Nova Estrutura) */}
        {/* Mudei de /app para /dashboard para ficar mais semântico */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* O index é a tela Home com os gráficos que criamos */}
          <Route index element={<DashboardHome />} />

          {/* Placeholders para os outros botões do Sidebar não darem erro 404 */}
          <Route
            path="monitoramento"
            element={
              <div className="p-8">🚧 Tela de Monitoramento em construção</div>
            }
          />
          <Route
            path="relatorio"
            element={
              <div className="p-8">🚧 Tela de Relatórios em construção</div>
            }
          />
          <Route
            path="configuracao"
            element={
              <div className="p-8">🚧 Tela de Configurações em construção</div>
            }
          />
        </Route>

        {/* Rota de Segurança (404) */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
