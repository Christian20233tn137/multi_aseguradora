import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const InicioSolicitudes = () => {
  const navigate = useNavigate();

  const handleVerMas = () => {
    if (view === "datos") {
      navigate("/solicitudes/solicitud-section");
    } else if (view === "documentos") {
      navigate("/solicitudes/solicitud-documentos");
    }
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
  ];

  const filteredProfiles = profiles.filter((profile) =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const profilesPerPage = 3;
  const startIndex = currentPage * profilesPerPage;
  const visibleProfiles = filteredProfiles.slice(
    startIndex,
    startIndex + profilesPerPage
  );

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <button
          className={`px-4 py-2 mr-2 border rounded ${view === "datos" ? "bg-blue-200" : "hover:bg-blue-200"
            }`}
          onClick={() => setView("datos")}
        >
          Datos
        </button>
        <button
          className={`px-4 py-2 mr-2 border rounded ${view === "documentos" ? "bg-blue-200" : "hover:bg-blue-200"
            }`}
          onClick={() => setView("documentos")}
        >
          Documentos
        </button>
        <div className="relative w-full max-w-xs ml-auto">
          <input
            type="text"
            placeholder="Buscar..."
            className="pr-10 pl-2 py-2 border rounded w-full"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
          />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="border-0 p-4">
        {visibleProfiles.map((profile, index) => (
          <div
            key={index}
            className="flex justify-between items-center border rounded p-9 mb-8"
          >
            <div className="px-4 py-2 rounded">
              <span className="text-ls font-semibold">{profile.name}</span>
            </div>
            <div className="flex items-center">
              <button
                className="px-4 py-2 text-white rounded botones"
                onClick={handleVerMas}
              >
                Ver más
              </button>
            </div>
          </div>
        ))}
      </div>
      {filteredProfiles.length > profilesPerPage && (
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
