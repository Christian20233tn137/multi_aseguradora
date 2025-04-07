import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const NuevaAseguradora = () => {
  const location = useLocation();
  const id = location.state?.id;
  console.log("Prueba", id);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: "",
    informacion: "",
    nombreContacto: "",
    correoContacto: "",
    telefonoContacto: "",
  });

  const [errors, setErrors] = useState({
    nombre: "",
    informacion: "",
    nombreContacto: "",
    correoContacto: "",
    telefonoContacto: "",
  });

  const validateInput = (name, value) => {
    let error = "";

    // Validación de longitud máxima para campos específicos
    if (["nombre", "nombreContacto"].includes(name)) {
      if (value.length > 20) {
        error = "No debe exceder 20 caracteres";
      }
    }

    //Validacion maximo de campos en telefono
    if (["telefonoContacto"].includes(name)) {
      if (value.length > 10) {
        error = "No debe exceder 10 caracteres";
      }
    }

    // Validación para campos que no deben contener números
    if (["nombre", "nombreContacto"].includes(name)) {
      if (/\d/.test(value)) {
        error = "No se permiten números en este campo";
      }
    }

    // Validación específica para información
    if (name === "informacion") {
      if (value.length > 50) {
        error = "No debe exceder 50 caracteres";
      }
    }

    // Validación específica para teléfono
    if (name === "telefonoContacto") {
      if (!/^\d{0,10}$/.test(value)) {
        error = "Solo se permiten números y máximo 10 dígitos";
      }
    }

    // Validación de correo electrónico
    if (name === "correoContacto" && value) {
      if (value.length > 25) {
        error = "No debe exceder 25 caracteres";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Formato de correo electrónico inválido";
      }
    }

    return error;
  };

  const handleRegresar = () => {
    navigate("/aseguradoras", { state: { id: id } });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateInput(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton:
        "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
      cancelButton:
        "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2",
    },
    buttonsStyling: false,
  });

  const handleSubmit = async () => {
    // Validar todos los campos antes de enviar
    const newErrors = {};
    let hasErrors = false;

    Object.keys(formData).forEach((key) => {
      const error = validateInput(key, formData[key]);
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

    // Deshabilitar botones y mostrar loader
    Swal.fire({
      title: "Enviando...",
      icon: "info",
      text: "Por favor, espere.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await axios.post(
        "http://localhost:3000/nar/aseguradoras",
        formData
      );

      // Cerrar loader
      Swal.close();

      swalWithTailwindButtons.fire({
        title: response.status === 200 ? "¡Aceptado!" : "Error",
        text:
          response.status === 200
            ? "La aseguradora fue registrada con éxito"
            : "Hubo un problema al enviar los datos",
        icon: response.status === 200 ? "success" : "error",
      });

      if (response.status === 200)
        navigate("/aseguradoras", { state: { id: id } });
    } catch (error) {
      // Cerrar loader en caso de error
      Swal.close();
      console.error("Error al enviar los datos:", error);
      swalWithTailwindButtons.fire({
        title: "Error",
        text: "Hubo un problema al enviar los datos",
        icon: "error",
      });
    }
  };

  const showAlert = () => {
    // Validar todos los campos antes de mostrar la alerta
    const newErrors = {};
    let hasErrors = false;

    Object.keys(formData).forEach((key) => {
      const error = validateInput(key, formData[key]);
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
        title: "¿Deseas agregar esta aseguradora?",
        text: "No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, quiero agregarla!",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithTailwindButtons.fire({
            title: "Agregando aseguradora...",
            text: "Por favor, espere.",
            icon: "info",
            allowOutsideClick: false,
            showConfirmButton: false,
          });
          handleSubmit(); // Mueve handleSubmit dentro del bloque if para que solo se ejecute si se confirma
        }
      });
  };

  return (
    <div className="flex items-center justify-center w-auto h-auto p-6">
      <div className="bg-white p-8 rounded w-full max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Registro</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">


        <div className="mb-4 md:col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nombre de la seguradora*
            </label>
            <input
              type="text"
              name="nombre"
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${
                errors.nombre ? "border-red-500" : ""
              }`}
              placeholder="Nombre aseguradora"
              value={formData.nombre}
              onChange={handleChange}
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
            )}
          </div>
     


          <div className="mb-4 md:col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Información de la aseguradora*
            </label>
            <input
              type="text"
              name="informacion"
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${
                errors.informacion ? "border-red-500" : ""
              }`}
              placeholder="Información aseguradora"
              value={formData.informacion}
              onChange={handleChange}
            />
            {errors.informacion && (
              <p className="text-red-500 text-xs mt-1">{errors.informacion}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nombre del contacto*
            </label>
            <input
              type="text"
              name="nombreContacto"
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${
                errors.nombreContacto ? "border-red-500" : ""
              }`}
              placeholder="Nombre del contacto"
              value={formData.nombreContacto}
              onChange={handleChange}
            />
            {errors.nombreContacto && (
              <p className="text-red-500 text-xs mt-1">
                {errors.nombreContacto}
              </p>
            )}
          </div>

          
      

          <div className="mb-4 md:col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Teléfono del contacto*
            </label>
            <input
              type="text"
              name="telefonoContacto"
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${
                errors.telefonoContacto ? "border-red-500" : ""
              }`}
              placeholder="Teléfono del contacto"
              value={formData.telefonoContacto}
              onChange={handleChange}
            />
            {errors.telefonoContacto && (
              <p className="text-red-500 text-xs mt-1">
                {errors.telefonoContacto}
              </p>
            )}
          </div>

          <div className="mb-4 md:col-span-1">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Correo electrónico del contacto*
            </label>
            <input
              type="email"
              name="correoContacto"
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${
                errors.correoContacto ? "border-red-500" : ""
              }`}
              placeholder="Correo electrónico del contacto"
              value={formData.correoContacto}
              onChange={handleChange}
            />
            {errors.correoContacto && (
              <p className="text-red-500 text-xs mt-1">
                {errors.correoContacto}
              </p>
            )}
          </div>

          <div className="col-span-2 flex items-center justify-center">
            <button
              type="button"
              className="botones text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-2"
              onClick={handleRegresar}
            >
              Regresar
            </button>

            <button
              type="button"
              className="botones text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mx-2"
              onClick={showAlert}
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NuevaAseguradora;
