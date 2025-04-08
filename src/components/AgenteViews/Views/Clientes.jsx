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
        const response = await axios.get("http://localhost:3001/nar/clientes");
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
    <div className="relative p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Clientes</h1>
        <input
          type="text"
          placeholder="Buscar cliente"
          className="border-0 shadow-md rounded-lg p-2 w-64"
          value={searchTerm}
          onChange={handleSearch}
          aria-label="Buscar cliente"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
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
                <tr key={cliente.id}>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">
                    {cliente.nombre}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">
                    {cliente.apellidoPaterno} {cliente.apellidoMaterno}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">
                    {cliente.rfc}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">
                    {cliente.edad}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200 text-center">
                    <button
                      className="botones text-white py-1 px-3 rounded"
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
                <td colSpan="5" className="text-center">
                  No se encontraron clientes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="botones text-white py-1 px-3 rounded"
        >
          Anterior
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={indexOfLastClient >= filteredClientes.length}
          className="botones text-white py-1 px-3 rounded"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Clientes;
