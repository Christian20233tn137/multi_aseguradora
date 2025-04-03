import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const InicioAdmin = () => {
  const navigate = useNavigate();
  const [administradores, setAdministradores] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 3;
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    const fetchAdministradores = async () => {
      try {
        const response = await axios.get("http://localhost:3000/nar/usuarios");
        const admins = response.data.filter((user) => user.rol === "administrador");
        setAdministradores(admins);

        // Cargar estado desde localStorage
        const storedState = JSON.parse(localStorage.getItem("checkedItems")) || {};

        // Inicializar el estado de los switches
        const initialCheckedItems = {};
        admins.forEach((admin) => {
          initialCheckedItems[admin._id] = storedState[admin._id] ?? admin.active;
        });

        setCheckedItems(initialCheckedItems);
      } catch (error) {
        console.error("Error al obtener los administradores", error);
      }
    };

    fetchAdministradores();
  }, []);

  const handleNavigateInfo = () => {
    navigate("/administradores/informacion");
  };

  const handleEditar = (id, administrador) => {
    if (id) {
      navigate(`editar/${id}`, { state: { administrador } });
    } else {
      console.error("El id del administrador no está definido");
      console.log(id);
    }
  };

  const handleAgregar = () => {
    navigate("/administradores/agregar");
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(
        prevPage + 1,
        Math.ceil(filteredAdministradores.length / itemsPerPage) - 1
      )
    );
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const filteredAdministradores = administradores.filter((administrador) =>
    `${administrador.nombre} ${administrador.apellidoPaterno} ${administrador.apellidoMaterno}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentItems = filteredAdministradores.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Switch Alert
  const handleToggleSwitch = async (adminId, isActive) => {
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
          ? "¿Desea desactivar este administrador?"
          : "¿Desea activar este administrador?",
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
            const endpoint = `http://localhost:3000/nar/usuarios/${action}/${adminId}`;
            const response = await axios.put(endpoint);

            if (response.status === 200) {
              swalWithTailwindButtons.fire({
                title: isActive
                  ? "¡Administrador desactivado!"
                  : "¡Administrador activado!",
                icon: "success",
              });

              setCheckedItems((prevState) => {
                const newState = {
                  ...prevState,
                  [adminId]: !isActive,
                };
                localStorage.setItem("checkedItems", JSON.stringify(newState)); // Guardar en localStorage
                return newState;
              });

              setAdministradores((prevAdmins) =>
                prevAdmins.map((admin) =>
                  admin._id === adminId ? { ...admin, active: !isActive } : admin
                )
              );
            } else {
              swalWithTailwindButtons.fire(
                "Error",
                "Hubo un problema al actualizar el estado del administrador.",
                "error"
              );
            }
          } catch (error) {
            console.error("Error al actualizar el estado del administrador:", error);
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
          className="px-6 py-3 text-white botones w-full md:w-auto"
          onClick={handleAgregar}
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
        {currentItems.map((administrador) => (
          <div
            key={administrador._id}
            className="flex flex-col md:flex-row items-center justify-between border rounded-lg p-6 shadow-md"
          >
            <div className="flex items-center mb-6 md:mb-0">
              <div>
                <p className="text-xl font-semibold">{`${administrador.nombre} ${administrador.apellidoPaterno} ${administrador.apellidoMaterno}`}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <label className="switch">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={checkedItems[administrador._id] || false}
                  onChange={() => handleToggleSwitch(administrador._id, checkedItems[administrador._id])}
                />
                <span className="slider round"></span>
              </label>
              <button
                className="px-6 py-3 text-white botones"
                onClick={() => handleEditar(administrador._id, administrador)}
              >
                Editar
              </button>
              <button
                className="px-6 py-3 text-white botones"
                onClick={() => navigate(`/administradores/informacion/${administrador._id}`)}
              >
                Perfil
              </button>
            </div>
          </div>
        ))}
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
            (currentPage + 1) * itemsPerPage >= filteredAdministradores.length
          }
          className="px-6 py-3 text-white botones"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default InicioAdmin;
