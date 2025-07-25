import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_URL = "https://lz2k718xka.execute-api.us-east-1.amazonaws.com/nar/usuarios/id";
const API_URL_EDIT = "https://lz2k718xka.execute-api.us-east-1.amazonaws.com/nar/usuarios";

const EditarAdmin = () => {
  const location = useLocation();
  const id = location.state?.id;
  const idAdmin = location.state?.idAdmin;
  console.log("Id del admin:", id);

  console.log("Id del admin a editar:", idAdmin);
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefono: "",
  });

  const [errors, setErrors] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefono: "",
  });

  const [loading, setLoading] = useState(true);
  const [correoOriginal, setCorreoOriginal] = useState("");
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

  useEffect(() => {
    const obtenerAdmin = async () => {
      try {
        if (location.state && location.state.administrador) {
          setAdmin(location.state.administrador);
          setCorreoOriginal(location.state.administrador.correo);
          setTelefonoOriginal(location.state.administrador.telefono);
        } else if (idAdmin) {
          const response = await axios.get(`${API_URL}/${idAdmin}`);
          setAdmin(response.data);
          setCorreoOriginal(response.data.correo);
          setTelefonoOriginal(response.data.telefono);
        } else {
          throw new Error("ID del admin no definido");
        }
      } catch (error) {
        console.error("Error al obtener detalles del administrador:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron obtener los detalles del administrador.",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    obtenerAdmin();
  }, [idAdmin, location.state]);

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

    // Validación para campos que no deben contener números ni caracteres especiales
    if (["nombre", "apellidoPaterno", "apellidoMaterno"].includes(name)) {
      if (/\d/.test(value)) {
        error = "No se permiten números en este campo";
      }
      if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        error = "No se permiten caracteres especiales en este campo";
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

    return error;
  };

  const checkIfEmailExists = async (email) => {
    // Si el correo es el mismo que ya tiene el admin, no es un error
    if (email === correoOriginal) {
      return false;
    }

    try {
      const response = await axios.get(
        `https://lz2k718xka.execute-api.us-east-1.amazonaws.com/nar/usuarios/checkEmail/${email}`
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error al verificar el correo", error);
      return false;
    }
  };

  const checkIfPhoneExists = async (phone) => {
    // Si el teléfono es el mismo que ya tiene el admin, no es un error
    if (phone === telefonoOriginal) {
      return false;
    }

    try {
      const response = await axios.get(
        `https://lz2k718xka.execute-api.us-east-1.amazonaws.com/nar/usuarios/checkPhone/${phone}`
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error al verificar el teléfono", error);
      return false;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateInput(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    setAdmin({
      ...admin,
      [name]: value,
    });
  };

  const restablecerContrasena = () => {
    swalWithTailwindButtons
      .fire({
        title: "¿Estás seguro?",
        text: "La contraseña se restablecerá al correo electrónico del administrador. ¿Deseas continuar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, restablecer",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const nuevaContrasena = admin.correo;
            await axios.put(`${API_URL_EDIT}/resetearContra/${id}`, {
              correo: nuevaContrasena,
            });

            swalWithTailwindButtons.fire({
              icon: "success",
              title: "Contraseña restablecida",
              text: "La contraseña ha sido restablecida al correo electrónico del administrador.",
            });
          } catch (error) {
            console.error("Error al restablecer la contraseña:", error);
            swalWithTailwindButtons.fire({
              icon: "error",
              title: "Error",
              text: "Hubo un problema al restablecer la contraseña.",
            });
          }
        }
      });
  };

  const validarCampos = () => {
    const { nombre, apellidoPaterno, apellidoMaterno, correo, telefono } =
      admin;

    // Validar todos los campos
    const newErrors = {};
    let hasErrors = false;

    // Validar cada campo
    const fields = {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      correo,
      telefono,
    };

    Object.keys(fields).forEach((key) => {
      const error = validateInput(key, fields[key]);
      if (error) {
        newErrors[key] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      swalWithTailwindButtons.fire({
        title: "Error de validación",
        text: "Por favor, corrija los errores en el formulario",
        icon: "error",
      });
      return false;
    }

    if (
      !nombre ||
      !apellidoPaterno ||
      !apellidoMaterno ||
      !correo ||
      !telefono
    ) {
      swalWithTailwindButtons.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "Por favor, llena todos los campos obligatorios.",
      });
      return false;
    }

    return true;
  };

  const handleEditSubmit = async () => {
    if (validarCampos()) {
      // Verificar si el correo ya existe
      const emailExists = await checkIfEmailExists(admin.correo);
      if (emailExists) {
        setErrors((prev) => ({
          ...prev,
          correo: "El correo electrónico ya está registrado en el sistema",
        }));
        swalWithTailwindButtons.fire({
          title: "Error",
          text: "El correo electrónico ya está registrado en el sistema",
          icon: "error",
        });
        return;
      }

      // Verificar si el teléfono ya existe
      const phoneExists = await checkIfPhoneExists(admin.telefono);
      if (phoneExists) {
        setErrors((prev) => ({
          ...prev,
          telefono: "El teléfono ya está registrado en el sistema",
        }));
        swalWithTailwindButtons.fire({
          title: "Error",
          text: "El teléfono ya está registrado en el sistema",
          icon: "error",
        });
        return;
      }

      try {
        const response = await axios.put(`${API_URL_EDIT}/${idAdmin}`, admin);

        if (response.status === 200) {
          swalWithTailwindButtons.fire({
            title: "Éxito",
            text: "Datos del administrador guardados correctamente.",
            icon: "success",
          });
          navigate("/administradores", { state: { id: id } }); // Redirigir a la lista de administradores
        } else {
          swalWithTailwindButtons.fire({
            title: "Error",
            text: "Hubo un problema al guardar los datos.",
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Error al guardar el administrador:", error);

        // Verificar si el error es por datos duplicados
        if (error.response && error.response.data) {
          const errorMessage = error.response.data.message;

          if (errorMessage && errorMessage.includes("correo")) {
            setErrors((prev) => ({
              ...prev,
              correo: "El correo electrónico ya está registrado en el sistema",
            }));
            swalWithTailwindButtons.fire({
              title: "Error",
              text: "El correo electrónico ya está registrado en el sistema",
              icon: "error",
            });
            return;
          } else if (errorMessage && errorMessage.includes("teléfono")) {
            setErrors((prev) => ({
              ...prev,
              telefono: "El teléfono ya está registrado en el sistema",
            }));
            swalWithTailwindButtons.fire({
              title: "Error",
              text: "El teléfono ya está registrado en el sistema",
              icon: "error",
            });
            return;
          }
        }

        swalWithTailwindButtons.fire({
          title: "Error",
          text: error.response?.data?.message || "Ocurrió un error inesperado.",
          icon: "error",
        });
      }
    }
  };

  const showEditAlert = () => {
    // Validar todos los campos antes de mostrar la alerta
    if (!validarCampos()) {
      return;
    }

    swalWithTailwindButtons
      .fire({
        title: "¿Deseas guardar los cambios?",
        text: "Se actualizará la información del administrador.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar cambios",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithTailwindButtons.fire({
            title: "Realizando los cambios..",
            text: "Por favor espera.",
            icon: "info",
            showConfirmButton: false,
            allowOutsideClick: false,
          });
          handleEditSubmit();
        }
      });
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex items-center justify-center w-auto h-auto p-6">
      <div className="bg-white p-8 rounded w-full max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Editar Administrador</h1>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nombre*
            </label>
            <input
              type="text"
              name="nombre"
              value={admin.nombre}
              onChange={handleChange}
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${
                errors.nombre ? "border-red-500" : ""
              }`}
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
            )}

            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Apellido paterno*
              </label>
              <input
                type="text"
                name="apellidoPaterno"
                value={admin.apellidoPaterno}
                onChange={handleChange}
                className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${
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
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Correo electrónico*
              </label>
              <input
                type="email"
                name="correo"
                value={admin.correo}
                onChange={handleChange}
                className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${
                  errors.correo ? "border-red-500" : ""
                }`}
              />
              {errors.correo && (
                <p className="text-red-500 text-xs mt-1">{errors.correo}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Apellido Materno*
              </label>
              <input
                type="text"
                name="apellidoMaterno"
                value={admin.apellidoMaterno}
                onChange={handleChange}
                className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${
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
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Teléfono*
              </label>
              <input
                type="tel"
                name="telefono"
                value={admin.telefono}
                onChange={handleChange}
                className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${
                  errors.telefono ? "border-red-500" : ""
                }`}
              />
              {errors.telefono && (
                <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
              )}
            </div>
          </div>
        </form>

        <div className="col-span-2 flex justify-center mt-8">
          <button
            type="button"
            className="text-white items-start font-bold mr-2 py-2 px-2 botones focus:outline-none focus:shadow-outline"
            onClick={restablecerContrasena}
          >
            Restablecer contraseña
          </button>

          <button
            type="button"
            className="text-white items-start font-bold mr-2 py-2 px-2 botones focus:outline-none focus:shadow-outline"
            onClick={showEditAlert}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarAdmin;
