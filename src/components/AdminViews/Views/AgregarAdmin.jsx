import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

const AgregarAdmin = () => {
  const location = useLocation();
  const id = location.state?.id;
  console.log("Prueba", id);
  // Estados editables
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rfc, setRfc] = useState("");
  const [curp, setCurp] = useState("");

  // Estado para errores
  const [errors, setErrors] = useState({
    nombre: "",
    correo: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    telefono: "",
    rfc: "",
    curp: "",
  });

  //Validaciones:
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

    //Validacion de RFC
    if (name === "rfc" && value) {
      if (value.length !== 13) {
        error = "El RFC debe tener 13 caracteres";
      }
    }

    //Validacion de CURP
    if (name === "curp" && value) {
      if (value.length !== 18) {
        error = "El CURP debe tener 18 caracteres";
      }
    }

    return error;
  };

  // Función para manejar cambios en los inputs
  const handleInputChange = (name, value, setValue) => {
    const error = validateInput(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
    setValue(value);
  };

  // Función para verificar si el correo ya existe
  const checkIfEmailExists = async (email) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/nar/usuarios/checkEmail/${email}`
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error al verificar el correo", error);
      return false;
    }
  };

  // Función para verificar si el teléfono ya existe
  const checkIfPhoneExists = async (phone) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/nar/usuarios/checkPhone/${phone}`
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error al verificar el teléfono", error);
      return false;
    }
  };

  // Función para verificar si el RFC ya existe
  const checkIfRfcExists = async (rfc) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/nar/usuarios/checkRfc/${rfc}`
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error al verificar el RFC", error);
      return false;
    }
  };

  // Función para verificar si el CURP ya existe
  const checkIfCurpExists = async (curp) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/nar/usuarios/checkCurp/${curp}`
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error al verificar el CURP", error);
      return false;
    }
  };

  // Función para enviar la cotización al backend
  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton:
        "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
      cancelButton:
        "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2",
    },
    buttonsStyling: false,
  });

  const agregarCotizacion = async () => {
    // Validar todos los campos antes de enviar
    const newErrors = {};
    let hasErrors = false;

    // Validar cada campo
    const fields = {
      nombre,
      correo,
      apellidoPaterno,
      apellidoMaterno,
      telefono,
      rfc,
      curp,
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
      return;
    }

    // Validación básica
    if (!nombre || !correo || !apellidoPaterno || !telefono || !rfc || !curp) {
      swalWithTailwindButtons.fire(
        "Error",
        "Todos los campos marcados con * son obligatorios.",
        "error"
      );
      return;
    }

    // Verificar si el correo ya existe
    const emailExists = await checkIfEmailExists(correo);
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
    const phoneExists = await checkIfPhoneExists(telefono);
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

    // Verificar si el RFC ya existe
    const rfcExists = await checkIfRfcExists(rfc);
    if (rfcExists) {
      setErrors((prev) => ({
        ...prev,
        rfc: "El RFC ya está registrado en el sistema",
      }));
      swalWithTailwindButtons.fire({
        title: "Error",
        text: "El RFC ya está registrado en el sistema",
        icon: "error",
      });
      return;
    }

    // Verificar si el CURP ya existe
    const curpExists = await checkIfCurpExists(curp);
    if (curpExists) {
      setErrors((prev) => ({
        ...prev,
        curp: "El CURP ya está registrado en el sistema",
      }));
      swalWithTailwindButtons.fire({
        title: "Error",
        text: "El CURP ya está registrado en el sistema",
        icon: "error",
      });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/nar/usuarios/admin",
        {
          nombre,
          correo,
          apellidoPaterno,
          apellidoMaterno,
          telefono,
          rfc,
          curp,
        }
      );

      if (response.status === 200) {
        swalWithTailwindButtons.fire(
          "Administrador agregado",
          "El administrador se registró correctamente.",
          "success"
        );
        // Opcional: limpiar el formulario
        setNombre("");
        setCorreo("");
        setApellidoPaterno("");
        setApellidoMaterno("");
        setTelefono("");
        setRfc("");
        setCurp("");
      } else {
        swalWithTailwindButtons.fire(
          "Error",
          "Hubo un problema al registrar el administrador.",
          "error"
        );
      }
    } catch (error) {
      console.error("Error al registrar:", error);

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
        } else if (errorMessage && errorMessage.includes("rfc")) {
          setErrors((prev) => ({
            ...prev,
            rfc: "El RFC ya está registrado en el sistema",
          }));
          swalWithTailwindButtons.fire({
            title: "Error",
            text: "El RFC ya está registrado en el sistema",
            icon: "error",
          });
          return;
        } else if (errorMessage && errorMessage.includes("curp")) {
          setErrors((prev) => ({
            ...prev,
            curp: "El CURP ya está registrado en el sistema",
          }));
          swalWithTailwindButtons.fire({
            title: "Error",
            text: "El CURP ya está registrado en el sistema",
            icon: "error",
          });
          return;
        }
      }

      swalWithTailwindButtons.fire(
        "Error",
        "Ocurrió un error inesperado.",
        "error"
      );
    }
  };

  // Confirmación con SweetAlert
  const confirmarCotizacion = () => {
    // Validar todos los campos antes de mostrar la alerta
    const newErrors = {};
    let hasErrors = false;

    // Validar cada campo
    const fields = {
      nombre,
      correo,
      apellidoPaterno,
      apellidoMaterno,
      telefono,
      rfc,
      curp,
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
      return;
    }

    swalWithTailwindButtons
      .fire({
        title: "¿Estás seguro?",
        text: "¿Quieres registrar a este administrador?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, enviar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithTailwindButtons.fire({
            title: "Agregando administrador..",
            text: "Por favor espera.",
            icon: "info",
            showConfirmButton: false,
            allowOutsideClick: false,
          });
          agregarCotizacion();
        }
      });
  };

  return (
    <div className="p-6 w-full h-auto overflow-hidden">
      <h1 className="text-3xl w-full p-3 text-center font-normal text-black miColor rounded-2xl">
        Agregar Administrador
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        {[
          {
            label: "Nombre*",
            value: nombre,
            setValue: setNombre,
            type: "text",
            placeholder: "Nombre",
            name: "nombre",
          },
          {
            label: "Apellido paterno*",
            value: apellidoPaterno,
            setValue: setApellidoPaterno,
            type: "text",
            placeholder: "Apellido Paterno",
            name: "apellidoPaterno",
          },
          {
            label: "Apellido materno",
            value: apellidoMaterno,
            setValue: setApellidoMaterno,
            type: "text",
            placeholder: "Apellido Materno",
            name: "apellidoMaterno",
          },
          {
            label: "Teléfono*",
            value: telefono,
            setValue: setTelefono,
            type: "text",
            placeholder: "Teléfono",
            name: "telefono",
          },
          {
            label: "Correo electrónico*",
            value: correo,
            setValue: setCorreo,
            type: "email",
            placeholder: "Correo electrónico",
            name: "correo",
          },
          {
            label: "RFC*",
            value: rfc,
            setValue: setRfc,
            type: "text",
            placeholder: "RFC",
            name: "rfc",
          },
          {
            label: "CURP*",
            value: curp,
            setValue: setCurp,
            type: "text",
            placeholder: "CURP",
            name: "curp",
          },
        ].map((field, index) => (
          <div key={index} className="flex flex-col">
            <label className="text-gray-700 text-sm font-bold mb-2">
              {field.label}
            </label>
            <input
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${
                errors[field.name] ? "border-red-500" : ""
              }`}
              type={field.type}
              value={field.value}
              onChange={(e) =>
                handleInputChange(field.name, e.target.value, field.setValue)
              }
              placeholder={field.placeholder}
            />
            {errors[field.name] && (
              <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
            )}
          </div>
        ))}
      </div>

      {/* Botón Agregar*/}
      <div className="flex items-center justify-center mt-6">
        <button
          type="button"
          className="text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          style={{ backgroundColor: "#0B1956" }}
          onClick={confirmarCotizacion}
        >
          Agregar
        </button>
      </div>
    </div>
  );
};

export default AgregarAdmin;
