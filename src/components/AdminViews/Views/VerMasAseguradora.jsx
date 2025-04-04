import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const VerMasAseguradora = () => {
  const location = useLocation();
  const idAseguradora = location.state?.idAseguradora; // Obtener el ID de la aseguradora desde el estado de navegación
  console.log("ID de aseguradora:", idAseguradora);

  const navigate = useNavigate();

  const [aseguradoraData, setAseguradoraData] = useState({
    nombre: "",
    nombreContacto: "",
    telefonoContacto: "",
    correoContacto: "",
  });
  const [seguros, setSeguros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedItems, setCheckedItems] = useState({});
  const itemsPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!idAseguradora) {
          throw new Error("ID de aseguradora no proporcionado");
        }

        // 1. Obtener datos de la aseguradora
        const aseguradoraResponse = await axios.get(
          `http://localhost:3000/nar/aseguradoras/id/${idAseguradora}`
        );
        console.log("Datos de aseguradora:", aseguradoraResponse.data);
        setAseguradoraData(aseguradoraResponse.data);

        // 2. Obtener seguros de la aseguradora
        const segurosResponse = await axios.get(
          `http://localhost:3000/nar/seguros/segurosByAseguradora/${idAseguradora}`
        );
        console.log("Datos de seguros:", segurosResponse.data);
        setSeguros(segurosResponse.data);

        // Cargar estado desde localStorage
        const storedState =
          JSON.parse(localStorage.getItem("checkedItems")) || {};

        // Inicializar el estado de los switches
        const initialCheckedItems = {};
        segurosResponse.data.forEach((seguro) => {
          initialCheckedItems[seguro._id] =
            storedState[seguro._id] ?? seguro.active;
        });

        setCheckedItems(initialCheckedItems);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setError("Error al cargar datos. Por favor, intente nuevamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idAseguradora]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(
        prevPage + 1,
        Math.ceil(filteredSeguros.length / itemsPerPage) - 1
      )
    );
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  // Manejar posibles diferentes estructuras de datos
  const filteredSeguros = seguros.filter((seguro) => {
    const searchField = seguro?.name || seguro?.nombre || "";
    return searchField.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const currentItems = filteredSeguros.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlerNavigationEdit = (seguroId) => {
    navigate(`/aseguradoras/seguros/editar/${seguroId || ""}`, { state: { id: seguroId, idAseguradora } });
  };
  const handlerInfo = (seguroId) => {
    navigate(`/aseguradoras/seguros/informacion/${seguroId}`);
  };

  const handlerAdd = () => {
    navigate(`/aseguradoras/seguros/agregar`, { state: { idAseguradora } });
    // Navegar a la ruta de agregar seguro
  };

  const handleToggleSwitch = async (seguroId, isActive) => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        confirmButton:
          "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
        cancelButton:
          "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2",
      },
      buttonsStyling: false,
    });

    const action = isActive ? "inactive" : "active";

    swalWithTailwindButtons
      .fire({
        title: isActive
          ? "¿Desea desactivar este seguro?"
          : "¿Desea activar este seguro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: isActive
          ? "Sí, desactivarlo"
          : "¡Sí, quiero activarlo!",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const endpoint = `http://localhost:3000/nar/seguros/${action}/${seguroId}`;
            const response = await axios.put(endpoint);

            if (response.status === 200) {
              swalWithTailwindButtons.fire({
                title: isActive ? "¡Seguro desactivado!" : "¡Seguro activado!",
                icon: "success",
              });

              setCheckedItems((prevState) => {
                const newState = {
                  ...prevState,
                  [seguroId]: !isActive,
                };
                localStorage.setItem("checkedItems", JSON.stringify(newState)); // Guardar en localStorage
                return newState;
              });

              setSeguros((prevSeguros) =>
                prevSeguros.map((seguro) =>
                  seguro._id === seguroId
                    ? { ...seguro, active: !isActive }
                    : seguro
                )
              );
            } else {
              swalWithTailwindButtons.fire(
                "Error",
                "Hubo un problema al actualizar el estado del seguro.",
                "error"
              );
            }
          } catch (error) {
            console.error("Error al actualizar el estado del seguro:", error);
            swalWithTailwindButtons.fire(
              "Error",
              error.response?.data?.message || "Ocurrió un error inesperado.",
              "error"
            );
          }
        }
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl">Cargando datos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col p-4 overflow-hidden">
      {/* Información de la aseguradora */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
          <div className="flex flex-col">
            <p>
              <strong>Aseguradora:</strong> {aseguradoraData.nombre}
            </p>
            <p>
              <strong>Contacto:</strong> {aseguradoraData.nombreContacto}
            </p>
            <p>
              <strong>Teléfono:</strong> {aseguradoraData.telefonoContacto}
            </p>
            <p>
              <strong>Correo:</strong> {aseguradoraData.correoContacto}
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            placeholder="Buscar..."
            className="px-4 py-2 border rounded w-full md:w-auto"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(0);
            }}
          />
          <button
            type="button"
            className="px-4 py-2 botones text-white rounded w-full md:w-auto"
            onClick={handlerAdd}
          >
            + Agregar
          </button>
        </div>
      </div>

      {/* Título de la sección */}
      <h1 className="text-3xl max-w-screen p-3 text-center font-normal text-black bg-blue-100 rounded-2xl">
        Seguros
      </h1>

      {/* Lista de seguros */}
      <div className="flex-grow overflow-y-hidden h-full">
        {currentItems.length > 0 ? (
          currentItems.map((seguro) => {
            // Asegurar compatibilidad con diferentes estructuras de datos
            const seguroId = seguro?.id || seguro?._id;
            const nombreSeguro = seguro?.name || seguro?.nombre || "Sin nombre";
            const fechaSeguro = seguro?.date || seguro?.fecha || "Sin fecha";

            return (
              <div
                key={seguroId}
                className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 border rounded shadow-lg mt-3 bg-white"
              >
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-400 rounded-full"></div>
                  <div>
                    <p className="text-lg font-semibold">{nombreSeguro}</p>
                    <p className="text-gray-600">{fechaSeguro}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <label className="switch">
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checkedItems[seguroId] || false}
                      onChange={() =>
                        handleToggleSwitch(seguroId, checkedItems[seguroId])
                      }
                    />
                    <span className="slider round"></span>
                  </label>
                  <button
                    className="px-4 py-2 botones text-white rounded"
                    onClick={() => handlerNavigationEdit(seguroId)}
                  >
                    Editar
                  </button>
                  <button
                    className="px-4 py-2 botones text-white rounded"
                    onClick={() => handlerInfo(seguroId)}
                  >
                    Ver más
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center p-8 text-gray-500">
            No se encontraron seguros para esta aseguradora
          </div>
        )}
      </div>

      {/* Botones de paginación */}
      {filteredSeguros.length > 0 && (
        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="px-4 py-2 botones text-white rounded disabled:bg-gray-400"
          >
            Anterior
          </button>
          <button
            onClick={handleNextPage}
            disabled={
              (currentPage + 1) * itemsPerPage >= filteredSeguros.length
            }
            className="px-4 py-2 botones text-white rounded disabled:bg-gray-400"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
};

export default VerMasAseguradora;
