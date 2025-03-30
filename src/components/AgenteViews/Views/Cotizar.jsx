import React, { useState } from "react";
import ImagenSeguros from "../assets/imagenSeguros.png";
import { useNavigate, useParams } from "react-router-dom";

const Cotizar = () => {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  const handleFormulario = () => {
    navigate(`/inicioAgentes/${id}/cotizar/informacion`);
  };

  const aseguradoras = [
    { nombre: "Seguro de vida" },
    { nombre: "Seguro de gastos medicos" },
    { nombre: "Seguro de viajes" },
  ];

  const filteredAseguradoras = aseguradoras.filter((aseguradora) =>
    aseguradora.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row items-center mb-4">
        <input
          type="text"
          placeholder="Buscar..."
          className="px-4 py-2 w-full sm:w-auto border rounded mb-2 sm:mb-0 sm:ml-auto"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="border-0 p-4">
        {filteredAseguradoras.map((aseguradora, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row items-center border rounded p-4 mb-4"
          >
            <img src={ImagenSeguros} alt="Seguro" className="w-16 h-16 mb-4 sm:mb-0 sm:mr-4" />
            <div className="flex-grow">
              <span className="text-lg font-semibold">{aseguradora.nombre}</span>
            </div>
            <button
              className="px-8 py-3 text-white rounded botones mt-2 sm:mt-0"
              onClick={handleFormulario}
            >
              Cotizar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cotizar;
