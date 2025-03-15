import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditarAseguradora = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/aseguradoras");
  };

  const handleEditSubmit = async () => {
    try {
      // Simulación de envío de datos
      const response = await fetch("/api/aseguradoras", {
        method: "PUT", // Usamos PUT para edición
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mensaje: "Datos actualizados" }),
      });

      if (response.ok) {
        Swal.fire({
          title: "¡Editado!",
          text: "La aseguradora se editó con éxito.",
          icon: "success",
        }).then(() => {
          handleBack();
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al editar la aseguradora.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al editar:", error);
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error inesperado.",
        icon: "error",
      });
    }
  };

  const showEditAlert = () => {
    Swal.fire({
      title: "¿Deseas guardar los cambios?",
      text: "Se actualizará la aseguradora.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, guardar cambios",
    }).then((result) => {
      if (result.isConfirmed) {
        handleEditSubmit();
      }
    });
  };

  return (
    <div className="flex items-center justify-center w-auto h-auto p-6">
      <div className="bg-white p-8 rounded w-full max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Editar Aseguradora</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Logo*
            </label>
            <input
              type="file"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nombre del contacto*
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nombre del contacto"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nombre*
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nombre"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Teléfono del contacto*
            </label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Teléfono del contacto"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Correo electrónico del contacto*
            </label>
            <input
              type="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Correo electrónico del contacto"
            />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <button
              type="button"
              className="botones text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={showEditAlert}
            >
              Editar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarAseguradora;
