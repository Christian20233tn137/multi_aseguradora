import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";

const swalWithTailwindButtons = Swal.mixin({
  customClass: {
    confirmButton:
      "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
    cancelButton:
      "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2",
  },
  buttonsStyling: false,
  reverseButtons: true,
  confirmButtonText: "Confirmar",
  cancelButtonText: "Cancelar",
});

const InicioAseguradoras = () => {
  const location = useLocation();
  const id = location.state?.id;
  console.log("Id del admin: ", id);

  const navigate = useNavigate();
  const [aseguradoras, setAseguradoras] = useState([]);
  const [seguros, setSeguros] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 3;
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    const fetchAseguradoras = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/nar/aseguradoras"
        );
        setAseguradoras(response.data);

        // Cargar estado desde localStorage
        const storedState =
          JSON.parse(localStorage.getItem("checkedItemsAseguradoras")) || {};

        // Inicializar el estado de los switches
        const initialCheckedItems = {};
        response.data.forEach((aseguradora) => {
          initialCheckedItems[aseguradora._id] =
            storedState[aseguradora._id] !== undefined
              ? storedState[aseguradora._id]
              : aseguradora.active === "activo";
        });

        setCheckedItems(initialCheckedItems);
      } catch (error) {
        console.error("Error al obtener aseguradoras:", error);
      }
    };

    fetchAseguradoras();
  }, []);

  useEffect(() => {
    const fetchSeguros = async () => {
      const segurosData = {};
      for (const aseguradora of aseguradoras) {
        try {
          const response = await axios.get(
            `http://localhost:3000/nar/aseguradoras/id/${aseguradora._id}`
          );
          segurosData[aseguradora._id] = response.data;
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.error(
              `Recurso no encontrado para ${aseguradora.nombre}:`,
              error
            );
          } else {
            console.error(
              `Error al obtener seguros para ${aseguradora.nombre}:`,
              error
            );
          }
        }
      }
      setSeguros(segurosData);
    };

    fetchSeguros();
  }, [aseguradoras]);

  const handlerNavigation = () => {
    navigate("/aseguradoras/nuevaAseguradora", { state: { id: id } });
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(
        prevPage + 1,
        Math.ceil(filteredAseguradoras.length / itemsPerPage) - 1
      )
    );
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const filteredAseguradoras = aseguradoras.filter((aseguradora) =>
    aseguradora.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentItems = filteredAseguradoras.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleToggleSwitch = async (aseguradoraId, isActive) => {
    const action = isActive ? "inactive" : "active";

    swalWithTailwindButtons
      .fire({
        title: isActive
          ? "¿Desea desactivar esta aseguradora?"
          : "¿Desea activar esta aseguradora?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: isActive
          ? "Sí, desactivarlo"
          : "¡Sí, quiero activarlo!",
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const endpoint = `http://localhost:3000/nar/aseguradoras/${action}/${aseguradoraId}`;
            const response = await axios.put(endpoint);

            if (response.status === 200) {
              swalWithTailwindButtons.fire({
                title: isActive
                  ? "¡Aseguradora desactivada!"
                  : "¡Aseguradora activada!",
                icon: "success",
              });

              setCheckedItems((prevState) => {
                const newState = {
                  ...prevState,
                  [aseguradoraId]: !isActive,
                };
                localStorage.setItem(
                  "checkedItemsAseguradoras",
                  JSON.stringify(newState)
                ); // Guardar en localStorage
                return newState;
              });

              setAseguradoras((prevAseguradoras) =>
                prevAseguradoras.map((aseguradora) =>
                  aseguradora._id === aseguradoraId
                    ? { ...aseguradora, active: !isActive ? "activo" : "inactivo" }
                    : aseguradora
                )
              );
            } else {
              swalWithTailwindButtons.fire(
                "Error",
                "Hubo un problema al actualizar el estado de la aseguradora.",
                "error"
              );
            }
          } catch (error) {
            console.error(
              "Error al actualizar el estado de la aseguradora:",
              error
            );
            swalWithTailwindButtons.fire(
              "Error",
              error.response?.data?.message || "Ocurrió un error inesperado.",
              "error"
            );
          }
        }
      });
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
        <button
          className="px-6 py-2 text-white botones w-full md:w-auto order-last md:order-none"
          onClick={handlerNavigation}
        >
          + Agregar
        </button>
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
          className="px-4 py-2 w-full sm:w-auto border-0 shadow-md rounded-lg mb-2 sm:mb-0 sm:ml-auto"
        />
      </div>
      <div className="border-0 p-6 space-y-6">
        {currentItems.length > 0 ? (
          currentItems.map((aseguradora) => (
            <div
              key={aseguradora._id}
              className="flex flex-col sm:flex-row items-center border-0 shadow-md rounded-lg p-4 mb-4"
            >
              <div className="flex  items-center mb-6 md:mb-0">
                <div>
                  <p className="text-xl font-semibold">{aseguradora.nombre}</p>
                  <p className="text-gray-600 text-lg"></p>
                  <div>
                    <h3 className="text-lg font-semibold mt-4">
                      Informacion: <p>{aseguradora.informacion}</p>
                    </h3>
                    <ul>
                      {Array.isArray(seguros[aseguradora._id])
                        ? seguros[aseguradora._id].map((seguro, index) => (
                            <li key={index}>{seguro.name}</li>
                          ))
                        : null}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="ml-auto self-stretch sm:self-auto">
                <label className="switch mr-2">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={checkedItems[aseguradora._id] || false}
                    onChange={() =>
                      handleToggleSwitch(
                        aseguradora._id,
                        checkedItems[aseguradora._id]
                      )
                    }
                  />
                  <span className="slider round"></span>
                </label>
                <button
                  className="px-6 py-2 mr-2 text-white rounded botones mt-2 sm:mt-0 w-full sm:w-auto"
                  onClick={() =>
                    navigate("/aseguradoras/editar", {
                      state: { id: id, aseguradoraId: aseguradora._id },
                    })
                  }
                >
                  Editar
                </button>
                <button
                  className="px-6 py-2 text-white rounded botones mt-2 sm:mt-0 w-full sm:w-auto"
                  onClick={() =>
                    navigate(`/aseguradoras/seguros`, {
                      state: {
                        aseguradora,
                        idAseguradora: aseguradora._id,
                        id: id,
                      },
                    })
                  }
                >
                  Ver más
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Cargando aseguradoras...</p>
        )}
      </div>
      <div className="flex justify-between mt-6">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="px-6 py-3 text-white botones"
        >
          Anterior
        </button>
        <button
          onClick={handleNextPage}
          disabled={
            (currentPage + 1) * itemsPerPage >= filteredAseguradoras.length
          }
          className="px-6 py-3 text-white botones"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default InicioAseguradoras;
