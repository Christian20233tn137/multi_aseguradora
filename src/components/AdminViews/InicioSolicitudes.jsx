import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const InicioSolicitudes = () => {
  const navigate = useNavigate();

  const handleAceptar = () => {
    navigate("/solicitudes/solicitud-documentos"); 
  };

  const [view, setView] = useState("datos"); // Estado para controlar la vista actual

  const profiles = [
    { name: "Nombre del postulante 1" },
    { name: "Nombre del postulante 2" },
    { name: "Nombre del postulante 3" },
    // Esto después será dinámico con nuestra bd
  ];

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <button
          className={`px-4 py-2 mr-2 border rounded ${
            view === "datos" ? "bg-blue-200" : "hover:bg-blue-200"
          }`}
          onClick={() => setView("datos")}
        >
          Datos
        </button>
        <button
          className={`px-4 py-2 mr-2 border rounded ${
            view === "documentos" ? "bg-blue-200" : "hover:bg-blue-200"
          }`}
          onClick={() => setView("documentos")}
        >
          Documentos
        </button>
        <input
          type="text"
          placeholder="Buscar..."
          className="px-2 py-2 ml-auto border rounded"
        />
      </div>
      <div className="border-0 p-4">
        {view === "datos" ? (
          profiles.map((profile, index) => (
            <div
              key={index}
              className="flex justify-between items-center border rounded p-4 mb-4"
            >
              <div className="px-4 py-2 rounded">
                <span className="text-ls font-semibold">{profile.name}</span>
              </div>
              <div className="flex items-center">
                <button className="px-4 py-2 text-white rounded botones" onClick={handleAceptar}>
                  Ver más
                </button>
              </div>
            </div>
          ))
        ) : (
          <div>
            {/* Aquí puedes agregar la vista para "Documentos" */}
            <p>Vista de Documentos</p>
            {/* Puedes agregar más componentes o lógica para la vista de documentos */}
          </div>
        )}
      </div>
    </div>
  );
};

export default InicioSolicitudes;
