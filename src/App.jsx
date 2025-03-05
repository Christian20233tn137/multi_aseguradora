import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/LoginComponents/Login";
import Layout from "./components/Layout";
import NotFound from "./components/NotFound";
import SolicitudSection from "./components/AdminViews/SolicitudSection";
import ProtectedRoute from "./components/ProtectedRoute";

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
      case "/agentes":
        return "Agentes";
      case "/administradores":
        return "Administradores";
      case "/configurar-cuotas":
        return "Configurar Cuotas";
      default:
        return "Bienvenido al sistema";
    }
  };

  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Home />} />

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
        <Route path="solicitud-documentos" element={<SolicitudSection/>}/>
      </Route>

      <Route
        path="/aseguradoras/*"
        element={
          <ProtectedRoute>
            <Layout title={getTitle()} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/agentes/*"
        element={
          <ProtectedRoute>
            <Layout title={getTitle()} />
          </ProtectedRoute>
        }
      />

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
