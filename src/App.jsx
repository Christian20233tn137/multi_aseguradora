// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./components/Home/home";
import Login from "./components/LoginComponents/login";
import InicioAdmin from "./components/AdminViews/InicioAdmin";
import MainContent from "./components/MainContent"; // Ahora MainContent maneja las rutas anidadas

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Rutas principales */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inicioAdmin" element={<InicioAdmin />} />

          {/* Rutas con layout y contenido principal */}
          <Route path="/inicio/*" element={<MainContent />} />
          <Route path="/datos/*" element={<MainContent />} />
          <Route path="/documentos/*" element={<MainContent activeSection="Inicio" />} />
          <Route path="/buscar/*" element={<MainContent />} />
          <Route path="/solicitudes/*" element={<MainContent />} />
          <Route path="/aseguradoras/*" element={<MainContent />} />
          <Route path="/agentes/*" element={<MainContent />} />
          <Route path="/configurar-cuotas/*" element={<MainContent />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
