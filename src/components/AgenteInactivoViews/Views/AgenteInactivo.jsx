import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Cotizar from "../assets/cotizar.png";
import Clientes from "../assets/clientes.png";
import Estadisticas from "../assets/estadisticas.png";
import Cotizaciones from "../assets/cotizaciones.png";

const AgenteInactivo = () => {
  const location = useLocation();
  const id = location.state?.id;
  const [isReactivationRequested, setIsReactivationRequested] = useState(false);

  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton:
        "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
      cancelButton:
        "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2",
    },
    buttonsStyling: false,
  });

  const solicitarReactivacion = async () => {
    if (!id) {
      Swal.fire({
        title: "Error",
        text: "ID de agente no válido. Por favor, inténtalo de nuevo.",
        icon: "error",
      });
      return;
    }

    try {
      await axios.put(`http://localhost:3001/nar/usuarios/reactivacionesActive/${id}`);

      Swal.fire({
        title: "Solicitud enviada",
        text: "Tu solicitud de reactivación ha sido enviada con éxito.",
        icon: "success",
      });

      // Deshabilitar el botón después de enviar la solicitud
      setIsReactivationRequested(true);
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al enviar la solicitud de reactivación. Por favor, inténtalo de nuevo más tarde.",
        icon: "error",
      });
    }
  };

  return (
    <div className="p-6 w-full h-full overflow-hidden">
      <div className="mt-10 md:mt-40">
        <p className="text-red-500 text-lg font-semibold mb-4">
          LAS ACCIONES HAN SIDO BLOQUEADAS DEBIDO AL INCUMPLIMIENTO DE LA CUOTA MENSUAL
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="bg-gray-200 p-6 rounded-2xl shadow-md flex flex-col items-center text-center cursor-not-allowed">
            <img
              src={Cotizar}
              alt="Cotizar"
              className="w-20 h-20 mb-4 mx-auto"
            />
            <p className="text-lg font-semibold">Cotizar</p>
          </div>
          <div className="bg-gray-200 p-6 rounded-2xl shadow-md flex flex-col items-center text-center cursor-not-allowed">
            <img
              src={Cotizaciones}
              alt="Cotizaciones"
              className="w-20 h-20 mb-4 mx-auto"
            />
            <p className="text-lg font-semibold">Cotizaciones</p>
          </div>
          <div className="bg-gray-200 p-6 rounded-2xl shadow-md flex flex-col items-center text-center cursor-not-allowed">
            <img
              src={Estadisticas}
              alt="Estadísticas"
              className="w-20 h-20 mb-4 mx-auto"
            />
            <p className="text-lg font-semibold">Estadísticas</p>
          </div>
          <div className="bg-gray-200 p-6 rounded-2xl shadow-md flex flex-col items-center text-center cursor-not-allowed">
            <img
              src={Clientes}
              alt="Clientes"
              className="w-20 h-20 mb-4 mx-auto"
            />
            <p className="text-lg font-semibold">Clientes</p>
          </div>
        </div>
        <button
          className={`mt-8 botones p-3 rounded-md ${
            isReactivationRequested ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"
          }`}
          onClick={solicitarReactivacion}
          disabled={isReactivationRequested}
        >
          Solicitar Reactivación
        </button>
      </div>
    </div>
  );
};

export default AgenteInactivo;
