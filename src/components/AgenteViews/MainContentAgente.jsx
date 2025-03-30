import React from "react";
import { useLocation, useParams } from "react-router-dom";
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
  const params = useParams();

  const renderContent = () => {
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
      case `/inicioAgentes/${params.id}`:
        return <InicioAgente />;
      case `/inicioAgentes/${params.id}/editarPerfil`:
        return <EditarPerfil />;
      case `/inicioAgentes/${params.id}/cotizar`:
        return <Cotizar />;
      case `/inicioAgentes/${params.id}/cotizar/informacion`:
        return <DatosCotizar />;
      case `/inicioAgentes/${params.id}/cotizar/informacion/cotizacion`:
        return <Cotizaciones />;
      case `/inicioAgentes/${params.id}/cotizar/informacion/cotizacion/seguros`:
        return <Seguros />;
      case `/inicioAgentes/${params.id}/estadisticas`:
        return <Estadisticas />;
      case `/inicioAgentes/${params.id}/clientes`:
        return <Clientes />;
      default:
        return <Notfound />;
    }
  };

  return <div className="flex-1 p-4 overflow-y-auto">{renderContent()}</div>;
};

export default MainContentAgente;
