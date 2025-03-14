import React from "react";
import { Link } from "react-router-dom";
import Cotizar from "../assets/cotizar.png";
import Clientes from "../assets/clientes.png";
import Estadisticas from "../assets/estadisticas.png";

const InicioAgente = () => {
  return (
    <div className="p-6 w-full h-full overflow-hidden">
      <div className="mt-10 md:mt-40">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/cotizar" className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center">
            <img src={Cotizar} alt="Cotizar" className="w-20 h-20 mb-4 mx-auto" />
            <p className="text-lg font-semibold">Cotizar</p>
          </Link>

          <Link to="/estadisticas" className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center">
            <img src={Estadisticas} alt="Estadísticas" className="w-20 h-20 mb-4 mx-auto" />
            <p className="text-lg font-semibold">Estadísticas</p>
          </Link>

          <Link to="/clientes" className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center">
            <img src={Clientes} alt="Clientes" className="w-20 h-20 mb-4 mx-auto" />
            <p className="text-lg font-semibold">Clientes</p>
          </Link>
        </div>
      </div>  
    </div>
  );
};

export default InicioAgente;
