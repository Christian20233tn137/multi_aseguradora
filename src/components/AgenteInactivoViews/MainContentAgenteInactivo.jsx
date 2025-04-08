import React from "react";
import { useLocation } from "react-router-dom";
import AgenteInactivo from "./Views/AgenteInactivo";
import Notfound from "../Notfound";

const MainContentAgenteInactivo = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/agenteInactivo":
        return "Agente Inactivo";
      default:
        return "Bienvenido al sistema";
    }
  };

  const renderContent = () => {
    switch (location.pathname) {
      case "/agenteInactivo":
        return <AgenteInactivo />;
      default:
        return <Notfound />;
    }
  };

  return <div className="flex-1 p-4 overflow-y-auto">{renderContent()}</div>;
};

export default MainContentAgenteInactivo;
