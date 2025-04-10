import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClientes, setFilteredClientes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 9;
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get("https://lz2k718xka.execute-api.us-east-1.amazonaws.com/nar/clientes");
        setClientes(response.data);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  useEffect(() => {
    const results = clientes.filter(
      (cliente) =>
        (cliente.nombre &&
          cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cliente.apellidoPaterno &&
          cliente.apellidoMaterno &&
          (cliente.apellidoPaterno + " " + cliente.apellidoMaterno)
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (cliente.rfc &&
          cliente.rfc.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (cliente.curp &&
          cliente.curp.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredClientes(results);
  }, [searchTerm, clientes]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = filteredClientes.slice(
    indexOfFirstClient,
    indexOfLastClient
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-4 sm:p-6 w-full h-auto overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
          Clientes
        </h1>
        <input
          type="text"
          placeholder="Buscar cliente"
          className="border-0 shadow-md rounded-lg p-2 w-full sm:w-64 mt-2 sm:mt-0"
          value={searchTerm}
          onChange={handleSearch}
          aria-label="Buscar cliente"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full w-full">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-center">
                Nombre
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-center">
                Apellidos
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-center">
                RFC
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-center">
                Edad
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-center">
                Póliza
              </th>
            </tr>
          </thead>
          <tbody>
            {currentClients.length > 0 ? (
              currentClients.map((cliente) => (
                <tr key={cliente.id} className="text-center">
                  <td className="py-2 px-4 border-b border-gray-200">
                    {cliente.nombre}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {cliente.apellidoPaterno} {cliente.apellidoMaterno}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {cliente.rfc}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {cliente.edad}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    <button
                      className="botones text-white py-1 px-3 rounded w-full sm:w-auto"
                      onClick={() => {
                        navigate(`${location.pathname}/polizas`, {
                          state: { idPoliza: cliente._id, id: id },
                        });
                      }}
                    >
                      Ver Pólizas
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No se encontraron clientes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row justify-between mt-4 space-y-2 sm:space-y-0 sm:space-x-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="botones text-white py-2 px-4 rounded w-full sm:w-auto"
        >
          Anterior
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastClient >= filteredClientes.length}
          className="botones text-white py-2 px-4 rounded w-full sm:w-auto"
        >
          Siguiente
        </button>
      </div>
    </div>

  );

};

export default Clientes;
