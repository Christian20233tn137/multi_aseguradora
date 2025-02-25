import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const InicioSolicitudes = () => {
  const navigate = useNavigate();

  const handleAceptar = () => {
    navigate("/solicitudes/solicitud-documentos");
  };

  const [view, setView] = useState("datos"); // Estado para controlar la vista actual
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const [currentPage, setCurrentPage] = useState(0); // Estado para la página actual

  const profiles = [
    { name: "Pemex" },
    { name: "Coca" },
    { name: "Utez" },
    { name: "Pepsi" },
    { name: "Albertano" },
    // Esto después será dinámico con nuestra bd
  ];

  // Filtrar perfiles según el término de búsqueda
  const filteredProfiles = profiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular los perfiles a mostrar en la página actual
  const profilesPerPage = 3;
  const startIndex = currentPage * profilesPerPage;
  const visibleProfiles = filteredProfiles.slice(startIndex, startIndex + profilesPerPage);

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
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0); // Reiniciar la página al buscar
          }}
        />
      </div>
      <div className="border-0 p-4">
        {view === "datos" ? (
          visibleProfiles.map((profile, index) => (
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
      {view === "datos" && filteredProfiles.length > profilesPerPage && (
        <div className="flex justify-center mt-4">
          <button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="px-4 py-2 mr-2 border botones"
          >
            Anterior
          </button>
          <button
            disabled={startIndex + profilesPerPage >= filteredProfiles.length}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="px-4 py-2 border botones"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default InicioSolicitudes;
