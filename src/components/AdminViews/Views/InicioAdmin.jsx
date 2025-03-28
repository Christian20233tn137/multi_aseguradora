import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const InicioAdmin = () => {
  const navigate = useNavigate();
  const [administradores, setAdministradores] = useState([]);

  useEffect(() => {
    const fetchAdministradores = async () => {
      try {
        const response = await axios.get("http://localhost:3000/nar/usuarios");
        const admins = response.data.filter((user) => user.rol === "administrador");
        setAdministradores(admins);
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

  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 3;
  const [checkedItems, setCheckedItems] = useState({});

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
    administrador.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentItems = filteredAdministradores.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // Switch Alert
  const handleToggleSwitch = (index) => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        confirmButton:
          "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
        cancelButton:
          "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2",
      },
      buttonsStyling: false,
    });

    const isCurrentlyChecked = checkedItems[index] || false;

    swalWithTailwindButtons
      .fire({
        title: isCurrentlyChecked
          ? "¿Desea desactivar este administrador?"
          : "¿Desea activar este administrador?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: isCurrentlyChecked
          ? "Sí, desactivarlo"
          : "¡Sí, quiero activarlo!",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            // Comenta esta parte para probar los botones sin necesidad de un backend activo
            /*
            const response = await axios.put(`http://localhost:3000/api/administradores/${index}`, {
              active: !isCurrentlyChecked, // Envía el nuevo estado al backend
            });

            if (response.status === 200) {
              swalWithTailwindButtons.fire({
                title: isCurrentlyChecked
                  ? "¡Administrador desactivado!"
                  : "¡Administrador activado!",
                icon: "success",
              });

              setCheckedItems((prevState) => ({
                ...prevState,
                [index]: !prevState[index], // Alterna el estado del switch
              }));
            } else {
              swalWithTailwindButtons.fire("Error", "Hubo un problema al actualizar el estado del administrador.", "error");
            }
            */

            // Para probar sin backend, descomenta la siguiente línea:
            swalWithTailwindButtons.fire({
              title: isCurrentlyChecked
                ? "¡Administrador desactivado!"
                : "¡Administrador activado!",
              icon: "success",
            });

            setCheckedItems((prevState) => ({
              ...prevState,
              [index]: !prevState[index], // Alterna el estado del switch
            }));
          } catch (error) {
            console.error(
              "Error al actualizar el estado del administrador:",
              error
            );
            swalWithTailwindButtons.fire(
              "Error",
              "Ocurrió un error inesperado.",
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
        {currentItems.map((administrador, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center justify-between border rounded-lg p-6 shadow-md"
          >
            <div className="flex items-center mb-6 md:mb-0">
              <div>
                <p className="text-xl font-semibold">{administrador.nombre}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <label className="switch">
                <input
                  type="checkbox"
                  className="hidden"
                  checked={checkedItems[index] || false}
                  onChange={() => handleToggleSwitch(index)}
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
                onClick={handleNavigateInfo}
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
