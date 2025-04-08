import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CotizacionesPendientes = () => {
  const API_URL = "http://localhost:3001/nar/cotizaciones/pendientesByAgente";

  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;

  const handleEmision = (idCotizacion) => {
    navigate("/inicioAgentes/emisiones", { state: { id: id, idCotizacion: idCotizacion } });
  };

  const [cotizaciones, setCotizaciones] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCotizaciones, setFilteredCotizaciones] = useState([]);

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
  }, [searchTerm, cotizaciones]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row items-center mb-6">
        <input
          type="text"
          placeholder="Buscar cotización"
          className="border-gray-300 p-3 w-72 rounded-lg shadow-sm focus:outline-none"
          aria-label="Buscar cotización"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="border-0 shadow-md rounded-lg space-y-6">
        {filteredCotizaciones.map((cotizacion) => (
          <div
            key={cotizacion.idCotizacion}
            className="bg-white p-6 border-0 shadow-md rounded-lg flex items-center"
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
              className="px-6 py-2 botones rounded-lg font-medium ml-auto"
              onClick={() => handleEmision(cotizacion.idCotizacion)}
            >
              Información
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CotizacionesPendientes;
