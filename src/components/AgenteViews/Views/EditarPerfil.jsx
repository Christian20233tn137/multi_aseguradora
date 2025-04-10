import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useLocation } from "react-router-dom";

const EditarPerfil = () => {
  const location = useLocation();
  const id = location.state?.id;
  console.log("Prueba", id);

  const [formData, setFormData] = useState({
    nuevaContrasena: "",
    confirmarContrasena: "",
    contrasenaActual: "",
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
  });

  const [errors, setErrors] = useState({
    nuevaContrasena: "",
    confirmarContrasena: "",
    contrasenaActual: "",
  });

  const [error, setError] = useState("");
  const [correoOriginal, setCorreoOriginal] = useState("");
  const [rfcOriginal, setRfcOriginal] = useState("");
  const [telefonoOriginal, setTelefonoOriginal] = useState("");

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
          `https://lz2k718xka.execute-api.us-east-1.amazonaws.com/nar/usuarios/id/${id}`
        );
        setFormData({
          nuevaContrasena: "",
          confirmarContrasena: "",
          contrasenaActual: "",
          nombre: response.data.nombre,
          apellidoPaterno: response.data.apellidoPaterno,
          apellidoMaterno: response.data.apellidoMaterno,
        });
        // Guardar el correo y teléfono originales para mostrar
        setCorreoOriginal(response.data.correo);
        setTelefonoOriginal(response.data.telefono);
        setRfcOriginal(response.data.rfc);
      } catch (error) {
        console.error("Error al cargar los datos del perfil", error);
      }
    };

    fetchData();
  }, [id]);

  const validateInput = (name, value) => {
    let error = "";

    // Validación de contraseña
    if (name === "nuevaContrasena" && value) {
      if (value.length < 8) {
        error = "La contraseña debe tener al menos 8 caracteres";
      } else if (!/(?=.*[a-z])/.test(value)) {
        error = "La contraseña debe contener al menos una letra minúscula";
      } else if (!/(?=.*\d)/.test(value)) {
        error = "La contraseña debe contener al menos un número";
      } else if (!/(?=.*[!@#$%^&*])/.test(value)) {
        error =
          "La contraseña debe contener al menos un carácter especial (!@#$%^&*)";
      }
    }

    // Validación de confirmación de contraseña
    if (name === "confirmarContrasena" && value) {
      if (value !== formData.nuevaContrasena) {
        error = "Las contraseñas no coinciden";
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateInput(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar todos los campos
    const newErrors = {};
    let hasErrors = false;

    // Validar campos de contraseña
    const passwordFields = {
      nuevaContrasena: formData.nuevaContrasena,
      confirmarContrasena: formData.confirmarContrasena,
      contrasenaActual: formData.contrasenaActual,
    };

    Object.keys(passwordFields).forEach((key) => {
      const error = validateInput(key, passwordFields[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    // Validar que la contraseña actual no esté vacía
    if (!formData.contrasenaActual) {
      newErrors.contrasenaActual = "Debe ingresar su contraseña actual";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      swalWithTailwindButtons.fire({
        title: "Error de validación",
        text: "Por favor, corrija los errores en el formulario",
        icon: "error",
      });
      return;
    }

    setError(""); // Limpiar el mensaje de error si la validación pasa

    try {
      // Actualizar la contraseña
      const passwordResponse = await axios.put(
        `https://lz2k718xka.execute-api.us-east-1.amazonaws.com/nar/usuarios/updPostulante/${id}`,
        {
          contrasenaActual: formData.contrasenaActual,
          nuevaContrasena: formData.nuevaContrasena,
        }
      );

      if (passwordResponse.status !== 200) {
        throw new Error("Error al actualizar la contraseña");
      }

      swalWithTailwindButtons
        .fire({
          title: "¡Actualizado!",
          text: "La contraseña se actualizó con éxito.",
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

  const confirmarActualizacion = () => {
    // Validar todos los campos antes de mostrar la alerta
    const newErrors = {};
    let hasErrors = false;

    // Validar campos de contraseña
    const passwordFields = {
      nuevaContrasena: formData.nuevaContrasena,
      confirmarContrasena: formData.confirmarContrasena,
      contrasenaActual: formData.contrasenaActual,
    };

    Object.keys(passwordFields).forEach((key) => {
      const error = validateInput(key, passwordFields[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    // Validar que la contraseña actual no esté vacía
    if (!formData.contrasenaActual) {
      newErrors.contrasenaActual = "Debe ingresar su contraseña actual";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      swalWithTailwindButtons.fire({
        title: "Error de validación",
        text: "Por favor, corrija los errores en el formulario",
        icon: "error",
      });
      return;
    }

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
            title: "Realizando cambios..",
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
          <label className="block text-sm font-medium">Nombre</label>
          <input
            type="text"
            value={formData.nombre}
            className="mt-1 w-full border border-gray-300 p-2 rounded bg-gray-100"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Apellido paterno</label>
          <input
            type="text"
            value={formData.apellidoPaterno}
            className="mt-1 w-full border border-gray-300 p-2 rounded bg-gray-100"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Apellido materno</label>
          <input
            type="text"
            value={formData.apellidoMaterno}
            className="mt-1 w-full border border-gray-300 p-2 rounded bg-gray-100"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            Correo electrónico
          </label>
          <input
            type="text"
            value={correoOriginal}
            className="mt-1 w-full border border-gray-300 p-2 rounded bg-gray-100"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Teléfono</label>
          <input
            type="text"
            value={telefonoOriginal}
            className="mt-1 w-full border border-gray-300 p-2 rounded bg-gray-100"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-medium">RFC</label>
          <input
            type="text"
            value={rfcOriginal}
            className="mt-1 w-full border border-gray-300 p-2 rounded bg-gray-100"
            disabled
          />
        </div>

        <div className="mt-6 md:col-span-3">
          <label className="text-gray-700 text-sm font-bold">
            Modificar contraseña
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium">
            Contraseña actual:
          </label>
          <input
            type="password"
            name="contrasenaActual"
            value={formData.contrasenaActual}
            onChange={handleChange}
            className={`mt-1 w-full border border-gray-300 p-2 rounded ${
              errors.contrasenaActual ? "border-red-500" : ""
            }`}
          />
          {errors.contrasenaActual && (
            <p className="text-red-500 text-xs mt-1">
              {errors.contrasenaActual}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Nueva contraseña:</label>
          <input
            type="password"
            name="nuevaContrasena"
            value={formData.nuevaContrasena}
            onChange={handleChange}
            className={`mt-1 w-full border border-gray-300 p-2 rounded ${
              errors.nuevaContrasena ? "border-red-500" : ""
            }`}
          />
          {errors.nuevaContrasena && (
            <p className="text-red-500 text-xs mt-1">
              {errors.nuevaContrasena}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">
            Confirmar Contraseña
          </label>
          <input
            type="password"
            name="confirmarContrasena"
            value={formData.confirmarContrasena}
            onChange={handleChange}
            className={`mt-1 w-full border border-gray-300 p-2 rounded ${
              errors.confirmarContrasena ? "border-red-500" : ""
            }`}
          />
          {errors.confirmarContrasena && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmarContrasena}
            </p>
          )}
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
