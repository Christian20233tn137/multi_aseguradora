import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const Seguros = () => {
  const API_URL = "http://localhost:3001/nar/cotizaciones/id";
  const navigate = useNavigate();

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
          swalWithTailwindButtons.fire({
            title: "Enviando...",
            text: "Estamos emitiendo la póliza.",
            icon: "info",
            showConfirmButton: false,
            allowOutsideClick: false,
          });

          try {
            const response = await axios.put(
              `http://localhost:3001/nar/cotizaciones/emitida/${idCotizacion}`
            );

            if (response.status === 200) {
              swalWithTailwindButtons.close();
              swalWithTailwindButtons.fire(
                "¡Emitido!",
                "La póliza ha sido emitida al correo del cliente.",
                "success"
              );
              navigate("/inicioAgentes", { state: { id: id } });
            } else {
              swalWithTailwindButtons.fire(
                "Error",
                "Hubo un problema al emitir la póliza.",
                "error"
              );
            }
          } catch (error) {
            console.error("Error al emitir la póliza:", error);
            swalWithTailwindButtons.fire(
              "Error",
              "Ocurrió un error inesperado.",
              "error"
            );
          }
        }
      });
  };

  if (!emision) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="max-h-screen flex flex-col items-center justify-center p-4 overflow-auto">
      <h1 className="text-2xl font-bold text-center bg-blue-200 w-full py-4 rounded-lg">
        Información sobre el seguro
      </h1>

      <div className="bg-white p-6 rounded-lg max-w-3xl w-full mt-6 overflow-auto max-h-[80vh]">
        <div className="flex items-center space-x-6 mb-6">
          <h2 className="text-2xl font-semibold">{emision.nombreSeguro}</h2>
        </div>

        <div className="border border-gray-300 rounded-lg p-4 mb-4">
          <h3 className="font-semibold">Datos del Asegurado</h3>
          <p><strong>Nombre:</strong> {emision.nombreAsegurado}</p>
          <p><strong>Teléfono:</strong> {emision.telefonoAsegurado}</p>
          <p><strong>Edad:</strong> {emision.edadAsegurado} años</p>
          <p><strong>Correo:</strong> {emision.correoAsegurado}</p>
        </div>

        <div className="border border-gray-300 rounded-lg p-4">
          <h3 className="font-semibold">Coberturas</h3>
          <div className="pl-4 mt-2" dangerouslySetInnerHTML={{ __html: emision.cobertura }} />
        </div>

        <div className="border border-gray-300 rounded-lg p-4 mt-4">
          <p><strong>Precio Final:</strong> $
            {typeof emision.montoPrima === "number"
              ? emision.montoPrima.toFixed(2)
              : emision.precioFinal || "No disponible"}
          </p>
        </div>

        <div className="flex justify-between mt-6">
          <button
            className="botones text-white px-4 py-2 rounded-lg"
            onClick={() => navigate("/inicioAgentes", { state: { id: id } })}
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
