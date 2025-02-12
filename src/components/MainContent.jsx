import React from "react";
import ProfileSection from "./ProfileSection";
import SolicitudSection from "./SolicitudSection";

const MainContent = ({ activeSection }) => {
  return (
    <div className="flex-1 p-4 overflow-y-auto ">
      {activeSection === "Inicio" && <ProfileSection />}
      {activeSection === "Datos" && <div>Contenido de Datos</div>}
      {activeSection === "Documentos" && <div>Contenido de Documentos</div>}
      {activeSection === "Buscar" && <div>Contenido de Buscar</div>}
      {activeSection === "Solicitudes" && <SolicitudSection />}
      {activeSection === "Aseguradoras" && <div>Contenido de Aseguradoras</div>}
      {activeSection === "Agentes" && <div>Contenido de Agentes</div>}
      {activeSection === "Cuotas" && <div>Contenido de las Cuotas</div>}
    </div>
  );
};

export default MainContent;
