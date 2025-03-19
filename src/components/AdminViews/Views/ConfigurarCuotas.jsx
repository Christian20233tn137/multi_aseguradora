import React from "react";

const ConfigurarCuotas = () => {
  // Esto será dinámico después
  const emisiones = 10;

  return (
    <div className="p-6 w-auto h-auto overflow-hidden">
      <h1 className="text-3xl p-3 text-center font-normal text-black miColor rounded-2xl w-full">
        Configuración de Cuota
      </h1>
      <h2 className="text-3xl p-3 text-center font-semibold text-black miColor rounded-2xl w-full mt-10">
        Actualmente se requieren {emisiones} emisiones mensuales
      </h2>
      <div className="w-full flex flex-col items-center mt-10">
        <label
          htmlFor="nuevaCantidad"
          className="text-lg font-medium text-black w-full text-center mb-2"
        >
          Ingresa la nueva cantidad
        </label>
        <input
          type="text"
          id="nuevaCantidad"
          name="nuevaCantidad"
          className="py-3 px-4 font-medium border border-gray-300  text-center rounded-md"
          required
        />
      </div>
      <div className="flex items-center justify-center ">
      <button
        type="button"
        className="w-30 py-3 text-lg font-semibold text-white botones rounded-lg mt-30"
      >
        Actualizar
      </button>
      </div>
      
    </div>
  );
};

export default ConfigurarCuotas;
