import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:3000/nar/emisiones/cliente";

const Polizas = () => {
  const location = useLocation();
  const { id } = useParams();
  const [polizas, setPolizas] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInformacionPolizas = async () => {
      try {
        if (!id) {
          setError("ID del cliente no definido");
          return;
        }

        console.log("Intentando obtener pólizas para el cliente:", id);
        const response = await axios.get(`${API_URL}/${id}`);

        if (response.data.success) {
          setPolizas(response.data.data);
          setError(null);
        } else {
          setError(response.data.message || "Error al obtener las pólizas");
        }
      } catch (error) {
        console.error("Error al obtener la información de las pólizas:", error);
        setError("Error al conectar con el servidor");
      }
    };

    fetchInformacionPolizas();
  }, [id]);

  // Muestra mensaje de error si existe
  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  const handleInfo = (idPoliza) => {
    console.log("Id de la poliza", idPoliza);
    navigate(`informacion/${idPoliza}`);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPolizas = polizas.filter((poliza) =>
    poliza.nombreSeguro.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 w-auto h-auto overflow-hidden">
      <h1 className="text-3xl max-w-screen p-3 text-center font-normal text-black bg-blue-100 rounded-2xl">
        Pólizas
      </h1>

      <div className="flex justify-end p-4">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="border border-gray-400 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {filteredPolizas.map((poliza) => (
          <div
            key={poliza.numeroPoliza}
            className="border rounded-lg p-4 shadow-lg"
          >
            <h2 className="font-bold">PÓLIZA N. {poliza.numeroPoliza}</h2>
            <p>{poliza.nombreSeguro}</p>
            <p>Vigencia: {poliza.vigencia}</p>
            <p>Costo total: ${poliza.montoTotal}</p>
            <button
              className="mt-4 botones text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={() => handleInfo(poliza.idPoliza)}
            >
              Ver más
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Polizas;
