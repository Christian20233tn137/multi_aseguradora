import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";

// Registrar el locale en español
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

  const handleChange = (e) => {
    setTitular({ ...titular, [e.target.name]: e.target.value });
  };

  const handleAseguradoChange = (e) => {
    setAsegurado({ ...asegurado, [e.target.name]: e.target.value });
  };

  const handleFechaNacimientoChange = (date) => {
    setTitular({ ...titular, fechaNacimiento: date });
  };

  const handleFechaNacimientoAseguradoChange = (date) => {
    setAsegurado({ ...asegurado, fechaNacimiento: date });
  };

  const agregarCotizacion = async () => {
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

      const datosCliente = { ...titular, idUsuario };

      // **Paso 1:** Crear cliente y obtener `idCliente`
      const responseCliente = await axios.post(
        "http://localhost:3000/nar/clientes",
        datosCliente
      );
      const newIdCliente = responseCliente.data._id; // Suponiendo que el backend devuelve `idCliente`
      setIdCliente(newIdCliente);

      if (!newIdCliente) {
        throw new Error("No se recibió un idCliente válido");
      }

      // **Paso 2:** Crear asegurado
      const datosAsegurado = esTitularAsegurado
        ? { ...titular, idCliente: newIdCliente }
        : { ...asegurado, idCliente: newIdCliente };
      const responseAsegurado = await axios.post(
        "http://localhost:3000/nar/asegurados",
        datosAsegurado
      );
      const newIdAsegurado = responseAsegurado.data._id; // Suponiendo que el backend devuelve `idAsegurado`
      setIdAsegurado(newIdAsegurado);

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

      // Navegar a la ruta de seguros con los IDs recién obtenidos
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
      swalWithTailwindButtons.fire(
        "Error",
        "Ocurrió un error inesperado.",
        "error"
      );
    }
  };

  const handleSeguros = () => {
    navigate("/inicioAgentes/seguros", {
      state: {
        id: id,
        seguro: seguro,
        idCliente: idCliente,
        idAsegurado: idAsegurado,
      },
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="p-6 w-full h-auto overflow-hidden">
      <style>
        {`
          .bg-navy-blue {
            background-color: #0B1956; /* Azul marino */
          }

          .react-datepicker__input-container input {
            width: 100%;
            padding: 8px;
            border-radius: 8px;
            border: 1px solid #ccc;
          }

          .react-datepicker {
            border-radius: 8px;
            padding: 10px;
            font-size: 1rem;
          }
        `}
      </style>
      <h1 className="text-3xl w-full p-3 text-center font-normal text-white bg-navy-blue rounded-2xl">
        Datos del titular
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 ">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={titular.nombre}
          onChange={handleChange}
          className="border-0 shadow-md rounded-lg py-2 px-3"
        />
        <input
          type="text"
          name="apellidoPaterno"
          placeholder="Apellido Paterno"
          value={titular.apellidoPaterno}
          onChange={handleChange}
          className="border-0 shadow-md rounded-lg py-2 px-3"
        />
        <input
          type="text"
          name="apellidoMaterno"
          placeholder="Apellido Materno"
          value={titular.apellidoMaterno}
          onChange={handleChange}
          className="border-0 shadow-md rounded-lg py-2 px-3"
        />
        <div className="relative">
          <DatePicker
            selected={titular.fechaNacimiento}
            onChange={handleFechaNacimientoChange}
            placeholderText="Fecha de Nacimiento"
            className="border-0 shadow-md rounded-lg py-2 px-3 w-full"
            dateFormat="yyyy-MM-dd"
            locale="es"
            showYearDropdown
            scrollableYearDropdown
            yearDropdownItemNumber={125}
            minDate={new Date(1900, 0, 1)}
            maxDate={new Date(currentYear, 11, 31)}
          />
        </div>
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono"
          value={titular.telefono}
          onChange={handleChange}
          className="border-0 shadow-md rounded-lg py-2 px-3"
        />
        <input
          type="email"
          name="correo"
          placeholder="Correo Electrónico"
          value={titular.correo}
          onChange={handleChange}
          className="border-0 shadow-md rounded-lg py-2 px-3"
        />
        <input
          type="text"
          name="rfc"
          placeholder="RFC"
          value={titular.rfc}
          onChange={handleChange}
          className="border-0 shadow-md rounded-lg py-2 px-3"
        />
      </div>

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
          <h2 className="text-xl font-bold">Datos del asegurado</h2>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={asegurado.nombre}
            onChange={handleAseguradoChange}
            className="border-0 shadow-md rounded-lg py-2 px-3"
          />
          <input
            type="text"
            name="apellidoPaterno"
            placeholder="Apellido Paterno"
            value={asegurado.apellidoPaterno}
            onChange={handleAseguradoChange}
            className="border-0 shadow-md rounded-lg py-2 px-3"
          />
          <input
            type="text"
            name="apellidoMaterno"
            placeholder="Apellido Materno"
            value={asegurado.apellidoMaterno}
            onChange={handleAseguradoChange}
            className="border-0 shadow-md rounded-lg py-2 px-3"
          />
          <div className="relative">
            <DatePicker
              selected={asegurado.fechaNacimiento}
              onChange={handleFechaNacimientoAseguradoChange}
              placeholderText="Fecha de Nacimiento"
              className="border-0 shadow-md rounded-lg py-2 px-3 w-full"
              dateFormat="yyyy-MM-dd"
              locale="es"
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={125}
              minDate={new Date(1900, 0, 1)}
              maxDate={new Date(currentYear, 11, 31)}
            />
          </div>
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono"
            value={asegurado.telefono}
            onChange={handleAseguradoChange}
            className="border-0 shadow-md rounded-lg py-2 px-3"
          />
          <input
            type="email"
            name="correo"
            placeholder="Correo Electrónico"
            value={asegurado.correo}
            onChange={handleAseguradoChange}
            className="border-0 shadow-md rounded-lg py-2 px-3"
          />
          <input
            type="text"
            name="rfc"
            placeholder="RFC"
            value={asegurado.rfc}
            onChange={handleAseguradoChange}
            className="border-0 shadow-md rounded-lg py-2 px-3"
          />
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
