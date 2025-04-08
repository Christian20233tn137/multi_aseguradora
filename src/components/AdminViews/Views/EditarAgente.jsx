import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const API_URL = "http://localhost:3000/nar/usuarios";

const EditarAgente = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const idAgente = location.state?.idAgente;
  const id = location.state?.id;
  console.log("Id del agente:", idAgente);
  console.log("Id del admin:", id);

  const [agente, setAgente] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefono: "",
    rfc: "",
  });

  const [errors, setErrors] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefono: "",
  });

  const [loading, setLoading] = useState(true);

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
    const obtenerAgente = async () => {
      try {
        if (location.state && location.state.agente) {
          setAgente(location.state.agente);
        } else if (id) {
          const response = await axios.get(`${API_URL}/id/${idAgente}`);
          setAgente(response.data);
        } else {
          throw new Error("ID del agente no definido");
        }
      } catch (error) {
        console.error("Error al obtener detalles del agente:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron obtener los detalles del agente.",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    obtenerAgente();
  }, [idAgente, location.state]);

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

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateInput(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    setAgente({
      ...agente,
      [name]: value,
    });
  };

  const restablecerContrasena = () => {
    swalWithTailwindButtons
      .fire({
        title: "¿Estás seguro?",
        text: "La contraseña se restablecerá al correo electrónico del usuario. ¿Deseas continuar?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, restablecer",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            const nuevaContrasena = agente.correo;
            await axios.put(`${API_URL}/resetearContra/${idAgente}`, {
              correo: nuevaContrasena,
            });

            swalWithTailwindButtons.fire({
              icon: "success",
              title: "Contraseña restablecida",
              text: "La contraseña ha sido restablecida al correo electrónico del usuario.",
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
      agente;

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
      try {
        // Crear un nuevo objeto excluyendo el campo 'rfc'
        const formData = {
          nombre: agente.nombre,
          apellidoPaterno: agente.apellidoPaterno,
          apellidoMaterno: agente.apellidoMaterno,
          correo: agente.correo,
          telefono: agente.telefono,
        };

        console.log("Datos a enviar:", formData); // Verifica el contenido de formData

        const response = await axios.put(
          `${API_URL}/byAdmin/${idAgente}`,
          formData
        );

        if (response.status === 200) {
          swalWithTailwindButtons.fire({
            title: "Éxito",
            text: "Datos guardados correctamente.",
            icon: "success",
          });
          navigate("/agentes", { state: { id: id } }); // Redirigir a la lista de agentes
        } else {
          swalWithTailwindButtons.fire({
            title: "Error",
            text: "Hubo un problema al guardar los datos.",
            icon: "error",
          });
        }
      } catch (error) {
        console.error("Error al guardar el agente:", error);
        swalWithTailwindButtons.fire({
          title: "Error",
          text: "Ocurrió un error inesperado.",
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
        text: "Se actualizará la información del agente.",
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
        <h1 className="text-2xl font-bold mb-4">Editar Agente</h1>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nombre*
            </label>
            <input
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${
                errors.nombre ? "border-red-500" : ""
              }`}
              name="nombre"
              value={agente.nombre}
              onChange={handleChange}
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Apellido paterno*
            </label>
            <input
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${
                errors.apellidoPaterno ? "border-red-500" : ""
              }`}
              name="apellidoPaterno"
              value={agente.apellidoPaterno}
              onChange={handleChange}
            />
            {errors.apellidoPaterno && (
              <p className="text-red-500 text-xs mt-1">
                {errors.apellidoPaterno}
              </p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Apellido materno*
            </label>
            <input
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${
                errors.apellidoMaterno ? "border-red-500" : ""
              }`}
              name="apellidoMaterno"
              value={agente.apellidoMaterno}
              onChange={handleChange}
            />
            {errors.apellidoMaterno && (
              <p className="text-red-500 text-xs mt-1">
                {errors.apellidoMaterno}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Correo electrónico*
            </label>
            <input
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${
                errors.correo ? "border-red-500" : ""
              }`}
              name="correo"
              value={agente.correo}
              onChange={handleChange}
            />
            {errors.correo && (
              <p className="text-red-500 text-xs mt-1">{errors.correo}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Teléfono*
            </label>
            <input
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${
                errors.telefono ? "border-red-500" : ""
              }`}
              name="telefono"
              value={agente.telefono}
              onChange={handleChange}
            />
            {errors.telefono && (
              <p className="text-red-500 text-xs mt-1">{errors.telefono}</p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              RFC*
            </label>
            <input
              className="border-0 shadow-md rounded-lg py-2 px-3 w-full bg-gray-100"
              name="rfc"
              value={agente.rfc}
              onChange={handleChange}
              disabled // Deshabilitar el campo RFC
            />
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
            className="text-white font-bold py-2 px-4 botones focus:outline-none focus:shadow-outline"
            onClick={showEditAlert}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarAgente;
