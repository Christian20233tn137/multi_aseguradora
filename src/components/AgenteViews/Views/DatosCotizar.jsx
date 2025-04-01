import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const DatosCotizar = () => {
  const location = useLocation();
  const id = location.state.id;
  console.log("Primera prueba",id);
  
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
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
        cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
      },
      buttonsStyling: false
    });
  
    try {
      const result = await swalWithTailwindButtons.fire({
        title: '¿Estás seguro?',
        text: "¿Deseas enviar esta cotización?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, enviar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      });
  
      if (!result.isConfirmed) {
        return; // Si el usuario cancela, no hacemos nada
      }
  
      // Comenta esta parte para probar los botones sin necesidad de un backend activo
      /*
      const response = await axios.post("/api/cotizaciones", {
        ...agente,
        esTitularAsegurado,
        asegurado: esTitularAsegurado ? null : asegurado,
      });
      */
  
      // Simula una respuesta exitosa para probar sin backend
      const response = { status: 200 };
  
      if (response.status === 200) {
        swalWithTailwindButtons.fire("Cotización Enviada", "La cotización se envió correctamente.", "success");
        setAgente({ nombre: "", apellidoPaterno: "", apellidoMaterno: "", fechaNacimiento: "", telefono: "", correoElectronico: "" });
        setAsegurado({ nombre: "", apellidoPaterno: "", apellidoMaterno: "", fechaNacimiento: "", telefono: "", correoElectronico: "" });
      } else {
        swalWithTailwindButtons.fire("Error", "Hubo un problema al enviar la cotización.", "error");
      }
    } catch (error) {
      console.error("Error al cotizar:", error);
      swalWithTailwindButtons.fire("Error", "Ocurrió un error inesperado.", "error");
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