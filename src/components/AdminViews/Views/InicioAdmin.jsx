import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const InicioAdmin = () => {
  const navigate = useNavigate();

  const handleNavigateInfo = () => {
    navigate("/administradores/informacion");
  };

  const handleEditar = () => {
    navigate("/administradores/editar");
  };

  const handleAgregar = () => {
    navigate("/administradores/agregar");
  };
  const administradores = [
    { name: "Christian Aviles" },
    { name: "Nombre del administrador 2" },
    { name: "Nombre del administrador 3" },
    { name: "Nombre del administrador 4" },
    { name: "Nombre del administrador 5" },
    // Esto después será dinámico con nuestra bd
  ];

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
    administrador.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentItems = filteredAdministradores.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  //Switch Alert
  const handleToggleSwitch = (index) => {
    const isCurrentlyChecked = checkedItems[index] || false;
    Swal.fire({
      title: isCurrentlyChecked
        ? "¿Desea desactivar este administrador?"
        : "¿Desea activar este administrador?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: isCurrentlyChecked
        ? "Sí, desactivarlo"
        : "¡Sí, quiero activarlo! ",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: isCurrentlyChecked
            ? "¡Administrador desactivado!"
            : "¡Administrador activado!",
          icon: "success",
        });
        setCheckedItems((prevState) => ({
          ...prevState,
          [index]: !prevState[index],
        }));
      }
    });
  };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
        <button className="px-6 py-3 text-white botones w-full md:w-auto" onClick={handleAgregar}>
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
                <p className="text-xl font-semibold">{administrador.name}</p>
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
              <button className="px-6 py-3 text-white botones" onClick={handleEditar}>Editar</button>
              <button className="px-6 py-3 text-white botones" onClick={handleNavigateInfo}>Ver más</button>
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
