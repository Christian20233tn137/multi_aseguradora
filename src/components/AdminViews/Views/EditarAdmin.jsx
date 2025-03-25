import React, { useState, useEffect } from 'react';
import Swal from "sweetalert2";

const EditarAdmin = () => {
  const [admin, setAdmin] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    telefono: '',
    domicilio: '',
    rfc: '',
  });

  useEffect(() => {
    const obtenerAdmin = async () => {
      // Aquí deberías hacer una llamada real a tu API para obtener los datos del admin
      const data = {
        nombre: 'Admin',
        apellidoPaterno: 'Ejemplo',
        apellidoMaterno: 'Test',
        correo: 'admin@example.com',
        telefono: '555-5678',
        domicilio: 'Av. Admin 456',
        rfc: 'ADMI890123XYZ',
      };
      setAdmin(data);
    };

    obtenerAdmin();
  }, []);

  const handleChange = (e) => {
    setAdmin({
      ...admin,
      [e.target.name]: e.target.value,
    });
  };

  const restablecerContrasena = () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'La contraseña se restablecerá al correo electrónico del administrador. ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, restablecer',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0B1956',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevaContrasena = admin.correo;
        console.log(`La nueva contraseña es: ${nuevaContrasena}`);

        Swal.fire({
          icon: 'success',
          title: 'Contraseña restablecida',
          text: 'La contraseña ha sido restablecida al correo electrónico del administrador.',
          confirmButtonColor: '#0B1956',
        });
      }
    });
  };

  const validarCampos = () => {
    const { nombre, apellidoPaterno, apellidoMaterno, correo, telefono, rfc } = admin;

    if (!nombre || !apellidoPaterno || !apellidoMaterno || !correo || !telefono || !rfc) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos obligatorios',
        text: 'Por favor, llena todos los campos obligatorios.',
        confirmButtonColor: '#0B1956',
      });
      return false;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
      Swal.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'Por favor, ingresa un correo electrónico válido.',
        confirmButtonColor: '#0B1956',
      });
      return false;
    }

    return true;
  };

  const confirmarEditar = () => {
    if (validarCampos()) {
      Swal.fire({
        title: "¿Estás seguro?",
        text: "¿Quieres editar este administrador?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#0B1956",
        cancelButtonColor: "#d33",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await fetch("/api/seguros", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(admin),
            });

            if (response.ok) {
              Swal.fire({
                title: "Éxito",
                text: "Datos del administrador guardados correctamente.",
                icon: "success",
                confirmButtonColor: "#0B1956",
              });
            } else {
              Swal.fire({
                title: "Error",
                text: "Hubo un problema al guardar los datos.",
                icon: "error",
                confirmButtonColor: "#0B1956",
              });
            }
          } catch (error) {
            console.error("Error al guardar el administrador:", error);
            Swal.fire({
              title: "Error",
              text: "Ocurrió un error inesperado.",
              icon: "error",
              confirmButtonColor: "#0B1956",
            });
          }
        }
      });
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Editar Administrador</h2>
  
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Columna Izquierda */}
        <div className="space-y-4">
          {/* Campo del Nombre */}
          <div>
            <label className="block font-semibold">Nombre*</label>
            <input
              type="text"
              name="nombre"
              value={admin.nombre}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
            />
          </div>
  
          {/* Campo de Apellido Paterno */}
          <div>
            <label className="block font-semibold">Apellido paterno*</label>
            <input
              type="text"
              name="apellidoPaterno"
              value={admin.apellidoPaterno}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
            />
          </div>
  
          {/* Campo de Correo */}
          <div>
            <label className="block font-semibold">Correo electrónico*</label>
            <input
              type="email"
              name="correo"
              value={admin.correo}
              onChange={handleChange}
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
              name="rfc"
              value={admin.rfc}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
            />
          </div>
  
          {/* Campo de Teléfono */}
          <div>
            <label className="block font-semibold">Teléfono*</label>
            <input
              type="tel"
              name="telefono"
              value={admin.telefono}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
            />
          </div>
  
          {/* Campo de Apellido Materno */}
          <div>
            <label className="block font-semibold">Apellido materno*</label>
            <input
              type="text"
              name="apellidoMaterno"
              value={admin.apellidoMaterno}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
            />
          </div>
        </div>
      </div>
  
      {/* Campo de Domicilio (ancho completo) */}
      <div className="mt-4">
        <label className="block font-semibold">Domicilio</label>
        <input
          type="text"
          name="domicilio"
          value={admin.domicilio}
          onChange={handleChange}
          className="w-full border rounded p-2 mt-1"
        />
      </div>
      
      {/* Botón Restablecer contraseña */}
      <div className="col-span-2 flex items-center justify-start mt-8">
        <button
          type="button"
          className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          style={{ backgroundColor: "#0B1956" }}
          onClick={restablecerContrasena}
        >
          Restablecer contraseña
        </button>
      </div>
  
      {/* Botón Editar */}
      <div className="flex items-center justify-center mt-6">
        <button
          type="button"
          className="text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          style={{ backgroundColor: "#0B1956" }}
          onClick={confirmarEditar}
        >
          Editar
        </button>
      </div>
    </div>
  );
}

export default EditarAdmin;