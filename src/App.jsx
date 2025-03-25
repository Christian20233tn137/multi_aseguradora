import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/LoginComponents/Login";
import Layout from "./components/AdminViews/Layout";
import NotFound from "./components/Notfound";
import SolicitudSection from "./components/AdminViews/Views/SolicitudSection";
import ProtectedRoute from "./components/ProtectedRoute";
import NuevaAseguradora from "./components/AdminViews/Views/NuevaAseguradora";
import EditarAseguradora from "./components/AdminViews/Views/EditarAseguradora";
import VerMasAseguradora from "./components/AdminViews/Views/VerMasAseguradora";
import EditarAgente from "./components/AdminViews/Views/EditarAgente";
import AgentesInfo from "./components/AdminViews/Views/AgentesInfo";
import LayoutPostulante from "../src/components/PostulanteViews/LayoutPostulanet";
import LayoutAgente from "../src/components/AgenteViews/LayoutAgente";
import EditarSeguro from "./components/AdminViews/Views/EditarSeguro";
import InformacionSeguros from "./components/AdminViews/Views/InformacionSeguros";
import AgregarSeguros from "./components/AdminViews/Views/AgregarSeguros";
import InformacionAdmin from "./components/AdminViews/Views/InformacionAdmin";
import EditarAdmin from "./components/AdminViews/Views/EditarAdmin";
import AgregarAdmin from "./components/AdminViews/Views/AgregarAdmin";
import DatosCotizar from "./components/AgenteViews/Views/DatosCotizar";
import Polizas from "./components/AgenteViews/Views/Polizas";

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
      case "/aseguradoras/seguros/editar":
        return "Editar Seguro";
      case "/aseguradoras/seguros/informacion":
        return "Información de Seguro";
      case "/aseguradoras/seguros/agregar":
        return "Agregar Seguro";
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
        {
          /* Rutas de postulante (ando calando apenas no confien en mi) */
        }
      case "/archivosPostulante":
        return "Carga de Archivos";
        {
          /* Rutas de agente (ando calando apenas no confien en mi) */
        }
      case "/inicioAgente":
        return "Inicio";
      case "/cotizar":
        return "Seguros";
      case "/estadisticas":
        return "Estadisticas";
      case "/clientes":
        return "Clientes";
      case "/clientes/polizas":
        return "Seguros";
      default:
        return "Administradores";
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
        <Route path="seguros/editar" element={<EditarSeguro />} />
        <Route path="seguros/informacion" element={<InformacionSeguros />} />
        <Route path="seguros/agregar" element={<AgregarSeguros />} />
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
      >
        <Route path="informacion" element={<InformacionAdmin />} />
        <Route path="editar" element={<EditarAdmin />} />
        <Route path="agregar" element={<AgregarAdmin />} />
      </Route>

      <Route
        path="/configurar-cuotas/*"
        element={
          <ProtectedRoute>
            <Layout title={getTitle()} />
          </ProtectedRoute>
        }
      />

      {/* Rutas de agentes */}
      <Route
        path="/inicioAgentes/*"
        element={
          <ProtectedRoute>
            <LayoutAgente title={getTitle()} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/cotizar/*"
        element={
          <ProtectedRoute>
            <LayoutAgente title={getTitle()} />
          </ProtectedRoute>
        }
      >
        <Route path="informacion" element={<DatosCotizar />} />
      </Route>

      <Route
        path="/estadisticas/*"
        element={
          <ProtectedRoute>
            <LayoutAgente title={getTitle()} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clientes/*"
        element={
          <ProtectedRoute>
            <LayoutAgente title={getTitle()} />
          </ProtectedRoute>
        }
      >
        <Route path="polizas" element={<Polizas />} />
      </Route>

      {/* Ruta por defecto (404) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
