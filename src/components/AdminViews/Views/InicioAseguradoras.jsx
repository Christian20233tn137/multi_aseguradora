import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";

const swalWithTailwindButtons = Swal.mixin({
  customClass: {
    confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
    cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
  },
  buttonsStyling: false,
  reverseButtons: true,
  confirmButtonText: "Confirmar",
  cancelButtonText: "Cancelar"
});

const InicioAseguradoras = () => {

    const location = useLocation();
    const id = location.state?.id;
    console.log("Prueba", id); 

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
        const response = await axios.get("http://localhost:3000/nar/aseguradoras");
        setAseguradoras(response.data);

        // Cargar estado desde localStorage
        const storedState = JSON.parse(localStorage.getItem("checkedItemsAseguradoras")) || {};

        // Inicializar el estado de los switches
        const initialCheckedItems = {};
        response.data.forEach((aseguradora) => {
          initialCheckedItems[aseguradora._id] = storedState[aseguradora._id] ?? aseguradora.active;
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
          const response = await axios.get(`http://localhost:3000/nar/aseguradoras/id/${aseguradora._id}`);
          segurosData[aseguradora._id] = response.data;
        } catch (error) {
          if (error.response && error.response.status === 404) {
            console.error(`Recurso no encontrado para ${aseguradora.nombre}:`, error);
          } else {
            console.error(`Error al obtener seguros para ${aseguradora.nombre}:`, error);
          }
        }
      }
      setSeguros(segurosData);
    };

    fetchSeguros();
  }, [aseguradoras]);

  const handlerNavigation = () => navigate("/aseguradoras/nuevaAseguradora");
  const handlerInfo = () => navigate("/aseguradoras/seguros");

  const handlerNavigationEdit = (id, aseguradora) => {
    if (id) {
      navigate(`editar/${id}`, { state: { aseguradora } });
    } else {
      console.error("ID de aseguradora no definido");
    }
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(filteredAseguradoras.length / itemsPerPage) - 1)
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

    swalWithTailwindButtons.fire({
      title: isActive
        ? "¿Desea desactivar esta aseguradora?"
        : "¿Desea activar esta aseguradora?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isActive
        ? "Sí, desactivarlo"
        : "¡Sí, quiero activarlo!",
    }).then(async (result) => {
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
              localStorage.setItem("checkedItemsAseguradoras", JSON.stringify(newState)); // Guardar en localStorage
              return newState;
            });

            setAseguradoras((prevAseguradoras) =>
              prevAseguradoras.map((aseguradora) =>
                aseguradora._id === aseguradoraId ? { ...aseguradora, active: !isActive } : aseguradora
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
          console.error("Error al actualizar el estado de la aseguradora:", error);
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
          className="px-6 py-3 text-white botones w-full md:w-auto order-last md:order-none"
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
          className="px-4 py-3 w-full md:w-auto border rounded order-first md:order-none"
        />
      </div>
      <div className="border-0 p-6 space-y-6">
        {currentItems.length > 0 ? (
          currentItems.map((aseguradora) => (
            <div
              key={aseguradora._id}
              className="flex flex-col md:flex-row items-center justify-between border rounded-lg p-6 shadow-md"
            >
              <div className="flex items-center mb-6 md:mb-0">
                <div className="w-16 h-16 bg-gray-400 rounded-full mr-6"></div>
                <div>
                  <p className="text-xl font-semibold">{aseguradora.nombre}</p>
                  <p className="text-gray-600 text-lg">

                  </p>
                  <div>
                    <h3 className="text-lg font-semibold mt-4">Seguros: <p>{aseguradora.informacion}</p></h3>
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
              <div className="flex items-center space-x-6">
                <label className="switch">
                  <input
                    type="checkbox"
                    className="hidden"
                    checked={checkedItems[aseguradora._id] || false}
                    onChange={() => handleToggleSwitch(aseguradora._id, checkedItems[aseguradora._id])}
                  />
                  <span className="slider round"></span>
                </label>
                <button
                  className="px-6 py-3 text-white botones"
                  onClick={() =>
                    handlerNavigationEdit(aseguradora._id, aseguradora)
                  }
                >
                  Editar
                </button>
                <button
                  className="px-6 py-3 text-white botones"
                  onClick={() =>
                    navigate(`/aseguradoras/seguros`, {
                      state: { aseguradora, idAseguradora: aseguradora._id, id : id },
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
          disabled={(currentPage + 1) * itemsPerPage >= filteredAseguradoras.length}
          className="px-6 py-3 text-white botones"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default InicioAseguradoras;
