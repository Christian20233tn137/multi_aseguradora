import React from "react";

const SolicitudDocumentos = () => {
  let nombrePostulante = "Juan Perez";

  return (
    <div className="p-6 w-auto h-auto overflow-hidden">
      <h1 className="text-3xl max-w-screen p-3 text-center font-normal text-black bg-blue-200 rounded-2xl">
        {nombrePostulante}
      </h1>
      <div className="mb-6">
        <label className="mt-10 block text-gray-700 text-lg font-bold mb-2">
          Comprobante de domicilio
        </label>
        <input
          className="shadow appearance-none border-2 rounded w-full py-18  px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="file"
        />  
      </div>

      <div className="mb-6">
        <label className="mt-10 block text-gray-700 text-lg font-bold mb-2">
          Constancia de situación fiscal
        </label>
        <input
          className="shadow appearance-none border-2 rounded w-full py-18 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="file"
        />
      </div>

      <div className="flex space-x-5 justify-center mt-10">
        <button
          type="button"
          className="w-32 text-white py-2 rounded-md bg-blue-700 hover:bg-blue-800 botones"
        >
          Denegar
        </button>
        <button
          type="button"
          className="w-32 text-white py-2 rounded-md bg-blue-700 hover:bg-blue-800 botones"
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default SolicitudDocumentos;
