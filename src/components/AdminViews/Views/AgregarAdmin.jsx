import React, { useState } from "react";
import Swal from "sweetalert2";

const Cotizar = () => {
  // Estados editables
  const [nombre, setNombre] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [correoElectronico, setCorreoElectronico] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [telefono, setTelefono] = useState("");

  // Función para enviar la cotización al backend
  const agregarCotizacion = async () => {
    try {
      const response = await fetch("/api/cotizaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          fechaNacimiento,
          correoElectronico,
          apellidoPaterno,
          apellidoMaterno,
          telefono,
        }),
      });

      if (response.ok) {
        Swal.fire("Cotización Enviada", "La cotización se envió correctamente.", "success");
        // Opcional: limpiar el formulario
        setNombre("");
        setFechaNacimiento("");
        setCorreoElectronico("");
        setApellidoPaterno("");
        setApellidoMaterno("");
        setTelefono("");
      } else {
        Swal.fire("Error", "Hubo un problema al enviar la cotización.", "error");
      }
    } catch (error) {
      console.error("Error al cotizar:", error);
      Swal.fire("Error", "Ocurrió un error inesperado.", "error");
    }
  };

  // Confirmación con SweetAlert
  const confirmarCotizacion = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres enviar esta cotización?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, enviar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        agregarCotizacion();
      }
    });
  };

  return (
    <div className="p-6 w-full h-auto overflow-hidden">
      <h1 className="text-3xl w-full p-3 text-center font-normal text-black miColor rounded-2xl">
        Datos del titular
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

      {/* Botón Cotizar */}
      <div className="flex items-center justify-center mt-6">
        <button
          type="button"
          className="text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          style={{ backgroundColor: "#0B1956" }}
          onClick={confirmarCotizacion}
        >
          Cotizar
        </button>
      </div>
    </div>
  );
};

export default Cotizar;
