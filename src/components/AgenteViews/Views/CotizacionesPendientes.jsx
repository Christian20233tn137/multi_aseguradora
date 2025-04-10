import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CotizacionesPendientes = () => {
  const API_URL = "https://lz2k718xka.execute-api.us-east-1.amazonaws.com/nar/cotizaciones/pendientesByAgente";

  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;

  const handleEmision = (idCotizacion) => {
    navigate("/inicioAgentes/emisiones", {
      state: { id: id, idCotizacion: idCotizacion },
    });
  };

  const [cotizaciones, setCotizaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCotizaciones, setFilteredCotizaciones] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const cotizacionesPerPage = 3;

  useEffect(() => {
    const fetchCotizaciones = async () => {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        if (response.data.success && Array.isArray(response.data.data)) {
          setCotizaciones(response.data.data);
        } else {
          console.error(
            "La respuesta de la API no contiene datos válidos:",
            response.data
          );
        }
      } catch (error) {
        console.error("Error al obtener las cotizaciones", error);
      }
    };

    if (id) {
      fetchCotizaciones();
    }
  }, [id]);

  useEffect(() => {
    const results = cotizaciones.filter((cotizacion) =>
      cotizacion.nombreCliente.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCotizaciones(results);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchTerm, cotizaciones]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Calculate pagination
  const indexOfLastCotizacion = currentPage * cotizacionesPerPage;
  const indexOfFirstCotizacion = indexOfLastCotizacion - cotizacionesPerPage;
  const currentCotizaciones = filteredCotizaciones.slice(
    indexOfFirstCotizacion,
    indexOfLastCotizacion
  );
  const totalPages = Math.ceil(
    filteredCotizaciones.length / cotizacionesPerPage
  );

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row mb-4 sm:mb-6">
        <input
          type="text"
          placeholder="Buscar cotización"
          className="border-gray-300 p-3 w-full sm:w-72 rounded-lg shadow-sm focus:outline-none sm:ml-auto"
          aria-label="Buscar cotización"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="rounded-lg space-y-6">
        {filteredCotizaciones.length === 0 ? (
          <div className="bg-white p-6 border-0 shadow-md rounded-lg text-center">
            <p className="text-lg text-gray-700">
              No hay cotizaciones actuales
            </p>
          </div>
        ) : (
          <>
            {currentCotizaciones.map((cotizacion) => (
              <div
                key={cotizacion.idCotizacion}
                className="bg-white p-6 border-0 shadow-md rounded-lg flex flex-col sm:flex-row items-center"
              >
                <div className="flex flex-col space-y-2 flex-grow">
                  <p className="text-lg font-semibold text-gray-900">
                    {cotizacion.nombreCliente}
                  </p>
                  <p className="text-base text-gray-700">
                    <span className="font-medium">Asegurado:</span>{" "}
                    {cotizacion.nombreAsegurado}
                  </p>
                  <p className="text-base text-gray-700">
                    <span className="font-medium">Tipo de seguro:</span>{" "}
                    {cotizacion.tipoSeguro}
                  </p>
                </div>

                <button
                  className="px-6 py-2 botones rounded-lg font-medium mt-4 sm:mt-0 sm:ml-auto w-full sm:w-auto"
                  onClick={() => handleEmision(cotizacion.idCotizacion)}
                >
                  Información
                </button>
              </div>
            ))}

            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 space-y-2 sm:space-y-0 sm:space-x-2">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg font-medium w-full sm:w-auto ${currentPage === 1
                      ? "bg-gray-300 cursor-not-allowed"
                      : "botones"
                    }`}
                >
                  Anterior
                </button>
                <span className="text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-lg font-medium w-full sm:w-auto ${currentPage === totalPages
                      ? "bg-gray-300 cursor-not-allowed"
                      : "botones"
                    }`}
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

};

export default CotizacionesPendientes;
