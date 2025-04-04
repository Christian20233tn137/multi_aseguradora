import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

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
  const [loading, setLoading] = useState(true);

  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
      cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
    },
    buttonsStyling: false
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

  const handleChange = (e) => {
    setAgente({
      ...agente,
      [e.target.name]: e.target.value,
    });
  };

  const restablecerContrasena = () => {
    swalWithTailwindButtons.fire({
      title: '¿Estás seguro?',
      text: 'La contraseña se restablecerá al correo electrónico del usuario. ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, restablecer',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const nuevaContrasena = agente.correo;
          await axios.put(`${API_URL}/resetearContra/${idAgente}`, { correo: nuevaContrasena });

          swalWithTailwindButtons.fire({
            icon: 'success',
            title: 'Contraseña restablecida',
            text: 'La contraseña ha sido restablecida al correo electrónico del usuario.',
          });
        } catch (error) {
          console.error("Error al restablecer la contraseña:", error);
          swalWithTailwindButtons.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al restablecer la contraseña.',
          });
        }
      }
    });
  };

  const validarCampos = () => {
    const { nombre, apellidoPaterno, apellidoMaterno, correo, telefono } = agente;

    if (!nombre || !apellidoPaterno || !apellidoMaterno || !correo || !telefono) {
      swalWithTailwindButtons.fire({
        icon: 'warning',
        title: 'Campos obligatorios',
        text: 'Por favor, llena todos los campos obligatorios.',
      });
      return false;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexCorreo.test(correo)) {
      swalWithTailwindButtons.fire({
        icon: 'error',
        title: 'Correo inválido',
        text: 'Por favor, ingresa un correo electrónico válido.',
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

        const response = await axios.put(`${API_URL}/byAdmin/${idAgente}`, formData);

        if (response.status === 200) {
          swalWithTailwindButtons.fire({
            title: "Éxito",
            text: "Datos guardados correctamente.",
            icon: "success",
          });
          navigate("/agentes", {state : {id:id}}); // Redirigir a la lista de agentes
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
    swalWithTailwindButtons.fire({
      title: '¿Deseas guardar los cambios?',
      text: 'Se actualizará la información del agente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar cambios',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        handleEditSubmit();
      }
    });
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <form className="grid grid-cols-3 gap-6">
        <div className="flex flex-col">
          <label>Nombre*</label>
          <input
            className="border border-gray-400 px-2 py-1"
            name="nombre"
            value={agente.nombre}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col">
          <label>Apellido paterno*</label>
          <input
            className="border border-gray-400 px-2 py-1"
            name="apellidoPaterno"
            value={agente.apellidoPaterno}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col">
          <label>Apellido materno*</label>
          <input
            className="border border-gray-400 px-2 py-1"
            name="apellidoMaterno"
            value={agente.apellidoMaterno}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label>Correo electrónico*</label>
          <input
            className="border border-gray-400 px-2 py-1"
            name="correo"
            value={agente.correo}
            onChange={handleChange}
          />
        </div>
        <div className="flex flex-col">
          <label>Teléfono*</label>
          <input
            className="border border-gray-400 px-2 py-1"
            name="telefono"
            value={agente.telefono}
            onChange={handleChange}
          />
        </div>

        <div className="flex flex-col">
          <label>RFC*</label>
          <input
            className="border border-gray-400 px-2 py-1"
            name="rfc"
            value={agente.rfc}
            onChange={handleChange}
            disabled // Deshabilitar el campo RFC
          />
        </div>
      </form>

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

      <div className="col-span-2 flex items-center justify-center mt-8">
        <button
          type="button"
          className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          style={{ backgroundColor: "#0B1956" }}
          onClick={showEditAlert}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default EditarAgente;
