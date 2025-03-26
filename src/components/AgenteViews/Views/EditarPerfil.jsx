import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const EditarPerfil = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefono: "",
    domicilio: "",
    rfc: "",
    nuevaContrasena: "",
    confirmarContrasena: "",
  });

  const [error, setError] = useState("");

  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
      cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
    },
    buttonsStyling: false
  });

  // Cargar datos desde el backend al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.tu-backend.com/perfil");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error("Error al cargar los datos del perfil", error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan
    if (formData.nuevaContrasena !== formData.confirmarContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setError(""); // Limpiar el mensaje de error si la validación pasa

    try {
      const response = await fetch("https://api.tu-backend.com/perfil", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      swalWithTailwindButtons.fire({
        title: response.ok ? "¡Actualizado!" : "Error",
        text: response.ok
          ? "El perfil se actualizó con éxito."
          : "Hubo un error al actualizar el perfil.",
        icon: response.ok ? "success" : "error",
      });

      if (response.ok) {
        // Aquí puedes redirigir o realizar alguna acción adicional
      }

    } catch (error) {
      console.error("Error al actualizar el perfil", error);
      swalWithTailwindButtons.fire({
        title: "Error",
        text: "Hubo un error al actualizar el perfil.",
        icon: "error",
      });
    }
  };

  const confirmarActualizacion = () => {
    swalWithTailwindButtons.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres actualizar este perfil?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, actualizar",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        handleSubmit(new Event('submit'));
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium">Nombre*</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 bg-gray-200 p-2 rounded"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Apellido paterno*</label>
          <input
            type="text"
            name="apellidoPaterno"
            value={formData.apellidoPaterno}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 bg-gray-200 p-2 rounded"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Apellido materno*</label>
          <input
            type="text"
            name="apellidoMaterno"
            value={formData.apellidoMaterno}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 bg-gray-200 p-2 rounded"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Correo electrónico*</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 bg-gray-200 p-2 rounded"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Teléfono*</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 bg-gray-200 p-2 rounded"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Domicilio*</label>
          <input
            type="text"
            name="domicilio"
            value={formData.domicilio}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 bg-gray-200 p-2 rounded"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium">RFC*</label>
          <input
            type="text"
            name="rfc"
            value={formData.rfc}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 bg-gray-200 p-2 rounded"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Nueva contraseña:</label>
          <input
            type="password"
            name="nuevaContrasena"
            value={formData.nuevaContrasena}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Confirmar Contraseña*</label>
          <input
            type="password"
            name="confirmarContrasena"
            value={formData.confirmarContrasena}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 p-2 rounded"
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="md:col-span-3 flex justify-center mt-4">
          <button
            type="button"
            onClick={confirmarActualizacion}
            className="botones text-white font-medium px-6 py-2 rounded shadow-md hover:bg-[#0b1956]/90"
          >
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditarPerfil;
