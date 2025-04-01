import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const id  = location.state.id;
  
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get("http://localhost:3000/nar/clientes");
        setClientes(response.data);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  const filteredRows = search.trim()
    ? clientes.filter(
        (cliente) =>
          cliente.nombre.toLowerCase().includes(search.toLowerCase()) ||
          (cliente.apellidoPaterno + " " + cliente.apellidoMaterno)
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          cliente.rfc.toLowerCase().includes(search.toLowerCase()) ||
          cliente.curp.toLowerCase().includes(search.toLowerCase())
      )
    : clientes;

  return (
    <div className="relative p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Clientes</h1>
        <input
          type="text"
          placeholder="Buscar cliente"
          className="border p-2 w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
            {filteredRows.length > 0 ? (
              filteredRows.map((cliente) => (
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
                        navigate(`${location.pathname}/polizas`, {state : {idPoliza: cliente._id, id: id}});
                    //  
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
    </div>
  );
};

export default Clientes;
