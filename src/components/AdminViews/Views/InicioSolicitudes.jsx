import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

const InicioSolicitudes = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("datos");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [datosResponse, documentosResponse] = await Promise.all([
          axios.get('http://localhost:3000/nar/usuarios/postulantesInactivos'),
          axios.get('http://localhost:3000/nar/usuarios/postulantesActivos')
        ]);

        if (!Array.isArray(datosResponse.data) || !Array.isArray(documentosResponse.data)) {
          throw new Error("Unexpected data format");
        }

        const combinedProfiles = [
          ...datosResponse.data.map(item => ({ ...item, type: 'datos' })),
          ...documentosResponse.data.map(item => ({ ...item, type: 'documentos' }))
        ];

        setProfiles(combinedProfiles);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error al obtener los datos. Por favor, inténtalo de nuevo más tarde.");
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  const filteredProfiles = profiles.filter((profile) => {
    const fullName = `${profile.nombre} ${profile.apellidoPaterno} ${profile.apellidoMaterno}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase()) &&
           (view === "datos" ? profile.type === "datos" : profile.type === "documentos");
  });

  const profilesPerPage = 3;
  const startIndex = currentPage * profilesPerPage;
  const visibleProfiles = filteredProfiles.slice(startIndex, startIndex + profilesPerPage);

  const handleVerMas = (profile) => {
    if (view === "datos") {
      navigate(`/solicitudes/solicitud-section/${profile.nombre}`);
    } else if (view === "documentos") {
      navigate(`/solicitudes/solicitud-documentos/${profile.nombre}`);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <button
          className={`px-4 py-2 mr-2 border rounded ${view === "datos" ? "bg-blue-200" : "hover:bg-blue-200"}`}
          onClick={() => setView("datos")}
        >
          Datos
        </button>
        <button
          className={`px-4 py-2 mr-2 border rounded ${view === "documentos" ? "bg-blue-200" : "hover:bg-blue-200"}`}
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
          <div key={index} className="flex justify-between items-center border rounded p-9 mb-8">
            <div className="px-4 py-2 rounded">
              <span className="text-ls font-semibold">{`${profile.nombre} ${profile.apellidoPaterno} ${profile.apellidoMaterno}`}</span>
            </div>
            <div className="flex items-center">
              <button
                className="px-4 py-2 text-white rounded botones"
                onClick={() => handleVerMas(profile)}
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
