import React, { useState } from "react";
import Swal from "sweetalert2";

const DatosCotizar = () => {
  const [agente, setAgente] = useState({
    nombre: "Juan",
    fechaNacimiento: "",
    correoElectronico: "juan.perez@example.com",
    apellidoPaterno: "Perez",
    apellidoMaterno: "Bosques",
    telefono: "555-1234",
  });
  const [esTitularAsegurado, setEsTitularAsegurado] = useState(true);
  const [asegurado, setAsegurado] = useState({ nombre: "", apellidoPaterno: "", apellidoMaterno: "", fechaNacimiento: "", telefono: "", correoElectronico: "" });

  const handleChange = (e) => {
    setAgente({
      ...agente,
      [e.target.name]: e.target.value,
    });
  };

  const agregarCotizacion = async () => {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¿Deseas enviar esta cotización?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, enviar',
        cancelButtonText: 'Cancelar'
      });

      if (!result.isConfirmed) {
        return; // Si el usuario cancela, no hacemos nada
      }

      const response = await fetch("/api/cotizaciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...agente,
          esTitularAsegurado,
          asegurado: esTitularAsegurado ? null : asegurado,
        }),
      });

      if (response.ok) {
        Swal.fire("Cotización Enviada", "La cotización se envió correctamente.", "success");
        setAgente({ nombre: "", apellidoPaterno: "", apellidoMaterno: "", fechaNacimiento: "", telefono: "", correoElectronico: "" });
        setAsegurado({ nombre: "", apellidoPaterno: "", apellidoMaterno: "", fechaNacimiento: "", telefono: "", correoElectronico: "" });
      } else {
        Swal.fire("Error", "Hubo un problema al enviar la cotización.", "error");
      }
    } catch (error) {
      console.error("Error al cotizar:", error);
      Swal.fire("Error", "Ocurrió un error inesperado.", "error");
    }
  };

  return (
    <div className="p-6 w-full h-auto overflow-hidden">
      <h1 className="text-3xl w-full p-3 text-center font-normal text-black miColor rounded-2xl">Datos del titular</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        <input type="text" name="nombre" placeholder="Nombre" value={agente.nombre} onChange={handleChange} className="border rounded py-2 px-3" />
        <input type="text" name="apellidoPaterno" placeholder="Apellido Paterno" value={agente.apellidoPaterno} onChange={handleChange} className="border rounded py-2 px-3" />
        <input type="text" name="apellidoMaterno" placeholder="Apellido Materno" value={agente.apellidoMaterno} onChange={handleChange} className="border rounded py-2 px-3" />
        <input type="date" name="fechaNacimiento" placeholder="Fecha de Nacimiento" value={agente.fechaNacimiento} onChange={handleChange} className="border rounded py-2 px-3" />
        <input type="text" name="telefono" placeholder="Teléfono" value={agente.telefono} onChange={handleChange} className="border rounded py-2 px-3" />
        <input type="text" name="correoElectronico" placeholder="Correo Electrónico" value={agente.correoElectronico} onChange={handleChange} className="border rounded py-2 px-3" />
      </div>

      <div className="mt-6">
        <label className="text-gray-700 text-sm font-bold">¿El titular también será el asegurado?*</label>
        <div className="flex items-center">
          <label className="ml-2">
            <input type="radio" name="asegurado" checked={esTitularAsegurado} onChange={() => setEsTitularAsegurado(true)} /> Sí
          </label>
          <label className="ml-4">
            <input type="radio" name="asegurado" checked={!esTitularAsegurado} onChange={() => setEsTitularAsegurado(false)} /> No
          </label>
        </div>
      </div>

      {!esTitularAsegurado && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
          <h2 className="text-xl font-bold">Datos del asegurado</h2>
          <br />
          <input type="text" placeholder="Nombre" value={asegurado.nombre} onChange={(e) => setAsegurado({ ...asegurado, nombre: e.target.value })} className="border rounded py-2 px-3" />
          <input type="text" placeholder="Apellido Paterno" value={asegurado.apellidoPaterno} onChange={(e) => setAsegurado({ ...asegurado, apellidoPaterno: e.target.value })} className="border rounded py-2 px-3" />
          <input type="text" placeholder="Apellido Materno" value={asegurado.apellidoMaterno} onChange={(e) => setAsegurado({ ...asegurado, apellidoMaterno: e.target.value })} className="border rounded py-2 px-3" />
          <input type="date" placeholder="Fecha de Nacimiento" value={asegurado.fechaNacimiento} onChange={(e) => setAsegurado({ ...asegurado, fechaNacimiento: e.target.value })} className="border rounded py-2 px-3" />
          <input type="text" placeholder="Teléfono" value={asegurado.telefono} onChange={(e) => setAsegurado({ ...asegurado, telefono: e.target.value })} className="border rounded py-2 px-3" />
          <input type="text" placeholder="Correo Electrónico" value={asegurado.correoElectronico} onChange={(e) => setAsegurado({ ...asegurado, correoElectronico: e.target.value })} className="border rounded py-2 px-3" />
        </div>
      )}

      <div className="flex items-center justify-center mt-6">
        <button className="text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline" type="button" style={{ backgroundColor: "#0B1956" }} onClick={agregarCotizacion}>Cotizar</button>
      </div>
    </div>
  );
};

export default DatosCotizar;