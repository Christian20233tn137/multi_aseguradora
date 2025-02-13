import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./components/Home/home";
import Login from "./components/LoginComponents/login";
import InicioAdmin from "./components/AdminViews/InicioAdmin";
import Layout from "./components/Layout"; // Asegúrate de tener Layout importado

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas principales */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inicioAdmin" element={<InicioAdmin />} />

        {/* Rutas con Layout */}
        <Route path="/inicio/*" element={<Layout activeSection="Inicio" />} />
        <Route path="/datos/*" element={<Layout activeSection="Datos" />} />
        <Route path="/documentos/*" element={<Layout activeSection="Documentos" />} />
        <Route path="/buscar/*" element={<Layout activeSection="Buscar" />} />
        <Route path="/solicitudes/*" element={<Layout activeSection="Solicitudes" />} />
        <Route path="/solicitudes/solicitud-documentos" element={<Layout activeSection="SolicitudDocumentos" />} />
        <Route path="/aseguradoras/*" element={<Layout activeSection="Aseguradoras" />} />
        <Route path="/agentes/*" element={<Layout activeSection="Agentes" />} />
        <Route path="/configurar-cuotas/*" element={<Layout activeSection="Configurar Cuotas" />} />
      </Routes>
    </Router>
  );
}

export default App;
