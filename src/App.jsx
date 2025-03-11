import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/LoginComponents/Login";
import Layout from "./components/Layout";
import NotFound from "./components/NotFound";
import SolicitudSection from "./components/AdminViews/SolicitudSection";
import ProtectedRoute from "./components/ProtectedRoute";
import NuevaAseguradora from "./components/AdminViews/NuevaAseguradora";
import EditarAseguradora from "./components/AdminViews/EditarAseguradora";
import VerMasAseguradora from "./components/AdminViews/VerMasAseguradora";
import EditarAgente from "./components/AdminViews/EditarAgente";
import AgentesInfo from "./components/AdminViews/AgentesInfo";
import LayoutPostulante from "../src/components/PostulanteViews/LayoutPostulanet"

const App = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/inicio":
        return "Perfil";
      case "/documentos":
        return "Documentos";
      case "/solicitudes":
        return "Solicitudes";
      case "/solicitudes/solicitud-section":
        return "Solicitud";
      case "/solicitudes/solicitud-documentos":
        return "Documentos de solicitud";
      case "/aseguradoras":
        return "Aseguradoras";
      case "/aseguradoras/nuevaAseguradora":
        return "Aseguradoras";
      case "/aseguradoras/editar-Aseguradora":
        return "Aseguradoras";
      case "/aseguradoras/seguros":
        return "Aseguradoras";
      case "/agentes":
        return "Agentes";
      case "/agentes/editar":
        return "Agentes";
      case "/agentes/perfil":
        return "Perfil";
      case "/administradores":
        return "Administradores";
      case "/configurar-cuotas":
        return "Configurar Cuotas";
      {/* Rutas de postulante (ando calando apenas no confien en mi) */}
      case "/archivosPostulante":
        return "Carga de Archivos";
      default:
        return "Bienvenido al sistema";
    }
  };

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />

      {/* Rutas de postulante */}

      <Route
        path="/archivosPostulante/*"
        element={
          <ProtectedRoute>
            <LayoutPostulante title={getTitle()} />
          </ProtectedRoute>
        }
      />


      {/* Rutas protegidas con Layout */}
      <Route
        path="/inicio/*"
        element={
          <ProtectedRoute>
            <Layout title={getTitle()} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/documentos/*"
        element={
          <ProtectedRoute>
            <Layout title={getTitle()} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/solicitudes/*"
        element={
          <ProtectedRoute>
            <Layout title={getTitle()} />
          </ProtectedRoute>
        }
      >
        {/* Ruta hija dentro de solicitudes */}
        <Route path="solicitud-section" element={<SolicitudSection />} />
        <Route path="solicitud-documentos" element={<SolicitudSection />} />
      </Route>

      <Route
        path="/aseguradoras/*"
        element={
          <ProtectedRoute>
            <Layout title={getTitle()} />
          </ProtectedRoute>
        }
      >
        {/* Rutas hijas */}
        <Route path="nuevaAseguradora" element={<NuevaAseguradora />} />
        <Route path="editar-Aseguradora" element={<EditarAseguradora />} />
        <Route path="seguros" element={<VerMasAseguradora />} />
      </Route>

      <Route
        path="/agentes/*"
        element={
          <ProtectedRoute>
            <Layout title={getTitle(location.pathname)} />
          </ProtectedRoute>
        }
      >
        <Route path="editar" element={<EditarAgente />} />
        <Route path="perfil" element={<AgentesInfo />} />
      </Route>

      <Route
        path="/administradores/*"
        element={
          <ProtectedRoute>
            <Layout title={getTitle()} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/configurar-cuotas/*"
        element={
          <ProtectedRoute>
            <Layout title={getTitle()} />
          </ProtectedRoute>
        }
      />

      {/* Ruta por defecto (404) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
