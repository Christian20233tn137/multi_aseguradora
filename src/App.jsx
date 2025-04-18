import React from "react";
import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/LoginComponents/Login";
import Layout from "./components/AdminViews/Layout";
import NotFound from "./components/Notfound";
import SolicitudSection from "./components/AdminViews/Views/SolicitudSection";
import ProtectedRoute from "./components/ProtectedRoute";
import NuevaAseguradora from "./components/AdminViews/Views/NuevaAseguradora";
import EditarPerfilAdmin from "./components/AdminViews/Views/EditarPerfilAdmin";
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
import Cotizaciones from "./components/AgenteViews/Views/Cotizaciones";
import Seguros from "./components/AgenteViews/Views/Seguros";
import RecuperarContra from "./components/RecuperarContra";
import Codigo from "./components/Codigo";
import NuevaContra from "./components/NuevaContra";
import InformacionPolizas from "./components/AgenteViews/Views/InformacionPolizas";
import EditarPerfil from "./components/AgenteViews/Views/EditarPerfil";
import Cotizar from "./components/AgenteViews/Views/Cotizar";
import InicioAgente from "./components/AgenteViews/Views/InicioAgente";
import Clientes from "./components/AgenteViews/Views/Clientes";
import Estadisticas from "./components/AgenteViews/Views/Estadisticas";
import CotizacionesPendientes from "./components/AgenteViews/Views/CotizacionesPendientes";
import SegurosCotizar from "./components/AgenteViews/Views/SegurosCotizar";
import DocumentRow from "./components/AdminViews/Views/DocumentRow";
import DocumentViewer from "./components/AdminViews/Views/DocumentViewer";
import AgenteInactivo from "./components/AgenteInactivoViews/Views/AgenteInactivo";
import LayoutAgenteInactivo from "./components/AgenteInactivoViews/LayoutAgenteInactivo";

const App = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/inicio":
        return "Inicio";
      case "/documentos":
        return "Documentos";
      case "/solicitudes":
        return "Solicitudes";
      case "/solicitudes/solicitud-section":
        return "Solicitud";
      case "/solicitudes/solicitud-documentos":
        return "Documentos de solicitud";
      case "/solicitudes/verDocumento/:id":
        return "Fila documentos";
      case "/aseguradoras":
        return "Aseguradoras";
      case "/aseguradoras/nuevaAseguradora":
        return "Agregar Aseguradora";
      case "/aseguradoras/editar":
        return "Aseguradoras";
      case "/aseguradoras/seguros":
        return "Aseguradoras";
      case "/aseguradoras/seguros/editar":
        return "Editar";
      case "/aseguradoras/seguros/informacion":
        return "Información";
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
      case "/archivosPostulante":
        return "Carga de Archivos";
      case "/inicioAgentes":
        return "Inicio";
      case "/inicioAgentes/emisiones":
        return "Emisión";
      case "/inicioAgentes/cotizaciones":
        return "Cotizaciones";
      case "/inicioAgentes/cotizar":
        return "Cotizar";
      case "/inicioAgentes/cotizar/informacion":
        return "Cotizar";
      case "/inicioAgentes/clientes":
        return "Clientes";
      case "/inicioAgentes/clientes/polizas":
        return "Pólizas";
      case "/inicioAgentes/clientes/polizas/informacion":
        return "Pólizas";
      case "/inicioAgentes/estadisticas":
        return "Estadísticas";
      case "/inicioAgentes/editarPerfil":
        return "Editar Perfil";
      case "/cotizar":
        return "Seguros";
      case "/cotizar/informacion":
        return "Seguros";
      case "/cotizar/informacion/cotizacion":
        return "Seguros";
      case "/cotizar/informacion/cotizacion/seguros":
        return "Seguros";
      case "/estadisticas":
        return "Estadísticas";
      case "/clientes":
        return "Clientes";
      case "/clientes/polizas/:id":
        return "Seguros";
        case "/agenteInactivo":
        return "Agente Inactivo";
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
          <ProtectedRoute allowedRoles={["postulante"]}>
            <LayoutPostulante title={getTitle()} />
          </ProtectedRoute>
        }
      />
      {/* Rutas protegidas con Layout */}
      <Route
        path="/inicio/*"
        element={
          <ProtectedRoute allowedRoles={["administrador"]}>
            <Layout title={getTitle()} />
          </ProtectedRoute>
        }
      >
        <Route path="EditarPerfilAdmin" element={<EditarPerfilAdmin />} />
      </Route>
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
        <Route path="verDocumento/:id/:type" element={<DocumentViewer />} />
      </Route>
      <Route
        path="/aseguradoras/*"
        element={
          <ProtectedRoute>
            <Layout title={getTitle()} />
          </ProtectedRoute>
        }
      >
        {/* Rutas hijas fuaaa*/}
        <Route path="nuevaAseguradora" element={<NuevaAseguradora />} />
        <Route path="editar" element={<EditarAseguradora />} />
        <Route path="seguros" element={<VerMasAseguradora />} />
        <Route path="seguros/editar/:id" element={<EditarSeguro />} />
        <Route
          path="seguros/informacion/:id"
          element={<InformacionSeguros />}
        />
        <Route path="seguros/agregar/:id" element={<AgregarSeguros />} />
      </Route>
      <Route
        path="/agentes/*"
        element={
          <ProtectedRoute>
            <Layout title={getTitle()} />
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
        <Route path="editar" element={<EditarAdmin />} />
        <Route path="informacion" element={<InformacionAdmin />} />
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
      {/* Rutas agente */}
      <Route
        path="/inicioAgentes"
        element={
          <ProtectedRoute allowedRoles={["agente"]}>
            <LayoutAgente title={getTitle()} />
          </ProtectedRoute>
        }
      >
        <Route index element={<InicioAgente />} />
        <Route path="editarPerfil" element={<EditarPerfil />} />
        <Route path="cotizaciones" element={<CotizacionesPendientes />} />
        <Route path="seguros" element={<SegurosCotizar />} />
        <Route path="cotizar" element={<Cotizar />} />
        <Route path="cotizar/informacion" element={<DatosCotizar />} />
        <Route
          path="cotizar/informacion/cotizacion"
          element={<Cotizaciones />}
        />

        <Route path="estadisticas" element={<Estadisticas />} />
        <Route path="emisiones" element={<Seguros />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="clientes/polizas" element={<Polizas />} />
        <Route
          path="clientes/polizas/informacion"
          element={<InformacionPolizas />}
        />
      </Route>

       {/* Ruta para agente inactivo */}
       <Route
        path="/agenteInactivo"
        element={
          <ProtectedRoute allowedRoles={["agente"]}>
            <LayoutAgenteInactivo title={getTitle()}/>
          </ProtectedRoute>
        }
      />

      {/* Ruta recuperar contra */}
      <Route path="recuperacion" element={<RecuperarContra />} />
      <Route path="/recuperacion/codigo" element={<Codigo />} />
      <Route
        path="/recuperacion/codigo/nuevaContra"
        element={<NuevaContra />}
      />
      {/* Ruta por defecto (404) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
