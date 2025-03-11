import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const NuevaAseguradora = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    logo: null,
    nombreContacto: "",
    nombre: "",
    telefonoContacto: "",
    correoContacto: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      logo: e.target.files[0]
    });
  };

  const handleSubmit = async () => {
    try {
      // Aquí ando prbando uniones de para el back
      const response = await fetch("/api/aseguradoras", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.ok) {
        Swal.fire({
          title: "Aceptado!",
          text: "El postulante fue aceptado con éxito",
          icon: "success"
        });
        navigate("/aseguradoras");
      } else {
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al enviar los datos",
          icon: "error"
        });
      }
    } catch (error) {
      console.error("Error al enviar los datos:", error);
    }
  };

  const showAlert = () => {
    Swal.fire({
      title: "Deseas agregar esta aseguradora?",
      text: "No podras revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si quiero aceptarlo!"
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmit();
      }
    });
  };

  return (
    <div className="flex items-center justify-center w-auto h-auto p-6">
      <div className="bg-white p-8 rounded w-full max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Logo*
            </label>
            <input
              type="file"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleFileChange}
            />
          </div>
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
              className="botones text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
