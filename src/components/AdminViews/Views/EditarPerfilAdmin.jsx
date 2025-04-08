import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { useLocation } from "react-router-dom";

const EditarPerfilAdmin = () => {
  const location = useLocation();
  const id = location.state?.id;
  console.log("Prueba", id);

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

  const [errors, setErrors] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefono: "",
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

  const validateInput = (name, value) => {
    let error = "";

    // Validación de longitud máxima para campos específicos
    if (["nombre", "apellidoPaterno", "apellidoMaterno"].includes(name)) {
      if (value.length > 20) {
        error = "No debe exceder 20 caracteres";
      }
    }

    //Validacion maximo de campos en telefono
    if (["telefono"].includes(name)) {
      if (value.length > 10) {
        error = "No debe exceder 10 caracteres";
      }
    }

    // Validación para campos que no deben contener números
    if (["nombre", "apellidoPaterno", "apellidoMaterno"].includes(name)) {
      if (/\d/.test(value)) {
        error = "No se permiten números en este campo";
      }
    }

    // Validación específica para teléfono
    if (name === "telefono") {
      if (!/^\d{0,10}$/.test(value)) {
        error = "Solo se permiten números y máximo 10 dígitos";
      }
    }

    // Validación de correo electrónico
    if (name === "correo" && value) {
      if (value.length > 25) {
        error = "No debe exceder 25 caracteres";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Formato de correo electrónico inválido";
      }
    }

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

    const newErrors = {};
    let hasErrors = false;

    const fields = {
      nombre: formData.nombre,
      apellidoPaterno: formData.apellidoPaterno,
      apellidoMaterno: formData.apellidoMaterno,
      correo: formData.correo,
      telefono: formData.telefono,
    };

    // Validar campos generales
    hasErrors = validateFields(fields, newErrors) || hasErrors;

    // Validar campos de contraseña si se está modificando
    if (modificarContrasena) {
      const passwordFields = {
        nuevaContrasena: formData.nuevaContrasena,
        confirmarContrasena: formData.confirmarContrasena,
        contrasenaActual: formData.contrasenaActual,
      };

      hasErrors = validateFields(passwordFields, newErrors) || hasErrors;

      if (!formData.contrasenaActual) {
        newErrors.contrasenaActual = "Debe ingresar su contraseña actual";
        hasErrors = true;
      }

      if (formData.nuevaContrasena !== formData.confirmarContrasena) {
        newErrors.confirmarContrasena = "Las contraseñas no coinciden";
        hasErrors = true;
      }
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

    // Validar que el correo y el teléfono no existan ya en la base de datos
    const emailExists = await checkIfEmailExists(formData.correo);
    if (emailExists) {
      setError("El correo ya está registrado");
      return;
    }

    const phoneExists = await checkIfPhoneExists(formData.telefono);
    if (phoneExists) {
      setError("El número de teléfono ya está registrado");
      return;
    }

    setError(""); // Limpiar el mensaje de error si la validación pasa

    try {
      if (modificarContrasena) {
        await updatePassword();
      } else {
        await updateProfile();
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
        text: `Hubo un error al actualizar el perfil:`,
        icon: "error",
      });
    }
  };

  // Función para validar campos
  const validateFields = (fields, errors) => {
    let hasErrors = false;
    Object.keys(fields).forEach((key) => {
      const error = validateInput(key, fields[key]);
      if (error) {
        errors[key] = error;
        hasErrors = true;
      }
    });
    return hasErrors;
  };

  // Función para actualizar la contraseña
  const updatePassword = async () => {
    const response = await axios.put(
      `http://localhost:3000/nar/usuarios/updPostulante/${id}`,
      {
        contrasenaActual: formData.contrasenaActual,
        nuevaContrasena: formData.nuevaContrasena,
      }
    );

    if (response.status !== 200) {
      throw new Error("Error al actualizar la contraseña");
    }
  };

  // Función para actualizar el perfil
  const updateProfile = async () => {
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
    // Validar todos los campos antes de mostrar la alerta
    const newErrors = {};
    let hasErrors = false;

    // Validar cada campo
    const fields = {
      nombre: formData.nombre,
      apellidoPaterno: formData.apellidoPaterno,
      apellidoMaterno: formData.apellidoMaterno,
      correo: formData.correo,
      telefono: formData.telefono,
    };

    Object.keys(fields).forEach((key) => {
      const error = validateInput(key, fields[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    // Validar campos de contraseña si se está modificando
    if (modificarContrasena) {
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
          <label className="block text-sm font-medium">Nombre*</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`mt-1 w-full border border-gray-300 p-2 rounded ${
              errors.nombre ? "border-red-500" : ""
            }`}
          />
          {errors.nombre && (
            <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Apellido paterno*</label>
          <input
            type="text"
            name="apellidoPaterno"
            value={formData.apellidoPaterno}
            onChange={handleChange}
            className={`mt-1 w-full border border-gray-300 p-2 rounded ${
              errors.apellidoPaterno ? "border-red-500" : ""
            }`}
          />
          {errors.apellidoPaterno && (
            <p className="text-red-500 text-xs mt-1">
              {errors.apellidoPaterno}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Apellido materno*</label>
          <input
            type="text"
            name="apellidoMaterno"
            value={formData.apellidoMaterno}
            onChange={handleChange}
            className={`mt-1 w-full border border-gray-300 p-2 rounded ${
              errors.apellidoMaterno ? "border-red-500" : ""
            }`}
          />
          {errors.apellidoMaterno && (
            <p className="text-red-500 text-xs mt-1">
              {errors.apellidoMaterno}
            </p>
          )}
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
            className={`mt-1 w-full border border-gray-300 p-2 rounded ${
              errors.correo ? "border-red-500" : ""
            }`}
          />
          {errors.correo && (
            <p className="text-red-500 text-xs mt-1">{errors.correo}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">Teléfono*</label>
          <input
            type="text"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            className={`mt-1 w-full border border-gray-300 p-2 rounded ${
              errors.telefono ? "border-red-500" : ""
            }`}
          />
          {errors.telefono && (
            <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium">RFC*</label>
          <input
            type="text"
            name="rfc"
            value={formData.rfc}
            onChange={handleChange}
            className="mt-1 w-full border border-gray-300 p-2 rounded bg-gray-100"
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
              <label className="block text-sm font-medium">
                Nueva contraseña:
              </label>
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
                Confirmar Contraseña*
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

export default EditarPerfilAdmin;
