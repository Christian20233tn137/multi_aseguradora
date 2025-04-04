import React from "react";
import { useLocation } from "react-router-dom";

const ProfileSection = () => {

  const location = useLocation();
  const id = location.state?.id;
  console.log("Prueba", id);
  

  return (
    <div className="flex flex-col p-6">
      {/* Dropdown */}
      <div className="mb-6 self-end">
        <select className="p-2 border rounded">
          <option>Enero</option>
          <option>Febrero</option>
          <option>Marzo</option>
        </select>
      </div>

      {/* Cards */}
      <div className="flex flex-wrap justify-center gap-6">
        {/* Agentes activos */}
        <div className="flex flex-col items-center flex-1 p-12 bg-blue-100 rounded shadow min-w-[300px]">
          <h2 className="text-xl font-bold mb-2">Agentes activos</h2>
          <p className="text-4xl font-bold">20</p>
        </div>

        {/* Cotizaciones */}
        <div className="flex flex-col items-center flex-1 p-12 bg-blue-100 rounded shadow min-w-[300px]">
          <h2 className="text-xl font-bold mb-2">Cotizaciones</h2>
          <p className="text-4xl font-bold">10</p>
        </div>

        {/* Emisiones */}
        <div className="flex flex-col items-center flex-1 p-12 bg-blue-100 rounded shadow min-w-[300px]">
          <h2 className="text-xl font-bold mb-2">Emisiones</h2>
          <p className="text-4xl font-bold">5</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
