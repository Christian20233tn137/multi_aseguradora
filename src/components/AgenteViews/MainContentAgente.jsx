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
    // Para rutas con parámetros dinámicos

    const basePath = location.pathname.split("/").slice(0, -1).join("/");

    if (location.pathname.includes("/clientes/polizas/")) {
      return <Polizas />;
    }

    switch (location.pathname) {
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
      case "/clientes/polizas/informacion":
        return <InformacionPolizas />;

      default:
        return <Notfound />;
    }
  };
  return <div className="flex-1 p-4 overflow-y-auto">{renderContent()}</div>;
};

export default MainContentAgente;
