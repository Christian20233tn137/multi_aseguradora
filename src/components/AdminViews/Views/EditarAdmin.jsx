import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const API_URL = "http://localhost:3000/nar/usuarios/byAdmin";

const EditarAdmin = () => {
  const location = useLocation();
  const { id } = useParams();
  const [admin, setAdmin] = useState({
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
    const obtenerAdmin = async () => {
      try {
        if (location.state && location.state.administrador) {
          setAdmin(location.state.administrador);
        } else if (id) {
          const response = await axios.get(`${API_URL}/${id}`);
          setAdmin(response.data);
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
  }, [id, location.state]);

  const handleChange = (e) => {
    setAdmin({
      ...admin,
      [e.target.name]: e.target.value,
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
      .then((result) => {
        if (result.isConfirmed) {
          const nuevaContrasena = admin.correo;
          console.log(`La nueva contraseña es: ${nuevaContrasena}`);

          swalWithTailwindButtons.fire({
            icon: "success",
            title: "Contraseña restablecida",
            text: "La contraseña ha sido restablecida al correo electrónico del administrador.",
          });
        }
      });
  };

  const validarCampos = () => {
    const { nombre, apellidoPaterno, apellidoMaterno, correo, telefono } =
      admin;

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

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
      swalWithTailwindButtons.fire({
        icon: "error",
        title: "Correo inválido",
        text: "Por favor, ingresa un correo electrónico válido.",
      });
      return false;
    }

    return true;
  };

  const confirmarEditar = () => {
    if (validarCampos()) {
      console.log("Datos a enviar:", admin); // Agrega este log

      swalWithTailwindButtons
        .fire({
          title: "¿Estás seguro?",
          text: "¿Quieres editar este administrador?",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Sí, guardar",
          cancelButtonText: "Cancelar",
          reverseButtons: true,
        })
        .then(async (result) => {
          if (result.isConfirmed) {
            try {
              const response = await axios.put(`${API_URL}/${id}`, admin);

              if (response.status === 200) {
                swalWithTailwindButtons.fire({
                  title: "Éxito",
                  text: "Datos del administrador guardados correctamente.",
                  icon: "success",
                });
              } else {
                swalWithTailwindButtons.fire({
                  title: "Error",
                  text: "Hubo un problema al guardar los datos.",
                  icon: "error",
                });
              }
            } catch (error) {
              console.error("Error al guardar el administrador:", error);
              swalWithTailwindButtons.fire({
                title: "Error",
                text:
                  error.response?.data?.message ||
                  "Ocurrió un error inesperado.",
                icon: "error",
                confirmButtonColor: "#0B1956",
              });
            }
          }
        });
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Editar Administrador
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Columna Izquierda */}
        <div className="space-y-4">
          {/* Campo del Nombre */}
          <div>
            <label className="block font-semibold">Nombre*</label>
            <input
              type="text"
              name="nombre"
              value={admin.nombre}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
            />
          </div>

          {/* Campo de Apellido Paterno */}
          <div>
            <label className="block font-semibold">Apellido paterno*</label>
            <input
              type="text"
              name="apellidoPaterno"
              value={admin.apellidoPaterno}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
            />
          </div>

          {/* Campo de Correo */}
          <div>
            <label className="block font-semibold">Correo electrónico*</label>
            <input
              type="email"
              name="correo"
              value={admin.correo}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
            />
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="space-y-4">
          {/* Campo de Apellido Materno */}
          <div>
            <label className="block font-semibold">Apellido Materno*</label>
            <input
              type="text"
              name="apellidoMaterno"
              value={admin.apellidoMaterno}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
            />
          </div>

          {/* Campo de Teléfono */}
          <div>
            <label className="block font-semibold">Teléfono*</label>
            <input
              type="tel"
              name="telefono"
              value={admin.telefono}
              onChange={handleChange}
              className="w-full border rounded p-2 mt-1"
            />
          </div>
        </div>
      </div>

      {/* Botón Restablecer contraseña */}
      <div className="col-span-2 flex items-center justify-start mt-8">
        <button
          type="button"
          className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          style={{ backgroundColor: "#0B1956" }}
          onClick={restablecerContrasena}
        >
          Restablecer contraseña
        </button>
      </div>

      {/* Botón Editar */}
      <div className="flex items-center justify-center mt-6">
        <button
          type="button"
          className="text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          style={{ backgroundColor: "#0B1956" }}
          onClick={confirmarEditar}
        >
          Editar
        </button>
      </div>
    </div>
  );
};

export default EditarAdmin;
