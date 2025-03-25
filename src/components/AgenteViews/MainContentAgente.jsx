import React from "react";
import { useLocation } from "react-router-dom";
import InicioAgente from "./Views/InicioAgente";
import Cotizar from "./Views/Cotizar";
import Estadisticas from "./Views/Estadisticas";
import Clientes from "./Views/Clientes";
import Notfound from "../Notfound";
import DatosCotizar from "./Views/DatosCotizar";
import Polizas from "./Views/Polizas";

const MainContentAgente = () => {
  const location = useLocation();

  const getTitle = () => {
    switch (location.pathname) {
      case "/inicioAgentes":
        return "Inicio";
      case "/cotizar":
        return "Cotizar";
      case "/cotizar/informacion":
        return "";
      case "/estadisticas":
        return "Estadisticas";
      case "/clientes":
        return "Clientes";
        case "/clientes/polizas":
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
      case "/cotizar/informacion":
        return <DatosCotizar />;
      case "/estadisticas": 
        return <Estadisticas />;
      case "/clientes":
        return <Clientes />;
        case "/clientes/polizas":
        return <Polizas />;
      default:
        return <Notfound />;
    }
  };
  return <div className="flex-1 p-4 overflow-y-auto">{renderContent()}</div>;
};

export default MainContentAgente;
