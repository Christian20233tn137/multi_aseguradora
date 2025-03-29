import React from "react";
import { useLocation } from "react-router-dom";
import InicioAgente from "./Views/InicioAgente";
import Cotizar from "./Views/Cotizar";
import Estadisticas from "./Views/Estadisticas";
import Clientes from "./Views/Clientes";
import Notfound from "../Notfound";
import DatosCotizar from "./Views/DatosCotizar";
import Polizas from "./Views/Polizas";
import Cotizaciones from "./Views/Cotizaciones";
import Seguros from "./Views/Seguros";
import InformacionPolizas from "./Views/InformacionPolizas";
import EditarPerfil from "./Views/EditarPerfil";

const MainContentAgente = () => {
  const location = useLocation();

  const renderContent = () => {
    // Simplifica la lógica de rutas para hacer debug
    const path = location.pathname;
    console.log("Current path:", path); // Para debugging

    // Maneja la ruta de información de póliza
    if (path.includes("/clientes/polizas") && path.includes("/informacion/")) {
      return <InformacionPolizas />;
    }

    // Maneja la ruta de pólizas
    if (path.includes("/clientes/polizas/")) {
      return <Polizas />;
    }

    switch (path) {
      case "/inicioAgentes":
        return <InicioAgente />;
      case "/inicioAgentes/EditarPerfil":
        return <EditarPerfil />;
      case "/cotizar":
        return <Cotizar />;
      case "/cotizar/informacion":
        return <DatosCotizar />;
      case "/cotizar/informacion/cotizacion":
        return <Cotizaciones />;
      case "/cotizar/informacion/cotizacion/seguros":
        return <Seguros />;
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
