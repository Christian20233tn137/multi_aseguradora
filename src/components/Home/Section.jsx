import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Close from "./assets/Close.png";

const Section = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefono: "",
    rfc: "",
    curp: "",
  });
  const [errors, setErrors] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefono: "",
    rfc: "",
    curp: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton:
        "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
      cancelButton:
        "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2",
    },
    buttonsStyling: false,
  });

  const openModal = () => {
    setIsOpening(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsClosing(false);
      setIsOpening(false);
      setErrorMessage("");
      // Limpiar errores al cerrar el modal
      setErrors({
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        correo: "",
        telefono: "",
        rfc: "",
        curp: "",
      });
    }, 300); // Duración de la animación
  };

  useEffect(() => {
    if (isModalOpen && isOpening) {
      const timer = setTimeout(() => {
        setIsOpening(false);
      }, 300); // Duración de la animación de apertura
      return () => clearTimeout(timer);
    }
  }, [isModalOpen, isOpening]);

  const validateField = (name, value) => {
    let error = "";

    // Validación para nombres y apellidos
    if (["nombre", "apellidoPaterno", "apellidoMaterno"].includes(name)) {
      // Máximo 20 caracteres
      if (value.length > 20) {
        error = "No debe exceder 20 caracteres";
      }
      if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        error = "No se permiten caracteres especiales en este campo";
      }
      // No permitir números
      if (/\d/.test(value)) {
        error = "No se permiten números en este campo";
      }
    }

    // Validación para teléfono
    if (name === "telefono") {
      // Máximo 10 dígitos
      if (value.length > 10) {
        error = "No debe exceder 10 dígitos";
      }
      // Solo números
      if (!/^\d*$/.test(value)) {
        error = "Solo se permiten números";
      }
    }

    // Validación para correo
    if (name === "correo") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (value && !emailPattern.test(value)) {
        error = "Ingrese un correo electrónico válido";
      }
      // Máximo 25 caracteres
      if (value.length > 25) {
        error = "No debe exceder 25 caracteres";
      }
    }

    // Validación para RFC
    if (name === "rfc") {
      const rfcPattern = /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/;
      if (value && !rfcPattern.test(value)) {
        error = "El RFC no tiene un formato válido (ej. ABC123456XYZ)";
      }
    }

    // Validación para CURP
    if (name === "curp") {
      const curpPattern =
        /^[A-Z]{4}\d{6}[HM]{1}[A-Z]{2}[BCDFGHJKLMNPQRSTVWXYZ]{3}[A-Z\d]{2}$/;
      if (value && !curpPattern.test(value)) {
        error = "La CURP no tiene un formato válido (ej. ABCD123456HMZXYZ)";
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Validar el campo
    const error = validateField(name, value);

    // Actualizar el estado de errores
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    // Actualizar el formulario
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Datos a enviar:", formData);

      // Validar todos los campos antes de enviar
      const newErrors = {};
      let hasErrors = false;

      Object.keys(formData).forEach((key) => {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
          hasErrors = true;
        }
      });

      // Si hay errores, actualizar el estado y detener el envío
      if (hasErrors) {
        setErrors(newErrors);
        throw new Error("Por favor, corrija los errores en el formulario");
      }

      // Validar que todos los campos estén llenos
      if (
        !formData.nombre ||
        !formData.apellidoPaterno ||
        !formData.apellidoMaterno ||
        !formData.curp ||
        !formData.rfc ||
        !formData.correo ||
        !formData.telefono
      ) {
        throw new Error("Todos los campos son requeridos");
      }

      swalWithTailwindButtons.fire({
        title: "Enviando...",
        text: "Por favor espera.",
        icon: "info",
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      try {
        await axios.post(
          "https://lz2k718xka.execute-api.us-east-1.amazonaws.com/nar/usuarios/postulante",
          formData
        );

        // Show success alert with SweetAlert2
        swalWithTailwindButtons
          .fire({
            title: "Éxito",
            text: "Postulación enviada con éxito",
            icon: "success",
            confirmButtonText: "Aceptar",
          })
          .then(() => {
            closeModal();
          });
      } catch (error) {
        // Cerrar el indicador de carga
        swalWithTailwindButtons.close();

        // Verificar si el error es por datos duplicados
        if (error.response && error.response.data) {
          const errorMessage = error.response.data.message;

          if (errorMessage.includes("correo")) {
            swalWithTailwindButtons.fire({
              title: "Error",
              text: "El correo electrónico ya está registrado en el sistema",
              icon: "error",
            });
            return;
          } else if (errorMessage.includes("RFC")) {
            swalWithTailwindButtons.fire({
              title: "Error",
              text: "El RFC ya está registrado en el sistema",
              icon: "error",
            });
            return;
          } else if (errorMessage.includes("CURP")) {
            swalWithTailwindButtons.fire({
              title: "Error",
              text: "La CURP ya está registrada en el sistema",
              icon: "error",
            });
            return;
          } else if (errorMessage.includes("teléfono")) {
            swalWithTailwindButtons.fire({
              title: "Error",
              text: "El teléfono ya está registrado en el sistema",
              icon: "error",
            });
            return;
          }
        }

        // Si no es un error específico, mostrar mensaje genérico
        swalWithTailwindButtons.fire({
          title: "Error",
          text:
            "Hubo un error al enviar la postulación: " +
            (error.response?.data?.message || error.message),
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      }
    } catch (error) {
      console.error("Error al enviar la postulación", error);
      setErrorMessage(error.message);

      // Show error alert with SweetAlert2
      swalWithTailwindButtons.fire({
        title: "Error",
        text: "Hubo un error al enviar la postulación: " + error.message,
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    }
  };

  return (
    <section className="flex flex-col justify-center items-center p-5 lg:p-10">
      <div className="w-full max-w-[400px] text-center">
        <h1 className="text-2xl lg:text-4xl font-bold text-blue-950">
          BUSCAMOS AGENTES
        </h1>
        <p className="mt-2 lg:mt-3 text-black text-sm lg:text-base">
          ¡Impulsa tu éxito con Nar! Únete como agente y disfruta de ingresos
          atractivos, libertad laboral y el respaldo de una multi aseguradora
          líder. ¡Postúlate hoy y transforma tu futuro!
        </p>
        <button
          className="mt-4 lg:mt-6 text-white px-6 py-2 botones w-full"
          onClick={openModal}
        >
          Postularme
        </button>
      </div>

      {isModalOpen && (
        <div
          className={`fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center px-4 z-50 transition-opacity duration-300 ${
            isClosing ? "opacity-0" : "opacity-100"
          }`}
        >
          <div
            className={`bg-white rounded-lg shadow-lg w-full sm:max-w-lg md:max-w-xl lg:max-w-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto relative transition-transform duration-300 ${
              isClosing ? "scale-95 opacity-0" : "scale-100 opacity-100"
            } ${isOpening ? "scale-105 opacity-0" : ""}`}
          >
            <div className="flex justify-between items-center p-2 border-b">
              <h2 className="text-left font-bold text-lg">Postularme</h2>
              <img
                className="object-cover w-13vis h-13 cursor-pointer p-2"
                src={Close}
                alt="Cerrar"
                onClick={closeModal}
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Nombre*", type: "text", name: "nombre" },
                  {
                    label: "Apellido paterno*",
                    type: "text",
                    name: "apellidoPaterno",
                  },
                  {
                    label: "Apellido materno*",
                    type: "text",
                    name: "apellidoMaterno",
                  },
                  {
                    label: "Correo electrónico*",
                    type: "email",
                    name: "correo",
                  },
                  { label: "Teléfono*", type: "tel", name: "telefono" },
                  { label: "RFC*", type: "text", name: "rfc" },
                  { label: "CURP*", type: "text", name: "curp" },
                ].map((field, index) => (
                  <div key={index} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className={`mt-1 p-2 w-full border rounded-md ${
                        errors[field.name] ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {errors[field.name] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[field.name]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <div className="mt-4 flex justify-center">
                <button
                  type="submit"
                  className="w-30 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 botones"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Section;
