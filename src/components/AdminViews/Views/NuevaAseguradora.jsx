import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const NuevaAseguradora = () => {
  const location = useLocation();
  const id = location.state?.id;
  console.log("Prueba", id);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    informacion: "",
    seguros: "",
    nombreContacto: "",
    correoContacto: "",
    telefonoContacto: "",
  });

  const handleRegresar = () => {
    navigate("/aseguradoras", { state: { id: id } });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton:
        "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
      cancelButton:
        "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2",
    },
    buttonsStyling: false,
  });

  const handleSubmit = async () => {
    // Deshabilitar botones y mostrar loader
    Swal.fire({
      title: "Enviando...",
      icon: "info",
      text: "Por favor, espere.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await axios.post(
        "http://localhost:3000/nar/aseguradoras",
        formData
      );

      // Cerrar loader
      Swal.close();

      swalWithTailwindButtons.fire({
        title: response.status === 200 ? "¡Aceptado!" : "Error",
        text:
          response.status === 200
            ? "La aseguradora fue registrada con éxito"
            : "Hubo un problema al enviar los datos",
        icon: response.status === 200 ? "success" : "error",
      });

      if (response.status === 200)
        navigate("/aseguradoras", { state: { id: id } });
    } catch (error) {
      // Cerrar loader en caso de error
      Swal.close();
      console.error("Error al enviar los datos:", error);
      swalWithTailwindButtons.fire({
        title: "Error",
        text: "Hubo un problema al enviar los datos",
        icon: "error",
      });
    }
  };

  const showAlert = () => {
    swalWithTailwindButtons
      .fire({
        title: "¿Deseas agregar esta aseguradora?",
        text: "No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, quiero agregarla!",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed)
          swalWithTailwindButtons.fire({
            title: "Agregando aseguradora...",
            text: "Por favor, espere.",
            icon: "info",
            allowOutsideClick: false,
            showConfirmButton: false,
          });
        handleSubmit();
      });
  };

  return (
    <div className="flex items-center justify-center w-auto h-auto p-6">
      <div className="bg-white p-8 rounded w-full max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nombre del contacto*
            </label>
            <input
              type="text"
              name="nombreContacto"
              className="border-0 shadow-md rounded-lg py-2 px-3 w-full"
              placeholder="Nombre del contacto"
              value={formData.nombreContacto}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4 md:col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nombre*
            </label>
            <input
              type="text"
              name="nombre"
              className="border-0 shadow-md rounded-lg py-2 px-3 w-full"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4 md:col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Información
            </label>
            <input
              type="text"
              name="informacion"
              className="border-0 shadow-md rounded-lg py-2 px-3 w-full"
              placeholder="Información"
              value={formData.informacion}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4 md:col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Seguros
            </label>
            <input
              type="text"
              name="seguros"
              className="border-0 shadow-md rounded-lg py-2 px-3 w-full"
              placeholder="Seguros"
              value={formData.seguros}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4 md:col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Teléfono del contacto*
            </label>
            <input
              type="text"
              name="telefonoContacto"
              className="border-0 shadow-md rounded-lg py-2 px-3 w-full"
              placeholder="Teléfono del contacto"
              value={formData.telefonoContacto}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4 md:col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Correo electrónico del contacto*
            </label>
            <input
              type="email"
              name="correoContacto"
              className="border-0 shadow-md rounded-lg py-2 px-3 w-full"
              placeholder="Correo electrónico del contacto"
              value={formData.correoContacto}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-2 flex items-center justify-center">
            <button
              type="button"
              className="botones text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-2"
              onClick={handleRegresar}
            >
              Regresar
            </button>

            <button
              type="button"
              className="botones text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-2"
              onClick={showAlert}
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevaAseguradora;
