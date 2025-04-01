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
import CotizacionesPendientes from "./Views/CotizacionesPendientes";

const MainContentAgente = () => {
  const location = useLocation();

  const renderContent = () => {
    const path = location.pathname;
    console.log("Current path:", path);

    switch (path) {
      case `/inicioAgentes`:
        return <InicioAgente />;
      case `/inicioAgentes/cotizaciones`:
        return <CotizacionesPendientes />;
      case `/inicioAgentes/clientes/polizas`:
        return <Polizas />;
      case `/inicioAgentes/clientes/polizas/informacion`:
        return <InformacionPolizas />;
      case `/inicioAgentes/editarPerfil`:
        return <EditarPerfil />;
      case `/inicioAgentes/cotizar`:
        return <Cotizar />;
      case `/inicioAgentes/cotizar/informacion`:
        return <DatosCotizar />;
      case `/inicioAgentes/cotizar/informacion/cotizacion`:
        return <Cotizaciones />;

      case `/inicioAgentes/cotizar/informacion/cotizacion/seguros`:
        return <Seguros />;
      case `/inicioAgentes/estadisticas`:
        return <Estadisticas />;
      case `/inicioAgentes/clientes`:
        return <Clientes />;
      default:
        return <Notfound />;
    }
  };

  return <div className="flex-1 p-4 overflow-y-auto">{renderContent()}</div>;
};

export default MainContentAgente;
