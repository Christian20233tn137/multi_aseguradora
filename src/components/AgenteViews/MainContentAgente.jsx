import React from "react";
import { useLocation } from "react-router-dom";
import InicioAgente from "./Views/InicioAgente";
import Cotizar from "./Views/Cotizar";
import Estadisticas from "./Views/Estadisticas";
import Clientes from "./Views/Clientes";
import Notfound from "../Notfound";

const MainContentAgente = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/inicioAgentes":
        return "Inicio";
      case "/cotizar":
        return "Cotizar";
      case "/estadisticas":
        return "Estadisticas";
      case "/clientes":
        return "Clientes";
      default:
        return "Bienvenido al sistema";
    }
  };

  const renderContent = () => {
    switch (location.pathname) {
      case "/inicioAgentes":
        return <InicioAgente />;
      case "/cotizar":
        return <Cotizar />;
      case "/estadisticas":
        return <Estadisticas />;
      case "/clientes":
        return <Clientes />;
      default:
        return <Notfound />;
    }
  };
  return <div className="flex-1 p-4 overflow-y-auto">{renderContent()}</div>;
};

export default MainContentAgente;
