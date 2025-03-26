import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const VerMasAseguradora = () => {

 const navigate = useNavigate();

  const aseguradoras = [
    { name: "Seguro Total", date: "12-02-2024" },
    { name: "Seguro Plus", date: "12-02-2024" },
    { name: "Seguro Premium", date: "12-02-2024" },
    { name: "Seguro Básico", date: "12-02-2024" },
    { name: "Seguro Familiar", date: "12-02-2024" },
    { name: "Seguro Empresarial", date: "12-02-2024" },
    { name: "Seguro Viajero", date: "12-02-2024" },
    { name: "Seguro Salud", date: "12-02-2024" },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [checkedItems, setCheckedItems] = useState({});
  const itemsPerPage = 4;

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
    aseguradora.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentItems = filteredAseguradoras.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handlerNavgigationEdit = () => {
    navigate('/aseguradoras/seguros/editar')
  };

  const handlerInfo = () => {
    navigate('/aseguradoras/seguros/informacion')
  };

  const handlerAdd = () => {
    navigate("/aseguradoras/seguros/agregar")
  }

  //Switch alert
  const handleToggleSwitch = (index) => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
        cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
      },
      buttonsStyling: false
    });
  
    const isCurrentlyChecked = checkedItems[index] || false; // Verifica el estado actual
  
    swalWithTailwindButtons.fire({
      title: isCurrentlyChecked ? "¿Desea desactivar este seguro?" : "¿Desea activar este seguro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: isCurrentlyChecked ? "Sí, desactivarlo" : "¡Sí, quiero activarlo!",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Comenta esta parte para probar los botones sin necesidad de un backend activo
          /*
          const response = await axios.put(`http://localhost:3000/api/seguros/${index}`, {
            active: !isCurrentlyChecked, // Envía el nuevo estado al backend
          });
  
          if (response.status === 200) {
            swalWithTailwindButtons.fire({
              title: isCurrentlyChecked ? "¡Seguro desactivado!" : "¡Seguro activado!",
              icon: "success",
            });
  
            setCheckedItems((prevState) => ({
              ...prevState,
              [index]: !prevState[index], // Alterna el estado del switch
            }));
          } else {
            swalWithTailwindButtons.fire("Error", "Hubo un problema al actualizar el estado del seguro.", "error");
          }
          */
  
          // Para probar sin backend, descomenta la siguiente línea:
          swalWithTailwindButtons.fire({
            title: isCurrentlyChecked ? "¡Seguro desactivado!" : "¡Seguro activado!",
            icon: "success",
          });
  
          setCheckedItems((prevState) => ({
            ...prevState,
            [index]: !prevState[index], // Alterna el estado del switch
          }));
  
        } catch (error) {
          console.error("Error al actualizar el estado del seguro:", error);
          swalWithTailwindButtons.fire("Error", "Ocurrió un error inesperado.", "error");
        }
      }
    });
  };


  return (
    <div className="min-h-screen flex flex-col p-4 overflow-hidden">
      {/* Encabezado y barra de búsqueda */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <div className="w-16 h-16 bg-gray-300 rounded-lg"></div>
          <div className="flex flex-col">
            <p>Nombre de la aseguradora</p>
            <p>Nombre del contacto</p>
            <p>Teléfono del contacto</p>
            <p>Correo electrónico del contacto</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            placeholder="Buscar..."
            className="px-4 py-2 border rounded w-full md:w-auto"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
        {currentItems.map((seguro, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center justify-between p-4 md:p-6 border rounded shadow-lg mt-3 bg-white"
          >
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-400 rounded-full"></div>
              <div>
                <p className="text-lg font-semibold">{seguro.name}</p>
                <p className="text-gray-600">{seguro.date}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <label className="switch">
                <input type="checkbox"
                 className="hidden" 
                 checked={checkedItems[index]||false}
                 onChange={()=> handleToggleSwitch(index)}/>
                <span className="slider round"></span>
              </label>
              <button
                className="px-4 py-2 botones text-white rounded"
                onClick={handlerNavgigationEdit}
              >
                Editar
              </button>
              <button
                className="px-4 py-2 botones text-white rounded"
                onClick={handlerInfo}
              >
                Ver más
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Botones de paginación */}
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
            (currentPage + 1) * itemsPerPage >= filteredAseguradoras.length
          }
          className="px-4 py-2 botones text-white rounded disabled:bg-gray-400"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default VerMasAseguradora;