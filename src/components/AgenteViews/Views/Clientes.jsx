import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Clientes = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const initialRows = [
    {
      id: 1,
      nombre: "Juan",
      apellidos: "Pérez",
      rfc: "JUAP123456",
      curp: "JUAP890123HDFRRL01",
      edad: 30,
    },
    {
      id: 2,
      nombre: "María",
      apellidos: "García",
      rfc: "MARG123456",
      curp: "MARG890123MDFRRL01",
      edad: 25,
    },
    {
      id: 3,
      nombre: "Pedro",
      apellidos: "Ramírez",
      rfc: "PERA123456",
      curp: "PERA890123PDFRRL01",
      edad: 35,
    },
    {
      id: 4,
      nombre: "Ana",
      apellidos: "Martínez",
      rfc: "ANAM123456",
      curp: "ANAM890123ADFRRL01",
      edad: 40,
    },
    {
      id: 5,
      nombre: "Luis",
      apellidos: "Hernández",
      rfc: "LUHE123456",
      curp: "LUHE890123LDFRRL01",
      edad: 45,
    },
  ];

  const filteredRows = search.trim()
    ? initialRows.filter(
        (row) =>
          row.nombre.toLowerCase().includes(search.toLowerCase()) ||
          row.apellidos.toLowerCase().includes(search.toLowerCase()) ||
          row.rfc.toLowerCase().includes(search.toLowerCase()) ||
          row.curp.toLowerCase().includes(search.toLowerCase())
      )
    : initialRows;

  return (
    <div className="relative p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold"></h1>
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
              <th className="py-2 px-4 border-b border-gray-200 text-center">Nombre</th>
              <th className="py-2 px-4 border-b border-gray-200 text-center">Apellidos</th>
              <th className="py-2 px-4 border-b border-gray-200 text-center">RFC</th>
              <th className="py-2 px-4 border-b border-gray-200 text-center">CURP</th>
              <th className="py-2 px-4 border-b border-gray-200 text-center">Edad</th>
              <th className="py-2 px-4 border-b border-gray-200 text-center">Póliza</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id}>
                <td className="py-2 px-4 border-b border-gray-200 text-center">{row.nombre}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center">{row.apellidos}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center">{row.rfc}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center">{row.curp}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center">{row.edad}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center">
                  <button
                    className="botones text-white py-1 px-3 rounded"
                    onClick={() => navigate(`/clientes/polizas`)}  //${row.id}
                  >
                    Ver Pólizas
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Clientes;
