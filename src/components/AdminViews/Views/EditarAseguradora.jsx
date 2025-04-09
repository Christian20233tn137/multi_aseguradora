import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "http://localhost:3001/nar/aseguradoras/id";
const API_URL_EDIT = "http://localhost:3001/nar/aseguradoras";

const EditarAseguradora = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;
  const idaseguradora = location.state?.aseguradoraId;
  console.log("ID del admin:", id);
  console.log("ID de la aseguradora:", idaseguradora);
  const [aseguradora, setAseguradora] = useState({
    nombre: "",
    nombreContacto: "",
    telefonoContacto: "",
    correoContacto: "",
    informacion: "",
  });
  const [errors, setErrors] = useState({
    nombre: "",
    nombreContacto: "",
    telefonoContacto: "",
    correoContacto: "",
    informacion: "",
  });
  const [loading, setLoading] = useState(true);
  const [correoOriginal, setCorreoOriginal] = useState("");
  const [telefonoOriginal, setTelefonoOriginal] = useState("");

  useEffect(() => {
    const fetchAseguradoraDetails = async () => {
      try {
        if (location.state && location.state.aseguradora) {
          setAseguradora(location.state.aseguradora);
          setCorreoOriginal(location.state.aseguradora.correoContacto);
          setTelefonoOriginal(location.state.aseguradora.telefonoContacto);
        } else if (idaseguradora) {
          const response = await axios.get(`${API_URL}/${idaseguradora}`);
          setAseguradora(response.data);
          setCorreoOriginal(response.data.correoContacto);
          setTelefonoOriginal(response.data.telefonoContacto);
        } else {
          throw new Error("ID de aseguradora no definido");
        }
      } catch (error) {
        console.error("Error al obtener detalles de la aseguradora:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron obtener los detalles de la aseguradora.",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAseguradoraDetails();
  }, [idaseguradora, location.state]);

  const validateInput = (name, value) => {
    let error = "";

    // Validación de longitud máxima para campos específicos
    if (["nombre", "nombreContacto", "telefonoContacto"].includes(name)) {
      if (value.length > 15) {
        error = "No debe exceder 15 caracteres";
      }
    }

    // Validación para campos que no deben contener números ni caracteres especiales
    if (["nombre", "nombreContacto"].includes(name)) {
      if (/\d/.test(value)) {
        error = "No se permiten números en este campo";
      }
      if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        error = "No se permiten caracteres especiales en este campo";
      }
    }

    // Validación específica para información
    if (name === "informacion") {
      if (value.length > 50) {
        error = "No debe exceder 50 caracteres";
      }
      if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        error = "No se permiten caracteres especiales en este campo";
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

  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton:
        "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
      cancelButton:
        "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2",
    },
    buttonsStyling: false,
  });

  const checkIfEmailExists = async (email) => {
    // Si el correo es el mismo que ya tiene la aseguradora, no es un error
    if (email === correoOriginal) {
      return false;
    }

    try {
      const response = await axios.get(
        `http://localhost:3001/nar/aseguradoras/checkEmail/${email}`
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error al verificar el correo", error);
      return false;
    }
  };

  const checkIfPhoneExists = async (phone) => {
    // Si el teléfono es el mismo que ya tiene la aseguradora, no es un error
    if (phone === telefonoOriginal) {
      return false;
    }

    try {
      const response = await axios.get(
        `http://localhost:3001/nar/aseguradoras/checkPhone/${phone}`
      );
      return response.data.exists;
    } catch (error) {
      console.error("Error al verificar el teléfono", error);
      return false;
    }
  };

  const handleEditSubmit = async () => {
    // Validar todos los campos antes de enviar
    const newErrors = {};
    let hasErrors = false;

    Object.keys(aseguradora).forEach((key) => {
      if (key !== "seguros") {
        // Excluir el campo seguros de la validación
        const error = validateInput(key, aseguradora[key]);
        if (error) {
          newErrors[key] = error;
          hasErrors = true;
        }
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

    // Verificar si el correo ya existe
    const emailExists = await checkIfEmailExists(aseguradora.correoContacto);
    if (emailExists) {
      setErrors((prev) => ({
        ...prev,
        correoContacto:
          "El correo electrónico ya está registrado en el sistema",
      }));
      swalWithTailwindButtons.fire({
        title: "Error",
        text: "El correo electrónico ya está registrado en el sistema",
        icon: "error",
      });
      return;
    }

    // Verificar si el teléfono ya existe
    const phoneExists = await checkIfPhoneExists(aseguradora.telefonoContacto);
    if (phoneExists) {
      setErrors((prev) => ({
        ...prev,
        telefonoContacto: "El teléfono ya está registrado en el sistema",
      }));
      swalWithTailwindButtons.fire({
        title: "Error",
        text: "El teléfono ya está registrado en el sistema",
        icon: "error",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("nombre", aseguradora.nombre);
      formData.append("nombreContacto", aseguradora.nombreContacto);
      formData.append("telefonoContacto", aseguradora.telefonoContacto);
      formData.append("correoContacto", aseguradora.correoContacto);
      formData.append("informacion", aseguradora.informacion);

      const response = await axios.put(
        `${API_URL_EDIT}/${idaseguradora}`,
        formData
      );

      swalWithTailwindButtons.fire({
        title: response.status === 200 ? "¡Editado!" : "Error",
        text:
          response.status === 200
            ? "La aseguradora se editó con éxito."
            : "Error al editar",
        icon: response.status === 200 ? "success" : "error",
      });

      if (response.status === 200)
        navigate("/aseguradoras", { state: { id: id } });
    } catch (error) {
      console.error("Error al editar:", error);

      // Verificar si el error es por datos duplicados
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message;

        if (errorMessage && errorMessage.includes("correo")) {
          setErrors((prev) => ({
            ...prev,
            correoContacto:
              "El correo electrónico ya está registrado en el sistema",
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
            telefonoContacto: "El teléfono ya está registrado en el sistema",
          }));
          swalWithTailwindButtons.fire({
            title: "Error",
            text: "El teléfono ya está registrado en el sistema",
            icon: "error",
          });
          return;
        }
      }

      Swal.fire({
        title: "Error",
        text: "No se pudo editar la aseguradora.",
        icon: "error",
      });
    }
  };

  const showEditAlert = () => {
    // Validar todos los campos antes de mostrar la alerta
    const newErrors = {};
    let hasErrors = false;

    Object.keys(aseguradora).forEach((key) => {
      if (key !== "seguros") {
        // Excluir el campo seguros de la validación
        const error = validateInput(key, aseguradora[key]);
        if (error) {
          newErrors[key] = error;
          hasErrors = true;
        }
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
        title: "¿Deseas guardar los cambios?",
        text: "Se actualizará la aseguradora.",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sí, guardar cambios",
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const error = validateInput(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    setAseguradora({ ...aseguradora, [name]: value });
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex items-center justify-center w-auto h-auto p-6">
      <div className="bg-white p-8 rounded w-full max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Editar Aseguradora
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nombre*
            </label>
            <input
              type="text"
              name="nombre"
              value={aseguradora.nombre}
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${
                errors.nombre ? "border-red-500" : ""
              }`}
              onChange={handleInputChange}
            />
            {errors.nombre && (
              <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nombre del contacto*
            </label>
            <input
              type="text"
              name="nombreContacto"
              value={aseguradora.nombreContacto}
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${
                errors.nombreContacto ? "border-red-500" : ""
              }`}
              onChange={handleInputChange}
            />
            {errors.nombreContacto && (
              <p className="text-red-500 text-xs mt-1">
                {errors.nombreContacto}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Teléfono del contacto*
            </label>
            <input
              type="text"
              name="telefonoContacto"
              value={aseguradora.telefonoContacto}
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${
                errors.telefonoContacto ? "border-red-500" : ""
              }`}
              onChange={handleInputChange}
            />
            {errors.telefonoContacto && (
              <p className="text-red-500 text-xs mt-1">
                {errors.telefonoContacto}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Correo electrónico del contacto*
            </label>
            <input
              type="email"
              name="correoContacto"
              value={aseguradora.correoContacto}
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${
                errors.correoContacto ? "border-red-500" : ""
              }`}
              onChange={handleInputChange}
            />
            {errors.correoContacto && (
              <p className="text-red-500 text-xs mt-1">
                {errors.correoContacto}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Información*
            </label>
            <input
              type="text"
              name="informacion"
              value={aseguradora.informacion}
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${
                errors.informacion ? "border-red-500" : ""
              }`}
              onChange={handleInputChange}
            />
            {errors.informacion && (
              <p className="text-red-500 text-xs mt-1">{errors.informacion}</p>
            )}
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <button
              type="button"
              className="botones text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={showEditAlert}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarAseguradora;
