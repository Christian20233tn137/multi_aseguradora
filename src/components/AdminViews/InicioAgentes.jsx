import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const InicioAgentes = () => {
  const navigate = useNavigate();

  const handleAceptar = () => {
    navigate("/solicitudes/solicitud-documentos");
  };

  const [view, setView] = useState("agentes");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);

  const profiles = [
    { name: "Christian Aviles Sotelo" },
    { name: "Lalo Garcia Montes" },
    { name: "Giovanni Pedraza Lopez" },
    { name: "Mopri Apellidos" },
    { name: "Albertano Dinamico" },
    // Esto después será dinámico con nuestra bd
  ];

  const profilesReserves = [
    { name: "Dominic Sanchez Rabadan" },
    { name: "Dana Jimenez Barenque" },
    { name: "Andrea Aguilar Medina" },
    { name: "Gabriel Morales Rosales" },
    { name: "Maria Figueroa Sotelo" },
    // Esto después será dinámico con nuestra bd
  ];

  const currentProfiles = view === "agentes" ? profiles : profilesReserves;

  const filteredProfiles = currentProfiles.filter((profile) =>
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
          className={`px-4 py-2 mr-2 border rounded ${
            view === "agentes" ? "bg-blue-200" : "hover:bg-blue-200"
          }`}
          onClick={() => setView("agentes")}
        >
          Agentes
        </button>
        <button
          className={`px-4 py-2 mr-2 border rounded ${
            view === "reactivaciones" ? "bg-blue-200" : "hover:bg-blue-200"
          }`}
          onClick={() => setView("reactivaciones")}
        >
          Reactivaciones
        </button>
        <input
          type="text"
          placeholder="Buscar..."
          className="px-2 py-2 ml-auto border rounded"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
        />
      </div>
      <div className="border-0 p-4">
        {visibleProfiles.map((profile, index) => (
          <div
            key={index}
            className="flex justify-between items-center border rounded p-8 mb-6"
          >
            <div className="px-6 py-4 rounded">
              <span className="text-lg font-semibold">{profile.name}</span>
            </div>
            <div className="flex items-center space-x-6">
              <label className="switch">
                <input type="checkbox" className="hidden" />
                <span className="slider round"></span>
              </label>
              <button
                className="px-8 py-3 text-white rounded botones"
                onClick={handleAceptar}
              >
                Editar
              </button>
              <button
                className="px-8 py-3 text-white rounded botones ml-4"
                onClick={handleAceptar}
              >
                Perfil
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

export default InicioAgentes;
