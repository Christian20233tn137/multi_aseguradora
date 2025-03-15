import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const InicioAseguradoras = () => {
  const navigate = useNavigate();

  const handlerNavgigation = () => {
    navigate("/aseguradoras/nuevaAseguradora");
  };

  const handlerInfo = () => {
    navigate("/aseguradoras/seguros");
    console.log("Informacion");
  };

  const handlerNavgigationEdit = () => {
    navigate("/aseguradoras/editar-Aseguradora");
    console.log("Probando");
  };

  const aseguradoras = [
    { name: "Nombre de la aseguradora 1", date: "12-02-2024" },
    { name: "Nombre de la aseguradora 2", date: "12-02-2024" },
    { name: "Nombre de la aseguradora 3", date: "12-02-2024" },
    { name: "Nombre de la aseguradora 4", date: "12-02-2024" },
    { name: "Nombre de la aseguradora 5", date: "12-02-2024" },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 3;
  const [checkedItems, setCheckedItems] = useState({});

  const handleNextPage = () => {
    setCurrentPage((prevPage) =>
      Math.min(prevPage + 1, Math.ceil(aseguradoras.length / itemsPerPage) - 1)
    );
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const currentItems = aseguradoras.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

 //Switch alert
   const handleToggleSwitch = (index) => {
     const isCurrentlyChecked = checkedItems[index] || false; // Verifica el estado actual
   
     Swal.fire({
       title: isCurrentlyChecked ? "¿Desea desactivar esta aseguradora?" : "¿Desea activar esta aseguradora?",
       icon: "warning",
       showCancelButton: true,
       confirmButtonColor: "#3085d6",
       cancelButtonColor: "#d33",
       confirmButtonText: isCurrentlyChecked ? "Sí, desactivarlo" : "¡Sí, quiero activarlo!",
     }).then((result) => {
       if (result.isConfirmed) {
         Swal.fire({
           title: isCurrentlyChecked ? "¡Aseguradora desactivada!" : "¡Aseguradora activada!",
           icon: "success",
         });
   
         setCheckedItems((prevState) => ({
           ...prevState,
           [index]: !prevState[index], // Alterna el estado del switch
         }));
       }
     });
   };

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row items-center mb-4 space-y-4 md:space-y-0 md:space-x-4">
        <input
          type="text"
          placeholder="Buscar..."
          className="px-4 py-3 w-full md:w-auto border rounded order-first md:order-none"
        />
        <button className="px-6 py-3 text-white botones w-full md:w-auto" onClick={handlerNavgigation}>
          + Agregar
        </button>
      </div>
      <div className="border-0 p-6 space-y-6">
        {currentItems.map((aseguradora, index) => (
          <div
            key={index}
            className="flex flex-col md:flex-row items-center justify-between border rounded-lg p-6 shadow-md"
          >
            <div className="flex items-center mb-6 md:mb-0">
              <div className="w-16 h-16 bg-gray-400 rounded-full mr-6"></div>
              <div>
                <p className="text-xl font-semibold">{aseguradora.name}</p>
                <p className="text-gray-600 text-lg">{aseguradora.date}</p>
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
              <button className="px-6 py-3 text-white botones" onClick={handlerNavgigationEdit}>
                Editar
              </button>
              <button className="px-6 py-3 text-white botones" onClick={handlerInfo}>
                Ver más
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-6">
        <button onClick={handlePrevPage} disabled={currentPage === 0} className="px-6 py-3 text-white botones">
          Anterior
        </button>
        <button
          onClick={handleNextPage}
          disabled={(currentPage + 1) * itemsPerPage >= aseguradoras.length}
          className="px-6 py-3 text-white botones"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default InicioAseguradoras;
