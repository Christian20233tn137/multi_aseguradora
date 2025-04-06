import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useLocation } from "react-router-dom";

const EditarPerfil = () => {
  const location = useLocation();
  const id = location.state?.id;
  console.log(id);

  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefono: "",
    rfc: "",
    nuevaContrasena: "",
    confirmarContrasena: "",
    contrasenaActual: "",
  });

  const [error, setError] = useState("");
  const [modificarContrasena, setModificarContrasena] = useState(false);

  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton:
        "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
      cancelButton:
        "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2",
    },
    buttonsStyling: false,
  });

  // Cargar datos desde el backend al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/nar/usuarios/id/${id}`
        );
        setFormData(response.data);
      } catch (error) {
        console.error("Error al cargar los datos del perfil", error);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que las contraseñas coincidan si se desea modificar la contraseña
    if (
      modificarContrasena &&
      formData.nuevaContrasena !== formData.confirmarContrasena
    ) {
      setError("Las contraseñas no coinciden");
      return;
    }

    // Validar que la contraseña tenga al menos 6 dígitos
    if (modificarContrasena && formData.nuevaContrasena.length < 6) {
      setError("La contraseña debe tener al menos 6 dígitos");
      return;
    }

    // Validar que el correo no exista ya en la base de datos
    const emailExists = await checkIfEmailExists(formData.correo);
    if (emailExists) {
      setError("El correo ya está registrado");
      return;
    }

    // Validar que el número de teléfono no exista ya en la base de datos
    const phoneExists = await checkIfPhoneExists(formData.telefono);
    if (phoneExists) {
      setError("El número de teléfono ya está registrado");
      return;
    }

    setError(""); // Limpiar el mensaje de error si la validación pasa

    try {
      if (modificarContrasena) {
        // Actualizar la contraseña
        const passwordResponse = await axios.put(
          `http://localhost:3000/nar/usuarios/updPostulante/${id}`,
          {
            contrasenaActual: formData.contrasenaActual,
            nuevaContrasena: formData.nuevaContrasena,
          }
        );

        if (passwordResponse.status !== 200) {
          throw new Error("Error al actualizar la contraseña");
        }
      } else {
        // Actualizar los datos del perfil - enviar solo los campos requeridos
        const dataToSend = {
          nombre: formData.nombre,
          apellidoPaterno: formData.apellidoPaterno,
          apellidoMaterno: formData.apellidoMaterno,
          correo: formData.correo,
          telefono: formData.telefono,
        };

        const response = await axios.put(
          `http://localhost:3000/nar/usuarios/byAdmin/${id}`,
          dataToSend
        );

        if (response.status !== 200) {
          throw new Error("Error al actualizar el perfil");
        }
      }

      swalWithTailwindButtons
        .fire({
          title: "¡Actualizado!",
          text: modificarContrasena
            ? "La contraseña se actualizó con éxito."
            : "El perfil se actualizó con éxito.",
          icon: "success",
        })
        .then(() => {
          window.location.reload(); // Recargar la página
        });
    } catch (error) {
      console.error("Error al actualizar el perfil", error);
      swalWithTailwindButtons.fire({
        title: "Error",
        text: "Hubo un error al actualizar el perfil.",
        icon: "error",
      });
    }
  };

  const checkIfEmailExists = async (email) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/nar/usuarios/checkEmail/${email}`
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error al verificar el correo", error);
      return false;
    }
  };

  const checkIfPhoneExists = async (phone) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/nar/usuarios/checkPhone/${phone}`
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error al verificar el número de teléfono", error);
      return false;
    }
  };

  const confirmarActualizacion = () => {
    swalWithTailwindButtons
      .fire({
        title: "¿Estás seguro?",
        text: "¿Quieres actualizar este perfil?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, actualizar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithTailwindButtons.fire({
            title: "Actualizando...",
            text: "Por favor espera.",
            icon: "info",
            showConfirmButton: false,
            allowOutsideClick: false,
          });
          handleSubmit(new Event("submit"));
        }
      });
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <form
        onSubmit={(e) => e.preventDefault()}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div>
          <label className="block text-sm font-medium">Nombre*</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Apellido paterno*</label>
          <input
            type="text"
            name="apellidoPaterno"
            value={formData.apellidoPaterno}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Apellido materno*</label>
          <input
            type="text"
            name="apellidoMaterno"
            value={formData.apellidoMaterno}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Correo electrónico*
          </label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Teléfono*</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">RFC*</label>
          <input
            type="text"
            name="rfc"
            value={formData.rfc}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 p-2 rounded"
            disabled // Deshabilitar el campo RFC
          />
        </div>

        <div className="mt-6 md:col-span-3">
          <label className="text-gray-700 text-sm font-bold">
            ¿Desea modificar su contraseña?*
          </label>
          <div className="flex items-center">
            <label className="ml-2">
              <input
                type="radio"
                name="modificarContrasena"
                checked={modificarContrasena}
                onChange={() => setModificarContrasena(true)}
              />{" "}
              Sí
            </label>
            <label className="ml-4">
              <input
                type="radio"
                name="modificarContrasena"
                checked={!modificarContrasena}
                onChange={() => setModificarContrasena(false)}
              />{" "}
              No
            </label>
          </div>
        </div>

        {modificarContrasena && (
          <>
            <div>
              <label className="block text-sm font-medium">
                Contraseña actual:
              </label>
              <input
                type="password"
                name="contrasenaActual"
                value={formData.contrasenaActual}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 p-2 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Nueva contraseña:
              </label>
              <input
                type="password"
                name="nuevaContrasena"
                value={formData.nuevaContrasena}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 p-2 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Confirmar Contraseña*
              </label>
              <input
                type="password"
                name="confirmarContrasena"
                value={formData.confirmarContrasena}
                onChange={handleChange}
                className="mt-1 w-full border border-gray-300 p-2 rounded"
              />
            </div>
          </>
        )}

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
