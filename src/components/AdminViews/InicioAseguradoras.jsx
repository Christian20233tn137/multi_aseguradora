import React, { useState } from "react";

const InicioAseguradoras = () => {
  const aseguradoras = [
    { name: "Nombre de la aseguradora 1", date: "12-02-2024" },
    { name: "Nombre de la aseguradora 2", date: "12-02-2024" },
    { name: "Nombre de la aseguradora 3", date: "12-02-2024" },
    // Esto después será dinámico con nuestra bd
  ];

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
        <button className="px-4 py-2 text-white botones w-full md:w-auto">
          + Agregar
        </button>
        <input
          type="text"
          placeholder="Buscar..."
          className="px-2 py-2 w-full md:w-auto border rounded"
        />
      </div>
      <div className="border-0 p-4 space-y-4">
        {aseguradoras.map((aseguradora, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center justify-between border rounded p-4"
          >
            <div className="flex items-center mb-4 md:mb-0">
              <div className="w-12 h-12 bg-gray-400 rounded-full mr-4"></div>
              <div>
                <p className="text-lg font-semibold">{aseguradora.name}</p>
                <p className="text-gray-500">{aseguradora.date}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className="switch">
                <input type="checkbox" className="hidden" />
                <span className="slider round"></span>
              </label>
              <button className="px-4 py-2 text-white botones">
                Editar
              </button>
              <button className="px-4 py-2 text-white botones">
                Ver más
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InicioAseguradoras;
