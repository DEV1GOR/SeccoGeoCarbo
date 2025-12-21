import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import Home from "./pages/Home";
import Landing from "./pages/Landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota Pública - Landing Page */}
        <Route path="/" element={<Landing />} />

        {/* Rotas Privadas - Aplicação (Dashboard) */}
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="map" element={<div>Mapa (Em breve)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
