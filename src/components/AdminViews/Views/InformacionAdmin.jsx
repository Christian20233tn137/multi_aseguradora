import React from 'react';
import { useNavigate } from 'react-router-dom';

const InformacionAdmin = () => {
  const navigate = useNavigate();

  const nombrePostulante = "Juan Perez";
  const correoElectronico = "juan.perez@example.com";
  const telefono = "555-1234";
  const domicilio = "Calle Falsa 123";
  const rfc = "XAXX010101000";
  
  return (
    <div className="p-6 w-full h-auto overflow-hidden">
      <h1 className="text-3xl w-full p-3 text-center font-normal text-black miColor rounded-2xl">
        {nombrePostulante}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-2">Correo electrónico:</label>
          <input className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={correoElectronico} readOnly />
        </div>
        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-2">Teléfono:</label>
          <input className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={telefono} readOnly />
        </div>
        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-16">Domicilio:</label>
          <input className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={domicilio} readOnly />
        </div>
        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-10">RFC:</label>
          <input className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={rfc} readOnly />
        </div>
      </div>

      {/* Botón Regresar */}
      <div className="col-span-2 flex items-center justify-center mt-8">
        <button
          type="button"
          className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          style={{ backgroundColor: "#0B1956" }}
          onClick={() => navigate(-1)} // Esto regresará a la página anterior
        >
          Regresar
        </button>
      </div>
    </div>
  );
}

export default InformacionAdmin;