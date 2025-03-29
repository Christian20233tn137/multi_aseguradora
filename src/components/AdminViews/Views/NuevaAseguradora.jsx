import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const NuevaAseguradora = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    informacion: "",
    seguros: "",
    nombreContacto: "",
    correoContacto: "",
    telefonoContacto: ""
  });

  const handleRegresar = () => {
    navigate("/aseguradoras"); // 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
      cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
    },
    buttonsStyling: false
  });

  const handleSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:3000/nar/aseguradoras", formData);

      swalWithTailwindButtons.fire({
        title: response.status === 200 ? "¡Aceptado!" : "Error",
        text: response.status === 200
          ? "La aseguradora fue registrada con éxito"
          : "Hubo un problema al enviar los datos",
        icon: response.status === 200 ? "success" : "error"
      });

      if (response.status === 200) navigate("/aseguradoras");
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  const showAlert = () => {
    swalWithTailwindButtons.fire({
      title: "¿Deseas agregar esta aseguradora?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, quiero aceptarlo!",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) handleSubmit();
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nombre del contacto"
              value={formData.nombreContacto}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nombre*
            </label>
            <input
              type="text"
              name="nombre"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Información
            </label>
            <textarea
              name="informacion"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Información"
              value={formData.informacion}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Seguros
            </label>
            <textarea
              name="seguros"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Seguros"
              value={formData.seguros}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Teléfono del contacto*
            </label>
            <input
              type="text"
              name="telefonoContacto"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Teléfono del contacto"
              value={formData.telefonoContacto}
              onChange={handleChange}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Correo electrónico del contacto*
            </label>
            <input
              type="email"
              name="correoContacto"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
