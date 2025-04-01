import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const EditarAgente = () => {
  const { id } = useParams();
  const [agente, setAgente] = useState({
    id: '',
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    correo: '',
    telefono: '',
    rfc: '',
  });

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
        const response = await axios.get(`http://localhost:3000/nar/usuarios/agentesActivos/${id}`);
        if (response.data) {
          setAgente(response.data);
        } else {
          console.error('No se encontró el agente.');
        }
      } catch (error) {
        console.error('Error al obtener el agente:', error);
      }
    };

    obtenerAgente();
  }, [id]);

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
    }).then((result) => {
      if (result.isConfirmed) {
        const nuevaContrasena = agente.correo;
        console.log(`La nueva contraseña es: ${nuevaContrasena}`);

        swalWithTailwindButtons.fire({
          icon: 'success',
          title: 'Contraseña restablecida',
          text: 'La contraseña ha sido restablecida al correo electrónico del usuario.',
        });
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

  const guardarDatos = () => {
    if (validarCampos()) {
      swalWithTailwindButtons.fire({
        title: "¿Estás seguro?",
        text: "¿Quieres editar este agente?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, guardar",
        cancelButtonText: "Cancelar",
        reverseButtons: true
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const { rfc, ...formData } = agente; // Excluir el campo 'rfc'

            const response = await axios.put(`http://localhost:3000/nar/usuarios/byAdmin/${id}`, formData);

            if (response.status === 200) {
              swalWithTailwindButtons.fire({
                title: "Éxito",
                text: "Datos guardados correctamente.",
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
            console.error("Error al guardar el agente:", error);
            swalWithTailwindButtons.fire({
              title: "Error",
              text: "Ocurrió un error inesperado.",
              icon: "error",
            });
          }
        }
      });
    }
  };

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
          onClick={guardarDatos}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};

export default EditarAgente;
