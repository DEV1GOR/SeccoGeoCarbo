import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// 1. Importe o seu novo componente de Login que acabamos de ajustar
import LoginPage from "./pages/Login.jsx"; 
import MainLayout from "./components/Layout/MainLayout";
import Home from "./pages/Home";
import Landing from "./pages/Landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota inicial: Você pode escolher entre a Landing Page ou o Login */}
        {/* Se quiser que abra direto no login, use: <Navigate to="/login" replace /> */}
        <Route path="/" element={<Landing />} />

        {/* 2. Rota de Login: Onde está o seu novo design com fundo de deserto */}
        <Route path="/login" element={<LoginPage />} />

        {/* 3. Rotas Privadas (Dashboard): Acessadas via /app */}
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="map" element={<div>Mapa (Em breve)</div>} />
        </Route>

        {/* 4. Rota de Segurança (404): Redireciona qualquer link errado para o login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;