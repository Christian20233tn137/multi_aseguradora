import React from "react";
import { useNavigate } from "react-router-dom";

const InformacionSeguros = () => {
  const navigate = useNavigate();

  const handleRegresar = () => {
    navigate("/aseguradoras/seguros"); // 
  };

  return (
    <div className="p-4 flex flex-col items-center">
      {/* Título */}
      <div className="text-xl rounded p-4 w-full max-w-3xl text-center">
      <h1 className="text-3xl max-w-screen p-3 text-center font-normal text-black bg-blue-100 rounded-2xl">
        Seguros
      </h1>
      </div>

      {/* Contenedor de la información */}
      <div className="mt-8 p-8 border rounded-lg shadow-md w-full max-w-3xl text-left">
        {/* Círculo */}
        <div className="w-16 h-16 bg-[#3f4a66] rounded-full mb-4"></div>
        {/* Aquí irá la descripción y la cobertura */}
      </div>

      {/* Botón Regresar */}
      <button
        onClick={handleRegresar}
        className="mt-8 bg-[#0f2344] text-white px-8 py-3 rounded border-4"
      >
        Regresar
      </button>
    </div>
  );
};

export default InformacionSeguros;
