import React from "react";
import { useLocation } from "react-router-dom";
import ArchivosSection from "./Views/ArchivosSection";
import Notfound from "../NotFound";

const MainContentPostulante = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/archivosPostulante":
        return "Carga de Archivos";
      default:
        return "Bienvenido al sistema";
    }
  };

  const renderContent = () => {
    switch (location.pathname) {
      case "/archivosPostulante":
        return <ArchivosSection />;
      default:
        return <Notfound />;
    }
  };
  return <div className="flex-1 p-4 overflow-y-auto">{renderContent()}</div>;
};

export default MainContentPostulante;
