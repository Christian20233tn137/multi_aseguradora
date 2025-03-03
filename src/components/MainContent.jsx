import React from "react";
import { useLocation } from "react-router-dom";
import ProfileSection from "./AdminViews/ProfileSection";
import SolicitudSection from "./AdminViews/SolicitudSection";
import InicioSolicitudes from "./AdminViews/InicioSolicitudes";
import InicioAseguradoras from "./AdminViews/InicioAseguradoras";
import InicioAgentes from "./AdminViews/InicioAgentes";
import InicioAdmin from "./AdminViews/InicioAdmin";

const MainContent = () => {
  const location = useLocation();

  const renderContent = () => {
    if (location.pathname === "/inicio") {
      return <ProfileSection />;
    }
    if (location.pathname === "/datos") {
      return <div>Contenido de Datos</div>;
    }
    if (location.pathname === "/documentos") {
      return <div>Contenido de Documentos</div>;
    }
    if (location.pathname === "/solicitudes") {
      return <InicioSolicitudes />;
    }
    if (location.pathname === "/solicitudes/solicitud-documentos") {
      return <SolicitudSection />;
    }
    if (location.pathname === "/aseguradoras") {
      return <InicioAseguradoras />;
    }
    if (location.pathname === "/agentes") {
      return <InicioAgentes />;
    }
    if (location.pathname === "/administradores") {
      return <InicioAdmin />;
    }
    if (location.pathname === "/configurar-cuotas") {
      return <div>Contenido de las Cuotas</div>;
    }
    return <div>Bienvenido al sistema</div>;
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {renderContent()}
    </div>
  );
};

export default MainContent;
