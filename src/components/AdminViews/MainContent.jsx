import React from "react";
import { useLocation } from "react-router-dom";
import ProfileSection from "./Views/ProfileSection";
import InicioSolicitudes from "./Views/InicioSolicitudes";
import SolicitudSection from "./Views/SolicitudSection";
import SolicitudDocumentos from "./Views/SolicitudDocumentos";
import InicioAseguradoras from "./Views/InicioAseguradoras";
import NuevaAseguradora from "./Views/NuevaAseguradora";
import EditarAseguradora from "./Views/EditarAseguradora";
import VerMasAseguradora from "./Views/VerMasAseguradora";
import InicioAgentes from "./Views/InicioAgentes";
import EditarAgente from "./Views/EditarAgente";
import InicioAdmin from "./Views/InicioAdmin";
import AgentesInfo from "./Views/AgentesInfo";
import Notfound from "../Notfound";
import EditarSeguro from "./Views/EditarSeguro";
import InformacionSeguros from "./Views/InformacionSeguros";
import AgregarSeguros from "./Views/AgregarSeguros";

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
        return <SolicitudDocumentos />;
      case "/aseguradoras":
        return <InicioAseguradoras />;
      case "/aseguradoras/nuevaAseguradora":
        return <NuevaAseguradora />;
      case "/aseguradoras/editar-Aseguradora":
        return <EditarAseguradora />;
      case "/aseguradoras/seguros":
        return <VerMasAseguradora />;
      case "/aseguradoras/seguros/editar":
        return <EditarSeguro />;
      case "/aseguradoras/seguros/informacion":
        return <InformacionSeguros/>;
      case "/aseguradoras/seguros/agregar":
        return <AgregarSeguros/>;
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
