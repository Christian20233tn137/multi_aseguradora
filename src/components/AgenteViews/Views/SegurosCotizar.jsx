import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SegurosCotizar = () => {
  const navigate = useNavigate();
  const API_URL = "http://localhost:3001/nar/seguros/tipo";
  const location = useLocation();
  const id = location.state?.id;
  const idCliente = location.state?.idCliente;
  const idAsegurado = location.state?.idAsegurado;
  const fechaNacimiento = location.state?.fechaNacimiento; // Recibe la fecha de nacimiento
  let seguro = location.state?.seguro;
  const [seguros, setSeguros] = useState([]);
  const idCotizacion = location.state?.idCotizacion;

  const [cotizacion, setCotizacion] = useState({
    idUsuario: id,
    idCliente: idCliente,
    idAsegurado: idAsegurado, // Asegúrate de que este valor esté presente
    idSeguro: "",
  });

  const handleChange = (e) => {
    setCotizacion({ ...cotizacion, [e.target.name]: e.target.value });
  };

  const calcularEdad = (fechaNacimiento) => {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const m = hoy.getMonth() - fechaNac.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    return edad;
  };

  const calcularMontoPrima = (montoPrima, edad) => {
    let incremento = 0;
    if (edad >= 18 && edad <= 25) {
      incremento = 0.2; // 20% más
    } else if (edad >= 26 && edad <= 40) {
      incremento = 0.1; // 10% más
    } else if (edad >= 41 && edad <= 60) {
      incremento = 0.15; // 15% más
    } else if (edad > 60) {
      incremento = 0.25; // 25% más
    }
    return montoPrima * (1 + incremento);
  };

  const agregarCotizacion = async (datosCotizacion) => {
    console.log("Datos de la cotización enviados:", datosCotizacion); // Verifica el contenido
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

      // Verifica que idSeguro no esté vacío
      if (!datosCotizacion.idSeguro) {
        throw new Error("Debes seleccionar un seguro.");
      }

      // Encontrar el seguro seleccionado para obtener el montoPrima
      const seguroSeleccionado = seguros.find(
        (s) => s.idSeguro === datosCotizacion.idSeguro
      );
      if (!seguroSeleccionado) {
        throw new Error("No se encontró el seguro seleccionado.");
      }

      // Incluir el montoPrima en los datos de la cotización
      const datosCotizacionCompletos = {
        ...datosCotizacion,
        montoPrima: seguroSeleccionado.montoPrima,
      };

      const responseCotizacion = await axios.post(
        "http://localhost:3001/nar/cotizaciones",
        datosCotizacionCompletos
      );

      swalWithTailwindButtons.fire(
        "Cotización Enviada",
        "La cotización se envió correctamente.",
        "success"
      );

      console.log("idCotizacion", responseCotizacion.data._id);
      navigate("/inicioAgentes/emisiones", {
        state: {
          idCotizacion: responseCotizacion.data._id,
          id: id,
        },
      });
    } catch (error) {
      console.error("Error al cotizar:", error);
      swalWithTailwindButtons.fire(
        "Error",
        error.message || "Ocurrió un error inesperado.",
        "error"
      );
    }
  };

  if (seguro === "Seguro de vida") {
    seguro = "vida";
  }
  if (seguro === "Seguro de gastos medicos") {
    seguro = "salud";
  }
  if (seguro === "Seguro de viajes") {
    seguro = "viajes";
  }

  useEffect(() => {
    const fetchSeguros = async () => {
      try {
        const response = await axios.get(`${API_URL}/${seguro}`);
        console.log("API Response:", response.data);

        if (response.data.success) {
          const edad = calcularEdad(fechaNacimiento);
          console.log("Edad calculada:", edad);

          const segurosConIncremento = response.data.data.map((seguro) => {
            const montoPrimaOriginal = seguro.montoPrima;
            const montoPrimaCalculado = calcularMontoPrima(
              seguro.montoPrima,
              edad
            );
            console.log(
              `Seguro: ${seguro.nombreSeguro}, Monto original: ${montoPrimaOriginal}, Monto con incremento: ${montoPrimaCalculado}`
            );

            return {
              ...seguro,
              montoPrima: montoPrimaCalculado,
            };
          });
          setSeguros(segurosConIncremento);
        } else {
          console.error("Error al obtener los seguros:", response.data.message);
        }
      } catch (error) {
        console.error("Error al obtener los seguros", error);
      }
    };
    fetchSeguros();
  }, [seguro, fechaNacimiento]);

  console.log("Seguros State:", seguros);

  return (
    <div className="p-6 w-full h-auto overflow-hidden">
      <h1 className="text-3xl w-full p-3 text-center font-normal text-black miColor rounded-2xl">
        Cotizacion del seguro de: {seguro}
      </h1>
      <div className="overflow-x-auto mt-10">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-center">
                Aseguradora
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-center">
                Seguro
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-center">
                Monto de la prima
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-center"></th>
            </tr>
          </thead>
          <tbody>
            {seguros.length > 0 ? (
              seguros.map((seguro) => (
                <tr key={seguro.idAseguradora}>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">
                    {seguro.nombreAseguradora}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">
                    {seguro.nombreSeguro}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">
                    {seguro.montoPrima}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">
                    <button
                      className="botones text-white py-1 px-3 rounded"
                      onClick={() => {
                        const datosCotizacion = {
                          ...cotizacion,
                          idSeguro: seguro.idSeguro,
                          idAsegurado: cotizacion.idAsegurado, // Asegúrate de incluir idAsegurado
                          montoPrima: seguro.montoPrima, // Añadir el montoPrima calculado
                        };
                        agregarCotizacion(datosCotizacion);
                      }}
                    >
                      Seleccionar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  No se encontraron Seguros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SegurosCotizar;
