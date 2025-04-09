import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const InicioAdmin = () => {
  const navigate = useNavigate();
  const [administradores, setAdministradores] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 4;
  const [checkedItems, setCheckedItems] = useState({});
  const location = useLocation();
  const id = location.state?.id;
  console.log(id);

  useEffect(() => {
    const fetchAdministradores = async () => {
      try {
        const response = await axios.get("http://localhost:3001/nar/usuarios");
        const admins = response.data.filter(
          (user) => user.rol === "administrador"
        );
        setAdministradores(admins);

        // Cargar estado desde localStorage
        const storedState =
          JSON.parse(localStorage.getItem("checkedItems")) || {};

        // Inicializar el estado de los switches
        const initialCheckedItems = {};
        admins.forEach((admin) => {
          initialCheckedItems[admin._id] =
            storedState[admin._id] !== undefined
              ? storedState[admin._id]
              : admin.estado === "activo";
        });

        setCheckedItems(initialCheckedItems);
      } catch (error) {
        console.error("Error al obtener los administradores", error);
      }
    };

    fetchAdministradores();
  }, []);

  const handleEditar = (idAdmin) => {
    if (id) {
      navigate(`editar`, { state: { id: id, idAdmin: idAdmin } });
    } else {
      console.error("El id del administrador no está definido");
      console.log(id);
    }
  };

  const handleAgregar = () => {
    navigate("/administradores/agregar", { state: { id: id } });
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
    `${administrador.nombre} ${administrador.apellidoPaterno} ${administrador.apellidoMaterno}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
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
          swalWithTailwindButtons.fire({
            title: "Realizando cambios..",
            icon: "info",
            text: "Por favor, espere.",
            allowOutsideClick: false,
            showConfirmButton: false,
          });
          try {
            const endpoint = `http://localhost:3001/nar/usuarios/${action}/${adminId}`;
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
                  admin._id === adminId
                    ? { ...admin, estado: !isActive ? "activo" : "inactivo" }
                    : admin
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
            console.error(
              "Error al actualizar el estado del administrador:",
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
          className="px-4 py-2 w-full sm:w-auto border-0 shadow-md rounded-lg mb-2 sm:mb-0 sm:ml-auto"
        />
      </div>
      <div className="border-0 p-6 space-y-6">
        {currentItems.map((administrador) => (
          <div
            key={administrador._id}
            className="flex flex-col sm:flex-row items-center border-0 shadow-md rounded-lg p-4 mb-4"
          >
            <div className="flex items-center mb-6 md:mb-0">
              <div>
                <p className="text-base font-semibold">{`${administrador.nombre} ${administrador.apellidoPaterno} ${administrador.apellidoMaterno}`}</p>
              </div>
            </div>
            <div className="ml-auto self-stretch sm:self-auto">
              <label className="switch mr-2">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={checkedItems[administrador._id] || false}
                  onChange={() =>
                    handleToggleSwitch(
                      administrador._id,
                      checkedItems[administrador._id]
                    )
                  }
                />
                <span className="slider round"></span>
              </label>
              <button
                className="px-6 py-2 mr-2 text-white rounded botones mt-2 sm:mt-0 w-full sm:w-auto"
                onClick={() => handleEditar(administrador._id)}
              >
                Editar
              </button>
              <button
                className="px-6 py-2 text-white rounded botones mt-2 sm:mt-0 w-full sm:w-auto"
                onClick={() =>
                  navigate(`/administradores/informacion`, {
                    state: { id: id, idAdmin: administrador._id },
                  })
                }
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
