import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const Seguros = () => {
  const API_URL = "http://localhost:3000/nar/cotizaciones/id";

  const [emision, setEmisiones] = useState(null);
  const location = useLocation();
  const id = location.state?.id;
  const idCotizacion = location.state?.idCotizacion;

  useEffect(() => {
    const fetchCotizaciones = async () => {
      try {
        const response = await axios.get(`${API_URL}/${idCotizacion}`);
        if (response.data.success) {
          setEmisiones(response.data.data);
        } else {
          console.error("La respuesta de la API no contiene datos válidos:", response.data);
        }
      } catch (error) {
        console.error("Error al obtener las cotizaciones", error);
      }
    };

    if (idCotizacion) {
      fetchCotizaciones();
    }
  }, [idCotizacion]);

  const handleEmitir = () => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
        cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2",
      },
      buttonsStyling: false,
    });

    swalWithTailwindButtons
      .fire({
        title: "¿Estás seguro de emitir la acción?",
        text: "Una vez emitido, no podrás revertir esta acción.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, emitir",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            // Comenta esta parte para probar los botones sin necesidad de un backend activo
            /*
            const response = await axios.post("/api/emitir-poliza", {
              // Aquí irían los datos necesarios para emitir la póliza
            });

            if (response.status === 200) {
              swalWithTailwindButtons.fire('¡Emitido!', 'La póliza ha sido emitida al correo del cliente.', 'success');
            } else {
              swalWithTailwindButtons.fire('Error', 'Hubo un problema al emitir la póliza.', 'error');
            }
            */

            // Para probar sin backend, descomenta la siguiente línea:
            swalWithTailwindButtons.fire(
              "¡Emitido!",
              "La póliza ha sido emitida al correo del cliente.",
              "success"
            );
          } catch (error) {
            console.error("Error al emitir la póliza:", error);
            swalWithTailwindButtons.fire("Error", "Ocurrió un error inesperado.", "error");
          }
        }
      });
  };

  if (!emision) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="max-h-screen flex flex-col items-center justify-center p-4 overflow-hidden">
      <h1 className="text-2xl font-bold text-center bg-blue-200 w-full py-4 rounded-lg">
        Información sobre el seguro
      </h1>

      {/* Contenedor principal de la tarjeta */}
      <div className="bg-white p-6 rounded-lg max-w-3xl w-full mt-6 overflow-hidden">
        {/* Imagen y título alineados */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-24 h-24 bg-gray-400 rounded-full flex items-center justify-center">
            <span className="text-white">Foto</span>
          </div>
          <h2 className="text-2xl font-semibold">{emision.nombreSeguro}</h2>
        </div>

        {/* Datos del asegurado */}
        <div className="border border-gray-300 rounded-lg p-4 mb-4">
          <p>
            <strong>Nombre:</strong> {emision.nombreAsegurado}
          </p>
          <p>
            <strong>Teléfono:</strong> {emision.telefonoAsegurado}
          </p>
          <p>
            <strong>Edad:</strong> {emision.edadAsegurado} años
          </p>
          <p>
            <strong>Correo:</strong> {emision.correoAsegurado}
          </p>
        </div>

        {/* Coberturas */}
        <div className="border border-gray-300 rounded-lg p-4">
          <p className="font-semibold">Coberturas:</p>
          <ul className="list-disc pl-6">
            <li>{emision.cobertura}</li>
          </ul>
        </div>

        {/* Precio Final */}
        <div className="border border-gray-300 rounded-lg p-4 mt-4">
          <p>
            <strong>Precio Final:</strong> ${emision.precioFinal}
          </p>
        </div>

        {/* Botones */}
        <div className="flex justify-between mt-6">
          <button
            className="botones text-white px-4 py-2 rounded-lg"
            onClick={() => navigate("/seguros")}
          >
            Regresar
          </button>
          <button
            className="botones text-white px-4 py-2 rounded-lg"
            onClick={handleEmitir}
          >
            Emitir
          </button>
        </div>
      </div>
    </div>
  );
};

export default Seguros;
