import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const InicioAgentes = () => {
  const navigate = useNavigate();
  const [view, setView] = useState("agentes");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPageAgentes, setCurrentPageAgentes] = useState(0);
  const [currentPageReactivaciones, setCurrentPageReactivaciones] = useState(0);
  const [agentesActivos, setAgentesActivos] = useState([]);
  const [agentesInactivos, setAgentesInactivos] = useState([]);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const fetchAgentes = async () => {
      try {
        const [activos, inactivos] = await Promise.all([
          axios.get('http://localhost:3000/nar/usuarios/agentesActivos'),
          axios.get('http://localhost:3000/nar/usuarios/agentesInactivos')
        ]);
        setAgentesActivos(activos.data);
        setAgentesInactivos(inactivos.data);
      } catch (error) {
        setError("Error al obtener los agentes. Por favor, inténtalo de nuevo más tarde.");
      }
    };
    fetchAgentes();
  }, [view, reload]);  // Se recarga cuando 'reload' cambia

  const reactivarAgente = async (agenteId) => {
    if (!agenteId) {
      Swal.fire({
        title: "Error",
        text: "ID de agente no válido. Por favor, inténtalo de nuevo.",
        icon: "error",
      });
      return false;
    }

    try {
      const agenteToReactivate = agentesInactivos.find(agente => agente._id === agenteId);

      if (!agenteToReactivate) {
        Swal.fire({
          title: "Error",
          text: "No se encontró el agente a reactivar.",
          icon: "error",
        });
        return false;
      }

      await axios.put(`http://localhost:3000/nar/usuarios/active/${agenteId}`);

      setAgentesInactivos(agentesInactivos.filter(agente => agente._id !== agenteId));
      setAgentesActivos(prevActivos => [...prevActivos, agenteToReactivate]);

      // Forzar la actualización de la vista
      setReload(prev => !prev);

      Swal.fire({
        title: "Reactivación exitosa",
        text: "¡El agente se ha reactivado con éxito!",
        icon: "success",
      });

      return true;
    } catch (error) {
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
  const startIndex = view === "agentes" ? currentPageAgentes * profilesPerPage : currentPageReactivaciones * profilesPerPage;
  const visibleProfiles = filteredProfiles.slice(
    startIndex,
    startIndex + profilesPerPage
  );

  const handlePageChange = (newPage) => {
    if (view === "agentes") {
      setCurrentPageAgentes(newPage);
    } else {
      setCurrentPageReactivaciones(newPage);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <button
          className={`px-4 py-2 mr-2 border rounded ${view === "agentes" ? "bg-blue-200" : "hover:bg-blue-200"}`}
          onClick={() => setView("agentes")}
        >
          Agentes
        </button>
        <button
          className={`px-4 py-2 mr-2 border rounded ${view === "reactivaciones" ? "bg-blue-200" : "hover:bg-blue-200"}`}
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
            handlePageChange(0);
          }}
        />
      </div>
      <div className="border-0 p-4">
        {visibleProfiles.map((profile) => (
          <div
            key={profile._id}
            className="flex justify-between items-center border rounded p-8 mb-6"
          >
            <div className="px-6 py-4 rounded">
              <span className="text-lg font-semibold">{`${profile.nombre} ${profile.apellidoPaterno} ${profile.apellidoMaterno}`}</span>
            </div>
            <div className="flex items-center space-x-6">
              {view === "reactivaciones" && (
                <span className="text-lg font-semibold">
                  No.Reactivaciones: {profile.reactivaciones}
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
            disabled={startIndex === 0}
            onClick={() => handlePageChange(view === "agentes" ? currentPageAgentes - 1 : currentPageReactivaciones - 1)}
            className="px-4 py-2 mr-2 border botones"
          >
            Anterior
          </button>
          <button
            disabled={startIndex + profilesPerPage >= filteredProfiles.length}
            onClick={() => handlePageChange(view === "agentes" ? currentPageAgentes + 1 : currentPageReactivaciones + 1)}
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
