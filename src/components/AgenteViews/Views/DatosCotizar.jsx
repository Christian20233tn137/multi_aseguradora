import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";

registerLocale("es", es);

const DatosCotizar = () => {
  const location = useLocation();
  const id = location.state?.id;
  const idUsuario = id;
  const seguro = location.state?.tipoSeguro;

  const navigate = useNavigate();
  const [idCliente, setIdCliente] = useState(null);
  const [idAsegurado, setIdAsegurado] = useState(null);
  const [esTitularAsegurado, setEsTitularAsegurado] = useState(true);
  const [esTitularExistente, setEsTitularExistente] = useState(false);
  const [rfcTitularExistente, setRfcTitularExistente] = useState("");
  const [titularExistente, setTitularExistente] = useState(null);
  const [mostrarFormularioTitular, setMostrarFormularioTitular] =
    useState(true);
  const [titular, setTitular] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    fechaNacimiento: null,
    telefono: "",
    correo: "",
    rfc: "",
  });
  const [asegurado, setAsegurado] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    fechaNacimiento: null,
    telefono: "",
    correo: "",
    rfc: "",
  });

  const [errors, setErrors] = useState({
    titular: {
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      fechaNacimiento: "",
      telefono: "",
      correo: "",
      rfc: "",
    },
    asegurado: {
      nombre: "",
      apellidoPaterno: "",
      apellidoMaterno: "",
      fechaNacimiento: "",
      telefono: "",
      correo: "",
      rfc: "",
    },
    rfcTitularExistente: "",
  });

  const validateInput = (name, value, isTitular = true) => {
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
      if (value.length > 35) {
        error = "No debe exceder 35 caracteres";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Formato de correo electrónico inválido";
      }
    }

    // Validación de RFC
    if (name === "rfc" && value) {
      if (value.length !== 13) {
        error = "El RFC debe tener exactamente 13 caracteres";
      }
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const error = validateInput(name, value, true);

    setErrors((prev) => ({
      ...prev,
      titular: {
        ...prev.titular,
        [name]: error,
      },
    }));

    setTitular({ ...titular, [name]: value });
  };

  const handleAseguradoChange = (e) => {
    const { name, value } = e.target;
    const error = validateInput(name, value, false);

    setErrors((prev) => ({
      ...prev,
      asegurado: {
        ...prev.asegurado,
        [name]: error,
      },
    }));

    setAsegurado({ ...asegurado, [name]: value });
  };

  const handleFechaNacimientoChange = (date) => {
    let error = "";

    // Validar que el titular sea mayor de edad (18 años)
    if (date) {
      const today = new Date();
      const birthDate = new Date(date);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age < 18) {
        error = "El titular debe ser mayor de edad (18 años)";
      }
    } else {
      error = "La fecha de nacimiento es obligatoria";
    }

    setErrors((prev) => ({
      ...prev,
      titular: {
        ...prev.titular,
        fechaNacimiento: error,
      },
    }));

    setTitular({ ...titular, fechaNacimiento: date });
  };

  const handleFechaNacimientoAseguradoChange = (date) => {
    let error = "";

    // Validar que el asegurado no tenga más de 85 años
    if (date) {
      const today = new Date();
      const birthDate = new Date(date);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }

      if (age > 85) {
        error = "El asegurado no puede tener más de 85 años";
      }
    } else {
      error = "La fecha de nacimiento es obligatoria";
    }

    setErrors((prev) => ({
      ...prev,
      asegurado: {
        ...prev.asegurado,
        fechaNacimiento: error,
      },
    }));

    setAsegurado({ ...asegurado, fechaNacimiento: date });
  };

  const handleRfcTitularExistenteChange = (e) => {
    const { value } = e.target;
    let error = "";

    if (value) {
      if (value.length !== 13) {
        error = "El RFC debe tener exactamente 13 caracteres";
      }
    }

    setErrors((prev) => ({
      ...prev,
      rfcTitularExistente: error,
    }));

    setRfcTitularExistente(value);
  };

  const buscarTitularExistente = async () => {
    if (!rfcTitularExistente) {
      setErrors((prev) => ({
        ...prev,
        rfcTitularExistente: "El RFC es obligatorio",
      }));
      return;
    }

    if (errors.rfcTitularExistente) {
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3001/nar/clientes/rfc/${rfcTitularExistente}`
      );

      if (response.data) {
        setTitularExistente(response.data);
        setMostrarFormularioTitular(false);

        // Mostrar mensaje de éxito
        Swal.fire({
          title: "Titular encontrado",
          text: "Se encontró el titular con el RFC proporcionado",
          icon: "success",
        });
      } else {
        setTitularExistente(null);
        setMostrarFormularioTitular(true);

        // Mostrar mensaje de error
        Swal.fire({
          title: "Titular no encontrado",
          text: "No se encontró ningún titular con el RFC proporcionado",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Error al buscar titular:", error);

      // Mostrar mensaje de error
      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al buscar el titular",
        icon: "error",
      });
    }
  };

  const validarCampos = () => {
    const newErrors = {
      titular: { ...errors.titular },
      asegurado: { ...errors.asegurado },
      rfcTitularExistente: errors.rfcTitularExistente,
    };

    let hasErrors = false;

    // Si es titular existente, validar el RFC
    if (esTitularExistente) {
      if (!rfcTitularExistente) {
        newErrors.rfcTitularExistente = "El RFC es obligatorio";
        hasErrors = true;
      } else if (rfcTitularExistente.length !== 13) {
        newErrors.rfcTitularExistente =
          "El RFC debe tener exactamente 13 caracteres";
        hasErrors = true;
      }

      if (!titularExistente) {
        Swal.fire({
          title: "Error",
          text: "Debe buscar un titular existente antes de continuar",
          icon: "error",
        });
        return false;
      }
    } else {
      // Validar campos del titular
      const camposTitular = {
        nombre: titular.nombre,
        apellidoPaterno: titular.apellidoPaterno,
        apellidoMaterno: titular.apellidoMaterno,
        telefono: titular.telefono,
        correo: titular.correo,
        rfc: titular.rfc,
      };

      Object.keys(camposTitular).forEach((key) => {
        const error = validateInput(key, camposTitular[key], true);
        if (error) {
          newErrors.titular[key] = error;
          hasErrors = true;
        }
      });

      // Validar fecha de nacimiento del titular
      if (!titular.fechaNacimiento) {
        newErrors.titular.fechaNacimiento =
          "La fecha de nacimiento es obligatoria";
        hasErrors = true;
      } else {
        const today = new Date();
        const birthDate = new Date(titular.fechaNacimiento);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        if (age < 18) {
          newErrors.titular.fechaNacimiento =
            "El titular debe ser mayor de edad (18 años)";
          hasErrors = true;
        }
      }
    }

    // Validar campos del asegurado si no es el titular
    if (!esTitularAsegurado) {
      const camposAsegurado = {
        nombre: asegurado.nombre,
        apellidoPaterno: asegurado.apellidoPaterno,
        apellidoMaterno: asegurado.apellidoMaterno,
        telefono: asegurado.telefono,
        correo: asegurado.correo,
        rfc: asegurado.rfc,
      };

      Object.keys(camposAsegurado).forEach((key) => {
        const error = validateInput(key, camposAsegurado[key], false);
        if (error) {
          newErrors.asegurado[key] = error;
          hasErrors = true;
        }
      });

      // Validar fecha de nacimiento del asegurado
      if (!asegurado.fechaNacimiento) {
        newErrors.asegurado.fechaNacimiento =
          "La fecha de nacimiento es obligatoria";
        hasErrors = true;
      } else {
        const today = new Date();
        const birthDate = new Date(asegurado.fechaNacimiento);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        if (age > 85) {
          newErrors.asegurado.fechaNacimiento =
            "El asegurado no puede tener más de 85 años";
          hasErrors = true;
        }
      }
    }

    setErrors(newErrors);

    if (hasErrors) {
      Swal.fire({
        title: "Error de validación",
        text: "Por favor, corrija los errores en el formulario",
        icon: "error",
      });
      return false;
    }

    return true;
  };

  const agregarCotizacion = async () => {
    if (!validarCampos()) {
      return;
    }

    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        confirmButton:
          "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
        cancelButton:
          "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2",
      },
      buttonsStyling: false,
    });

    try {
      const result = await swalWithTailwindButtons.fire({
        title: "¿Estás seguro?",
        text: "¿Deseas enviar esta cotización?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, enviar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      });

      if (!result.isConfirmed) return;

      // Mostrar el indicador de carga
      swalWithTailwindButtons.fire({
        title: "Enviando cotización...",
        text: "Por favor, espere.",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false,
      });

      let newIdCliente;
      let newIdAsegurado;

      // Si es titular existente, usar el ID del titular existente
      if (esTitularExistente && titularExistente) {
        newIdCliente = titularExistente._id;
      } else {
        try {
          // Crear nuevo cliente
          const datosCliente = { ...titular, idUsuario };
          const responseCliente = await axios.post(
            "http://localhost:3001/nar/clientes",
            datosCliente
          );
          newIdCliente = responseCliente.data._id;
        } catch (error) {
          // Cerrar el indicador de carga en caso de error
          swalWithTailwindButtons.close();

          // Verificar si el error es por correo o RFC duplicado
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
            }
          }

          // Si no es un error específico, mostrar mensaje genérico
          swalWithTailwindButtons.fire({
            title: "Error",
            text: "Ocurrió un error al crear el cliente",
            icon: "error",
          });
          return;
        }
      }

      setIdCliente(newIdCliente);

      if (!newIdCliente) {
        throw new Error("No se recibió un idCliente válido");
      }

      // **Paso 2:** Crear asegurado
      try {
        const datosAsegurado = esTitularAsegurado
          ? { ...titular, idCliente: newIdCliente }
          : { ...asegurado, idCliente: newIdCliente };
        const responseAsegurado = await axios.post(
          "http://localhost:3001/nar/asegurados",
          datosAsegurado
        );
        newIdAsegurado = responseAsegurado.data._id; // Suponiendo que el backend devuelve `idAsegurado`
        setIdAsegurado(newIdAsegurado);
      } catch (error) {
        // Cerrar el indicador de carga en caso de error
        swalWithTailwindButtons.close();

        // Verificar si el error es por correo o RFC duplicado
        if (error.response && error.response.data) {
          const errorMessage = error.response.data.message;

          if (errorMessage.includes("correo")) {
            swalWithTailwindButtons.fire({
              title: "Error",
              text: "El correo electrónico del asegurado ya está registrado en el sistema",
              icon: "error",
            });
            return;
          } else if (errorMessage.includes("RFC")) {
            swalWithTailwindButtons.fire({
              title: "Error",
              text: "El RFC del asegurado ya está registrado en el sistema",
              icon: "error",
            });
            return;
          }
        }

        // Si no es un error específico, mostrar mensaje genérico
        swalWithTailwindButtons.fire({
          title: "Error",
          text: "Ocurrió un error al crear el asegurado",
          icon: "error",
        });
        return;
      }

      // Cerrar el indicador de carga
      swalWithTailwindButtons.close();

      // Mensaje de éxito
      swalWithTailwindButtons.fire(
        "Cotización Enviada",
        "La cotización se envió correctamente.",
        "success"
      );

      // Limpiar formularios
      setTitular({
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        fechaNacimiento: null,
        telefono: "",
        correo: "",
        rfc: "",
      });
      setAsegurado({
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        fechaNacimiento: null,
        telefono: "",
        correo: "",
        rfc: "",
      });
      setRfcTitularExistente("");
      setTitularExistente(null);
      setEsTitularExistente(false);
      setMostrarFormularioTitular(true);

      // Navegar a la ruta de seguros con los IDs recién obtenidos
      // En DatosCotizar.js
      navigate("/inicioAgentes/seguros", {
        state: {
          id: id,
          seguro: seguro,
          idCliente: newIdCliente,
          idAsegurado: newIdAsegurado,
        },
      });

    } catch (error) {
      console.error("Error al cotizar:", error);

      // Cerrar el indicador de carga en caso de error
      swalWithTailwindButtons.close();

      swalWithTailwindButtons.fire(
        "Error",
        "Ocurrió un error inesperado.",
        "error"
      );
    }
  };

  const currentYear = new Date().getFullYear();
  const minDate = new Date(currentYear - 85, 0, 1); // 85 años atrás
  const maxDate = new Date(currentYear - 18, 11, 31); // 18 años atrás

  return (
    <div className="p-6 w-full h-auto overflow-hidden">
      <h1 className="text-3xl w-full p-3 text-center font-normal text-white colorFondo rounded-2xl">
        Datos del titular
      </h1>

      <div className="mt-5">
        <label className="text-gray-700 text-sm font-bold">
          ¿Ya ha sido titular antes?*
        </label>
        <div className="flex items-center">
          <label className="ml-2">
            <input
              type="radio"
              name="titularExistente"
              checked={esTitularExistente}
              onChange={() => {
                setEsTitularExistente(true);
                setMostrarFormularioTitular(false);
              }}
            />{" "}
            Sí
          </label>
          <label className="ml-4">
            <input
              type="radio"
              name="titularExistente"
              checked={!esTitularExistente}
              onChange={() => {
                setEsTitularExistente(false);
                setMostrarFormularioTitular(true);
                setTitularExistente(null);
              }}
            />{" "}
            No
          </label>
        </div>
      </div>

      {esTitularExistente && (
        <div className="mt-5">
          <div className="flex items-center">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Ingrese el RFC del titular existente"
                value={rfcTitularExistente}
                onChange={handleRfcTitularExistenteChange}
                className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${errors.rfcTitularExistente ? "border-red-500" : ""
                  }`}
              />
              {errors.rfcTitularExistente && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.rfcTitularExistente}
                </p>
              )}
            </div>
            <button
              className="ml-2 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              style={{ backgroundColor: "#0B1956" }}
              onClick={buscarTitularExistente}
            >
              Buscar
            </button>
          </div>

          {titularExistente && (
            <div className="mt-5 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-bold">Datos del titular existente:</h3>
              <p>
                <strong>Nombre:</strong> {titularExistente.nombre}{" "}
                {titularExistente.apellidoPaterno}{" "}
                {titularExistente.apellidoMaterno}
              </p>
              <p>
                <strong>RFC:</strong> {titularExistente.rfc}
              </p>
              <p>
                <strong>Teléfono:</strong> {titularExistente.telefono}
              </p>
              <p>
                <strong>Correo:</strong> {titularExistente.correo}
              </p>
            </div>
          )}
        </div>
      )}

      {mostrarFormularioTitular && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
          <div>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={titular.nombre}
              onChange={handleChange}
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${errors.titular.nombre ? "border-red-500" : ""
                }`}
            />
            {errors.titular.nombre && (
              <p className="text-red-500 text-xs mt-1">
                {errors.titular.nombre}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="apellidoPaterno"
              placeholder="Apellido Paterno"
              value={titular.apellidoPaterno}
              onChange={handleChange}
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${errors.titular.apellidoPaterno ? "border-red-500" : ""
                }`}
            />
            {errors.titular.apellidoPaterno && (
              <p className="text-red-500 text-xs mt-1">
                {errors.titular.apellidoPaterno}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="apellidoMaterno"
              placeholder="Apellido Materno"
              value={titular.apellidoMaterno}
              onChange={handleChange}
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${errors.titular.apellidoMaterno ? "border-red-500" : ""
                }`}
            />
            {errors.titular.apellidoMaterno && (
              <p className="text-red-500 text-xs mt-1">
                {errors.titular.apellidoMaterno}
              </p>
            )}
          </div>
          <div>
            <DatePicker
              selected={titular.fechaNacimiento}
              onChange={handleFechaNacimientoChange}
              placeholderText="Fecha de Nacimiento"
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${errors.titular.fechaNacimiento ? "border-red-500" : ""
                }`}
              dateFormat="yyyy-MM-dd"
              locale="es"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={125}
              minDate={minDate}
              maxDate={maxDate}
            />
            {errors.titular.fechaNacimiento && (
              <p className="text-red-500 text-xs mt-1">
                {errors.titular.fechaNacimiento}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={titular.telefono}
              onChange={handleChange}
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${errors.titular.telefono ? "border-red-500" : ""
                }`}
            />
            {errors.titular.telefono && (
              <p className="text-red-500 text-xs mt-1">
                {errors.titular.telefono}
              </p>
            )}
          </div>
          <div>
            <input
              type="email"
              name="correo"
              placeholder="Correo Electrónico"
              value={titular.correo}
              onChange={handleChange}
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${errors.titular.correo ? "border-red-500" : ""
                }`}
            />
            {errors.titular.correo && (
              <p className="text-red-500 text-xs mt-1">
                {errors.titular.correo}
              </p>
            )}
          </div>
          <div>
            <input
              type="text"
              name="rfc"
              placeholder="RFC"
              value={titular.rfc}
              onChange={handleChange}
              className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${errors.titular.rfc ? "border-red-500" : ""
                }`}
            />
            {errors.titular.rfc && (
              <p className="text-red-500 text-xs mt-1">{errors.titular.rfc}</p>
            )}
          </div>
        </div>
      )}

      <div className="mt-6">
        <label className="text-gray-700 text-sm font-bold">
          ¿El titular también será el asegurado?*
        </label>
        <div className="flex items-center">
          <label className="ml-2">
            <input
              type="radio"
              name="asegurado"
              checked={esTitularAsegurado}
              onChange={() => setEsTitularAsegurado(true)}
            />{" "}
            Sí
          </label>
          <label className="ml-4">
            <input
              type="radio"
              name="asegurado"
              checked={!esTitularAsegurado}
              onChange={() => setEsTitularAsegurado(false)}
            />{" "}
            No
          </label>
        </div>
      </div>

      {!esTitularAsegurado && (
        <div className="mt-10">
          <h2 className="text-xl font-bold">Datos del asegurado</h2>
          <div className="grid mt-5 grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                value={asegurado.nombre}
                onChange={handleAseguradoChange}
                className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${errors.asegurado.nombre ? "border-red-500" : ""
                  }`}
              />
              {errors.asegurado.nombre && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.asegurado.nombre}
                </p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="apellidoPaterno"
                placeholder="Apellido Paterno"
                value={asegurado.apellidoPaterno}
                onChange={handleAseguradoChange}
                className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${errors.asegurado.apellidoPaterno ? "border-red-500" : ""
                  }`}
              />
              {errors.asegurado.apellidoPaterno && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.asegurado.apellidoPaterno}
                </p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="apellidoMaterno"
                placeholder="Apellido Materno"
                value={asegurado.apellidoMaterno}
                onChange={handleAseguradoChange}
                className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${errors.asegurado.apellidoMaterno ? "border-red-500" : ""
                  }`}
              />
              {errors.asegurado.apellidoMaterno && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.asegurado.apellidoMaterno}
                </p>
              )}
            </div>
            <div>
              <DatePicker
                selected={asegurado.fechaNacimiento}
                onChange={handleFechaNacimientoAseguradoChange}
                placeholderText="Fecha de Nacimiento"
                className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${errors.asegurado.fechaNacimiento ? "border-red-500" : ""
                  }`}
                dateFormat="yyyy-MM-dd"
                locale="es"
                showYearDropdown
                scrollableYearDropdown
                yearDropdownItemNumber={125}
                minDate={new Date(1950, 0, 1)}
                maxDate={new Date(2024, 11, 31)}
              />
              {errors.asegurado.fechaNacimiento && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.asegurado.fechaNacimiento}
                </p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="telefono"
                placeholder="Teléfono"
                value={asegurado.telefono}
                onChange={handleAseguradoChange}
                className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${errors.asegurado.telefono ? "border-red-500" : ""
                  }`}
              />
              {errors.asegurado.telefono && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.asegurado.telefono}
                </p>
              )}
            </div>
            <div>
              <input
                type="email"
                name="correo"
                placeholder="Correo Electrónico"
                value={asegurado.correo}
                onChange={handleAseguradoChange}
                className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${errors.asegurado.correo ? "border-red-500" : ""
                  }`}
              />
              {errors.asegurado.correo && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.asegurado.correo}
                </p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="rfc"
                placeholder="RFC"
                value={asegurado.rfc}
                onChange={handleAseguradoChange}
                className={`border-0 shadow-md rounded-lg py-2 px-3 w-full ${errors.asegurado.rfc ? "border-red-500" : ""
                  }`}
              />
              {errors.asegurado.rfc && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.asegurado.rfc}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center mt-6">
        <button
          className="text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          style={{ backgroundColor: "#0B1956" }}
          onClick={agregarCotizacion}
        >
          Cotizar
        </button>
      </div>
    </div>
  );
};

export default DatosCotizar;
