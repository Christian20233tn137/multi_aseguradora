import React from "react";
import { useLocation, useParams } from "react-router-dom";
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
import ConfigurarCuotas from "./Views/ConfigurarCuotas";
import InformacionAdmin from "./Views/InformacionAdmin";
import EditarAdmin from "./Views/EditarAdmin";
import AgregarAgente from "./Views/AgregarAdmin";
import EditarPerfilAdmin from "./Views/EditarPerfilAdmin";

const MainContent = () => {
  const location = useLocation();
  const params = useParams();

  const renderContent = () => {
    // Extraer la ruta base sin parámetros
    const basePath = location.pathname.split("/").slice(0, -1).join("/");

    // Para rutas con parámetros dinámicos
    if (location.pathname.includes("/aseguradoras/editar/")) {
      return <EditarAseguradora />;
    }

    // Para rutas estáticas
    switch (location.pathname) {
      case "/inicio":
        return <ProfileSection />;
      case "/inicio/EditarPerfilAdmin":
        return <EditarPerfilAdmin />;
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
      case "/aseguradoras/seguros":
        return <VerMasAseguradora />;
      case "/aseguradoras/seguros/editar":
        return <EditarSeguro />;
      case "/aseguradoras/seguros/informacion":
        return <InformacionSeguros />;
      case "/aseguradoras/seguros/agregar":
        return <AgregarSeguros />;
      case "/agentes":
        return <InicioAgentes />;
      case "/agentes/editar":
        return <EditarAgente />;
      case "/agentes/perfil":
        return <AgentesInfo />;
      case "/administradores":
        return <InicioAdmin />;
      case "/administradores/informacion":
        return <InformacionAdmin />;
      case "/administradores/editar":
        return <EditarAdmin />;
      case "/administradores/agregar":
        return <AgregarAgente />;
      case "/configurar-cuotas":
        return <ConfigurarCuotas />;
      default:
        return <Notfound />;
    }
  };

  return <div className="flex-1 p-4 overflow-y-auto">{renderContent()}</div>;
};

export default MainContent;
