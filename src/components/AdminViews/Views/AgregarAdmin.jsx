import React, {  useState } from 'react';
import Swal from "sweetalert2";

const AgregarAdmin = () => {
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [correo, setCorreo] = useState("");
  const[telefono, setTelefono] = useState("");
  const [domicilio, setDomicilio] = useState("");
  const [rfc, setRfc] = useState("");

  const agregarAdmin = async () => {
    try {
      const response = await fetch("/api/seguros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellidoPaterno,
          apellidoMaterno,
          correo,
          telefono,
          domicilio,
          rfc
        }),
      });
  
      if (response.ok) {
        Swal.fire("Agregado", "El seguro ha sido agregado correctamente.", "success");
        // Opcional: limpiar los campos después de agregar
        setNombre("");
        setApellidoPaterno("");
        setApellidoMaterno("");
        setCorreo("");
        setTelefono("");
        setDomicilio("");
        setRfc("");
      } else {
        Swal.fire("Error", "Hubo un problema al agregar el seguro.", "error");
      }
    } catch (error) {
      console.error("Error al agregar el seguro:", error);
      Swal.fire("Error", "Ocurrió un error inesperado.", "error");
    }
  };


  const confirmarAgregar = () => {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Quieres agregar a este administrador?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, agregar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) {
          agregarAdmin();
        }
      });
    };



    return (
      <div className="container mx-auto p-6 bg-white rounded-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Agregar Administrador</h2>
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Columna Izquierda */}
          <div className="space-y-4">
            {/* Campo del Nombre */}
            <div>
              <label className="block font-semibold">Nombre*</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full border rounded p-2 mt-1"
            
              />
            </div>
    
            {/* Campo de Apellido Paterno */}
            <div>
              <label className="block font-semibold">Apellido paterno*</label>
              <input
                type="text"
                value={apellidoPaterno}
                onChange={(e) => setApellidoPaterno(e.target.value)}
                className="w-full border rounded p-2 mt-1"
            
              />
            </div>
    
            {/* Campo de Correo */}
            <div>
              <label className="block font-semibold">Correo electrónico*</label>
              <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full border rounded p-2 mt-1"
           
              />
            </div>
          </div>
    
          {/* Columna Derecha */}
          <div className="space-y-4">
            {/* Campo de RFC */}
            <div>
              <label className="block font-semibold">RFC*</label>
              <input
                type="text"
                value={rfc}
                onChange={(e) => setRfc(e.target.value)}
                className="w-full border rounded p-2 mt-1"
                
              />
            </div>
    
            {/* Campo de Teléfono */}
            <div>
              <label className="block font-semibold">Teléfono*</label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full border rounded p-2 mt-1"
               
              />
            </div>
    
            {/* Campo de Apellido Materno */}
            <div>
              <label className="block font-semibold">Apellido materno*</label>
              <input
                type="text"
                value={apellidoMaterno}
                onChange={(e) => setApellidoMaterno(e.target.value)}
                className="w-full border rounded p-2 mt-1"
              
              />
            </div>
          </div>
        </div>
    
        {/* Campo de Domicilio (ancho completo) */}
        <div className="mt-4">
          <label className="block font-semibold">Domicilio*</label>
          <input
            type="text"
            value={domicilio}
            onChange={(e) => setDomicilio(e.target.value)}
            className="w-full border rounded p-2 mt-1"
           
          />
        </div>
    
        {/* Botón Agregar */}
        <div className="flex items-center justify-center mt-6">
          <button
            type="button"
            className="text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
            style={{ backgroundColor: "#0B1956" }}
            onClick={confirmarAgregar}
          >
            Agregar
          </button>
        </div>
      </div>
    );
}

export default AgregarAdmin
