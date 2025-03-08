import React from "react";
import { useLocation } from "react-router-dom";
import ProfileSection from "./AdminViews/ProfileSection";
import SolicitudSection from "./AdminViews/SolicitudSection";
import InicioSolicitudes from "./AdminViews/InicioSolicitudes";
import SolicitudDocs from "./AdminViews/SolicitudDocumentos";
import InicioAseguradoras from "./AdminViews/InicioAseguradoras";
import InicioAgentes from "./AdminViews/InicioAgentes";
import InicioAdmin from "./AdminViews/InicioAdmin";
import Notfound from "./NotFound";
import NuevaAseguradora from "./AdminViews/NuevaAseguradora";
import EditarAseguradora from "./AdminViews/EditarAseguradora";
import VerMasAseguradora from "./AdminViews/VerMasAseguradora";
import EditarAgente from "./AdminViews/EditarAgente";
import AgentesInfo from "./AdminViews/AgentesInfo";

const MainContent = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/inicio":
        return "Perfil";
      case "/solicitudes":
        return "Solicitudes";
      case "/solicitudes/solicitud-section":
        return "Solicitud";
      case "/solicitudes/solicitud-documentos":
        return "Solicitud Documentos";
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
        return "Agentes";
      case "/administradores":
        return "Administradores";
      case "/configurar-cuotas":
        return "Configurar Cuotas";
      default:
        return "Bienvenido al sistema";
    }
  };

  const renderContent = () => {
    switch (location.pathname) {
      case "/inicio":
        return <ProfileSection />;
      case "/solicitudes":
        return <InicioSolicitudes />;
      case "/solicitudes/solicitud-section":
        return <SolicitudSection />;
      case "/solicitudes/solicitud-documentos":
        return <SolicitudDocs />;
      case "/aseguradoras":
        return <InicioAseguradoras />;
      case "/aseguradoras/nuevaAseguradora":
        return <NuevaAseguradora />;
      case "/aseguradoras/editar-Aseguradora":
        return <EditarAseguradora />;
      case "/aseguradoras/seguros":
        return <VerMasAseguradora />;
      case "/agentes":
        return <InicioAgentes />;
      case "/agentes/editar":
        return <EditarAgente />;
      case "/agentes/perfil":
        return <AgentesInfo />;
      case "/administradores":
        return <InicioAdmin />;
      case "/configurar-cuotas":
        return <div>Contenido de las Cuotas</div>;
      default:
        return <Notfound />;
    }
  };

  return <div className="flex-1 p-4 overflow-y-auto">{renderContent()}</div>;
};

export default MainContent;
