import React, { useState } from "react";
import Swal from "sweetalert2";

const AgregarAdmin = () => {
  // Estados editables
  const [nombre, setNombre] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [telefono, setTelefono] = useState("");

  // Función para enviar la cotización al backend
  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
      cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
    },
    buttonsStyling: false
  });
  
  const agregarCotizacion = async () => {
    try {
      // Comenta esta parte para probar los botones sin necesidad de un backend activo
      /*
      const response = await axios.post("/api/cotizaciones", {
        nombre,
        fechaNacimiento,
        correoElectronico,
        apellidoPaterno,
        apellidoMaterno,
        telefono,
      });
      */
  
      // Simula una respuesta exitosa para probar sin backend
      const response = { status: 200 };
  
      if (response.status === 200) {
        swalWithTailwindButtons.fire("Cotización Enviada", "El administrador se resgistró correctamente.", "success");
        // Opcional: limpiar el formulario
        setNombre("");
        setFechaNacimiento("");
        setCorreoElectronico("");
        setApellidoPaterno("");
        setApellidoMaterno("");
        setTelefono("");
      } else {
        swalWithTailwindButtons.fire("Error", "Hubo un problema al registrar el administrador.", "error");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      swalWithTailwindButtons.fire("Error", "Ocurrió un error inesperado.", "error");
    }
  };
  
  // Confirmación con SweetAlert
  const confirmarCotizacion = () => {
    swalWithTailwindButtons.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres registrar a este administrador?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        agregarCotizacion();
      }
    });
  };

  return (
    <div className="p-6 w-full h-auto overflow-hidden">
      <h1 className="text-3xl w-full p-3 text-center font-normal text-black miColor rounded-2xl">
         Agregar Administrador
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-2">Nombre*</label>
          <input
            className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
          />
        </div>

        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-2">Fecha de nacimiento*</label>
          <input
            className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
          />
        </div>

        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-2">Apellido paterno*</label>
          <input
            className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={apellidoPaterno}
            onChange={(e) => setApellidoPaterno(e.target.value)}
            placeholder="Apellido Paterno"
          />
        </div>

        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-16">Apellido materno</label>
          <input
            className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={apellidoMaterno}
            onChange={(e) => setApellidoMaterno(e.target.value)}
            placeholder="Apellido Materno"
          />
        </div>

        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-10">Teléfono*</label>
          <input
            className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            placeholder="Teléfono"
          />
        </div>

        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-10">Correo electrónico*</label>
          <input
            className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="email"
            value={correoElectronico}
            onChange={(e) => setCorreoElectronico(e.target.value)}
            placeholder="Correo electrónico"
          />
        </div>
      </div>

      {/* Botón Agregar*/}
      <div className="flex items-center justify-center mt-6">
        <button
          type="button"
          className="text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          style={{ backgroundColor: "#0B1956" }}
          onClick={confirmarCotizacion}
        >
          Agregar
        </button>
      </div>
    </div>
  );
};

export default AgregarAdmin;
