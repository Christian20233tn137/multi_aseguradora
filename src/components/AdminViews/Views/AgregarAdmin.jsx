import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AgregarAdmin = () => {
  // Estados editables
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rfc, setRfc] = useState("");
  const [curp, setCurp] = useState("");

  // Función para enviar la cotización al backend
  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
      cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
    },
    buttonsStyling: false
  });

  const agregarCotizacion = async () => {
    // Validación básica
    if (!nombre || !correo || !apellidoPaterno || !telefono || !rfc || !curp) {
      swalWithTailwindButtons.fire("Error", "Todos los campos marcados con * son obligatorios.", "error");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/nar/usuarios/admin", {
        nombre,
        correo,
        apellidoPaterno,
        apellidoMaterno,
        telefono,
        rfc,
        curp,
      });

      if (response.status === 200) {
        swalWithTailwindButtons.fire("Administrador agregado", "El administrador se registró correctamente.", "success");
        // Opcional: limpiar el formulario
        setNombre("");
        setCorreo("");
        setApellidoPaterno("");
        setApellidoMaterno("");
        setTelefono("");
        setRfc("");
        setCurp("");
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {[
          { label: "Nombre*", value: nombre, setValue: setNombre, type: "text", placeholder: "Nombre" },
          { label: "Apellido paterno*", value: apellidoPaterno, setValue: setApellidoPaterno, type: "text", placeholder: "Apellido Paterno" },
          { label: "Apellido materno", value: apellidoMaterno, setValue: setApellidoMaterno, type: "text", placeholder: "Apellido Materno" },
          { label: "Teléfono*", value: telefono, setValue: setTelefono, type: "text", placeholder: "Teléfono" },
          { label: "Correo electrónico*", value: correo, setValue: setCorreo, type: "email", placeholder: "Correo electrónico" },
          { label: "RFC*", value: rfc, setValue: setRfc, type: "text", placeholder: "RFC" },
          { label: "CURP*", value: curp, setValue: setCurp, type: "text", placeholder: "CURP" },
        ].map((field, index) => (
          <div key={index} className="flex flex-col">
            <label className="text-gray-700 text-sm font-bold mb-2">{field.label}</label>
            <input
              className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type={field.type}
              value={field.value}
              onChange={(e) => field.setValue(e.target.value)}
              placeholder={field.placeholder}
            />
          </div>
        ))}
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
