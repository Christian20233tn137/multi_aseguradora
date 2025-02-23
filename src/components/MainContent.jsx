import React from "react";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import ProfileSection from "./AdminViews/ProfileSection";
import SolicitudSection from "./AdminViews/SolicitudSection";
import InicioSolicitudes from "./AdminViews/InicioSolicitudes";
import InicioAseguradoras from "./AdminViews/InicioAseguradoras";

const MainContent = ({ activeSection }) => {
  const navigate = useNavigate(); // Obtén la función de navegación

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      {activeSection === "Inicio" && (
        <div onClick={() => handleNavigate("/inicio")}>
          <ProfileSection />
        </div>
      )}
      {activeSection === "Datos" && (
        <div onClick={() => handleNavigate("/datos")}>Contenido de Datos</div>
      )}
      {activeSection === "Documentos" && (
        <div onClick={() => handleNavigate("/documentos")}>
          Contenido de Documentos
        </div>
      )}
      {activeSection === "Solicitudes" && (
        <div onClick={() => handleNavigate("/solicitudes")}>
          <InicioSolicitudes />
        </div>
      )}
      {activeSection === "SolicitudDocumentos" && (
        <div
          onClick={() => handleNavigate("/solicitudes/solicitud-documentos")}
        >
          <SolicitudSection />
        </div>
      )}
      {activeSection === "Aseguradoras" && (
        <div onClick={() => handleNavigate("/aseguradoras")}>
          <InicioAseguradoras/>
        </div>
      )}
      {activeSection === "Agentes" && (
        <div onClick={() => handleNavigate("/agentes")}>
          Contenido de Agentes
        </div>
      )}
      {activeSection === "Administradores" && (
        <div onClick={() => handleNavigate("/administradores")}>
          Contenido de Administradores
        </div>
      )}
      {activeSection === "Configurar Cuotas" && (
        <div onClick={() => handleNavigate("/configurar-cuotas")}>
          Contenido de las Cuotas
        </div>
      )}
    </div>
  );
};

export default MainContent;
