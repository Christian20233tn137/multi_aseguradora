import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSearch } from "react-icons/fa";

const InicioSolicitudes = () => {
  const location = useLocation();
  const id = location.state?.id;
  console.log("Prueba", id);

  const navigate = useNavigate();
  const [view, setView] = useState("datos");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPageDatos, setCurrentPageDatos] = useState(0);
  const [currentPageDocumentos, setCurrentPageDocumentos] = useState(0);
  const [profiles, setProfiles] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [datosResponse, documentosResponse] = await Promise.all([
          axios.get("http://localhost:3001/nar/usuarios/postulantesInactivos"),
          axios.get("http://localhost:3001/nar/usuarios/postulantesActivos"),
        ]);

        if (
          !Array.isArray(datosResponse.data) ||
          !Array.isArray(documentosResponse.data)
        ) {
          throw new Error("Unexpected data format");
        }

        const combinedProfiles = [
          ...datosResponse.data.map((item) => ({ ...item, type: "datos" })),
          ...documentosResponse.data.map((item) => ({
            ...item,
            type: "documentos",
          })),
        ];

        setProfiles(combinedProfiles);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(
          "Error al obtener los datos. Por favor, inténtalo de nuevo más tarde."
        );
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  const filteredProfiles = profiles.filter((profile) => {
    const fullName =
      `${profile.nombre} ${profile.apellidoPaterno} ${profile.apellidoMaterno}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const profilesPerPage = 5;
  const startIndexDatos = currentPageDatos * profilesPerPage;
  const startIndexDocumentos = currentPageDocumentos * profilesPerPage;

  const visibleProfilesDatos = filteredProfiles
    .filter((profile) => profile.type === "datos")
    .slice(startIndexDatos, startIndexDatos + profilesPerPage);

  const visibleProfilesDocumentos = filteredProfiles
    .filter((profile) => profile.type === "documentos")
    .slice(startIndexDocumentos, startIndexDocumentos + profilesPerPage);

  const handleVerMas = (profile) => {
    if (view === "datos") {
      navigate(`/solicitudes/solicitud-section`, {
        state: { profile, id: id },
      });
    } else if (view === "documentos") {
      navigate(`/solicitudes/solicitud-documentos`, {
        state: { profile, id: id },
      });
    }
  };

  return (
    <div className="p-4">
      {/* Contenedor principal de los botones y búsqueda */}
      <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
        <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-2 sm:space-x-3 sm:space-y-0">
          <button
            className={`px-4 py-2 border-0 shadow-md rounded w-full sm:w-auto ${
              view === "datos" ? "bg-blue-200" : "hover:bg-blue-200"
            }`}
            onClick={() => setView("datos")}
          >
            Datos
          </button>
          <button
            className={`px-4 py-2 border-0 rounded w-full sm:w-auto ${
              view === "documentos" ? "bg-blue-200" : "hover:bg-blue-200"
            }`}
            onClick={() => setView("documentos")}
          >
            Documentos
          </button>
        </div>
  
        {/* Input de búsqueda */}
        <div className="relative w-full mt-2 sm:mt-0 max-w-xs sm:w-auto">
          <input
            type="text"
            placeholder="Buscar..."
            className="px-4 py-2 w-full border-0 shadow-md rounded-lg"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPageDatos(0);
              setCurrentPageDocumentos(0);
            }}
          />
        </div>
      </div>
  
      {/* Contenedor de los perfiles */}
      <div className="border-0 p-4">
        {view === "datos" &&
          visibleProfilesDatos.map((profile, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center sm:items-start border-0 shadow-md rounded-lg p-4 mb-4"
            >
              <div className="px-4 py-2 rounded text-center sm:text-left w-full sm:w-auto">
                <span className="text-lg font-semibold">{`${profile.nombre} ${profile.apellidoPaterno} ${profile.apellidoMaterno}`}</span>
              </div>
              <div className="ml-auto self-stretch sm:self-auto mt-2 sm:mt-0">
                <button
                  className="px-4 py-2 text-white rounded botones w-full sm:w-auto"
                  onClick={() => handleVerMas(profile)}
                >
                  Ver más
                </button>
              </div>
            </div>
          ))}
        {view === "documentos" &&
          visibleProfilesDocumentos.map((profile, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-center sm:items-start border-0 shadow-md rounded-lg p-4 mb-4"
            >
              <div className="px-4 py-2 rounded text-center sm:text-left w-full sm:w-auto">
                <span className="text-lg font-semibold">{`${profile.nombre} ${profile.apellidoPaterno} ${profile.apellidoMaterno}`}</span>
              </div>
              <div className="ml-auto self-stretch sm:self-auto mt-2 sm:mt-0">
                <button
                  className="px-4 py-2 text-white rounded botones w-full sm:w-auto"
                  onClick={() => handleVerMas(profile)}
                >
                  Ver más
                </button>
              </div>
            </div>
          ))}
      </div>
  
      {/* Botones de paginación */}
      {view === "datos" &&
        filteredProfiles.filter((profile) => profile.type === "datos").length >
          profilesPerPage && (
          <div className="flex flex-col sm:flex-row justify-between mt-4 space-y-2 sm:space-y-0">
            <button
              onClick={() => setCurrentPageDatos(currentPageDatos - 1)}
              disabled={currentPageDatos === 0}
              className="px-4 py-2 botones text-white rounded disabled:bg-gray-400 w-full sm:w-auto"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPageDatos(currentPageDatos + 1)}
              disabled={
                startIndexDatos + profilesPerPage >=
                filteredProfiles.filter((profile) => profile.type === "datos")
                  .length
              }
              className="px-4 py-2 botones text-white rounded disabled:bg-gray-400 w-full sm:w-auto"
            >
              Siguiente
            </button>
          </div>
        )}
      {view === "documentos" &&
        filteredProfiles.filter((profile) => profile.type === "documentos")
          .length > profilesPerPage && (
          <div className="flex flex-col sm:flex-row justify-between mt-4 space-y-2 sm:space-y-0">
            <button
              onClick={() => setCurrentPageDocumentos(currentPageDocumentos - 1)}
              disabled={currentPageDocumentos === 0}
              className="px-4 py-2 botones text-white rounded disabled:bg-gray-400 w-full sm:w-auto"
            >
              Anterior
            </button>
            <button
              onClick={() => setCurrentPageDocumentos(currentPageDocumentos + 1)}
              disabled={
                startIndexDocumentos + profilesPerPage >=
                filteredProfiles.filter((profile) => profile.type === "documentos")
                  .length
              }
              className="px-4 py-2 botones text-white rounded disabled:bg-gray-400 w-full sm:w-auto"
            >
              Siguiente
            </button>
          </div>
        )}
    </div>
  );
  
  
}

export default InicioSolicitudes;
