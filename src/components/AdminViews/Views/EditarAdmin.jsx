import React, { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const API_URL = "http://localhost:3000/nar/usuarios/id";
const API_URL_EDIT = "http://localhost:3000/nar/usuarios";

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
        } else if (idAdmin) {
          const response = await axios.get(`${API_URL}/${idAdmin}`);
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
  }, [idAdmin, location.state]);

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

  const handleEditSubmit = async () => {
    if (validarCampos()) {
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
        swalWithTailwindButtons.fire({
          title: "Error",
          text: error.response?.data?.message || "Ocurrió un error inesperado.",
          icon: "error",
        });
      }
    }
  };

  const showEditAlert = () => {
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
              className="border-0 shadow-md rounded-lg py-2 px-3 w-full"
            />

            <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
                Apellido paterno*</label>
              <input
                type="text"
                name="apellidoPaterno"
                value={admin.apellidoPaterno}
                onChange={handleChange}
                className="border-0 shadow-md rounded-lg py-2 px-3 w-full"
              />
            </div>

            <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
                Correo electrónico*</label>
              <input
                type="email"
                name="correo"
                value={admin.correo}
                onChange={handleChange}
                className="border-0 shadow-md rounded-lg py-2 px-3 w-full"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
                Apellido Materno*</label>
              <input
                type="text"
                name="apellidoMaterno"
                value={admin.apellidoMaterno}
                onChange={handleChange}
                className="border-0 shadow-md rounded-lg py-2 px-3 w-full"
              />
            </div>

            <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
                Teléfono*</label>
              <input
                type="tel"
                name="telefono"
                value={admin.telefono}
                onChange={handleChange}
                className="border-0 shadow-md rounded-lg py-2 px-3 w-full"
              />
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
