import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const InicioAgentes = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("agentes");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [agentesActivos, setAgentesActivos] = useState([]);
  const [agentesInactivos, setAgentesInactivos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgentesActivos = async () => {
      try {
        console.log("Fetching agentes activos...");
        const response = await axios.get('http://localhost:3000/nar/usuarios/agentesActivos');
        console.log("Agentes activos fetched successfully:", response.data);
        setAgentesActivos(response.data);
      } catch (error) {
        console.error("Error fetching agentes activos:", error);
        setError("Error al obtener los agentes activos. Por favor, inténtalo de nuevo más tarde.");
      }
    };

    const fetchAgentesInactivos = async () => {
      try {
        console.log("Fetching agentes inactivos...");
        const response = await axios.get('http://localhost:3000/nar/usuarios/agentesInactivos');
        console.log("Agentes inactivos fetched successfully:", response.data);
        setAgentesInactivos(response.data);
      } catch (error) {
        console.error("Error fetching agentes inactivos:", error);
        setError("Error al obtener los agentes inactivos. Por favor, inténtalo de nuevo más tarde.");
      }
    };

    fetchAgentesActivos();
    fetchAgentesInactivos();
  }, []);




  const reactivarAgente = async (agenteId) => {
    if (!agenteId) {
      console.error("Error: agenteId es undefined");
      Swal.fire({
        title: "Error",
        text: "ID de agente no válido. Por favor, inténtalo de nuevo.",
        icon: "error",
      });
      return false;
    }

    const API_URL = `http://localhost:3000/nar/usuarios/inactive/${agenteId}`;

    try {
      console.log("Enviando solicitud a:", API_URL);
      await axios.put(API_URL);

      // Actualizar el estado local directamente
      setAgentesInactivos(agentesInactivos.filter(agente => agente.id !== agenteId));
      setAgentesActivos([...agentesActivos, { id: agenteId }]); // Aquí puedes agregar más detalles si los necesitas

      return true;
    } catch (error) {
      console.error("Error reactivando agente:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al reactivar el agente. Por favor, inténtalo de nuevo más tarde.",
        icon: "error",
      });
      return false;
    }
  };

  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
      cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
    },
    buttonsStyling: false
  });

  const handleEditar = (agenteId) => {
    if (view === "agentes") {
      navigate("/agentes/editar");
    } else {
      swalWithTailwindButtons.fire({
        title: "¿Estás seguro de continuar?",
        text: "¡Estamos trabajando en la reactivación! ¿Deseas continuar con la acción?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, continuar",
        cancelButtonText: "Cancelar",
        reverseButtons: true
      }).then(async (result) => {
        if (result.isConfirmed) {
          const success = await reactivarAgente(agenteId);
          if (success) {
            swalWithTailwindButtons.fire({
              title: "Reactivación exitosa",
              text: "¡El agente se ha reactivado con éxito!",
              icon: "success",
            });
          }
        }
      });
    }
  };

  const handlePerfil = () => {
    navigate("/agentes/perfil");
  };

  const currentProfiles = view === "agentes" ? agentesActivos : agentesInactivos;

  const filteredProfiles = currentProfiles.filter((profile) =>
    `${profile.nombre} ${profile.apellidoPaterno} ${profile.apellidoMaterno}`.toLowerCase().includes(searchTerm.toLowerCase())
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
          className={`px-4 py-2 mr-2 border rounded ${view === "agentes" ? "bg-blue-200" : "hover:bg-blue-200"
            }`}
          onClick={() => setView("agentes")}
        >
          Agentes
        </button>
        <button
          className={`px-4 py-2 mr-2 border rounded ${view === "reactivaciones" ? "bg-blue-200" : "hover:bg-blue-200"
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
        {visibleProfiles.map((profile) => (
          <div
            key={profile.id}
            className="flex justify-between items-center border rounded p-8 mb-6"
          >
            <div className="px-6 py-4 rounded">
              <span className="text-lg font-semibold">{`${profile.nombre} ${profile.apellidoPaterno} ${profile.apellidoMaterno}`}</span>
            </div>
            <div className="flex items-center space-x-6">
              {view === "reactivaciones" && (
                <span className="text-lg font-semibold">
                  No.Reactivaciones: {profile.numReactivaciones}
                </span>
              )}

              <button
                className="px-8 py-3 text-white rounded botones"
                onClick={() => handleEditar(profile._id)}
              >
                {view === "agentes" ? "Editar" : "Reactivar"}
              </button>
              {view === "agentes" && (
                <button
                  className="px-8 py-3 text-white rounded botones ml-4"
                  onClick={handlePerfil}
                >
                  Perfil
                </button>
              )}
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
