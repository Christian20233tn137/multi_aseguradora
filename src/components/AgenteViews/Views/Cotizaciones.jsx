import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Cotizaciones = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const initialRows = [
    { id: 1, aseguradora: "Aseguradora 1", seguro: "Seguro de vida - Básico", monto: "$90,560" },
    { id: 2, aseguradora: "Aseguradora 1", seguro: "Seguro de vida - Medio", monto: "$95,600" },
    { id: 3, aseguradora: "Aseguradora 1", seguro: "Seguro de vida - Premium", monto: "$99,860" },
    { id: 4, aseguradora: "Aseguradora 2", seguro: "Seguro de vida", monto: "$90,560" },
    { id: 5, aseguradora: "Aseguradora 3", seguro: "Seguro de vida", monto: "$60,560" },
    { id: 6, aseguradora: "Aseguradora 4", seguro: "Seguro de vida - Básico", monto: "$40,560" },
    { id: 7, aseguradora: "Aseguradora 4", seguro: "Seguro de vida - Medio", monto: "$80,580" },
  ];

  const filteredRows = search.trim()
    ? initialRows.filter(row => row.aseguradora.toLowerCase().includes(search.toLowerCase()) || row.seguro.toLowerCase().includes(search.toLowerCase()))
    : initialRows;

  return (
    <div className="relative p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Selecciona tu Seguro</h1>
        <input
          type="text"
          placeholder="Buscar aseguradora"
          className="border p-2 w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Buscar aseguradora"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-200 text-center">Aseguradora</th>
              <th className="py-2 px-4 border-b border-gray-200 text-center">Seguro</th>
              <th className="py-2 px-4 border-b border-gray-200 text-center">Monto de la prima</th>
              <th className="py-2 px-4 border-b border-gray-200 text-center">Seleccionar</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row) => (
              <tr key={row.id}>
                <td className="py-2 px-4 border-b border-gray-200 text-center">{row.aseguradora}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center">{row.seguro}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center">{row.monto}</td>
                <td className="py-2 px-4 border-b border-gray-200 text-center">
                  <button
                    className="botones text-white py-1 px-3 rounded"
                    onClick={() => navigate(`/cotizar/informacion/cotizacion/seguros`)}//${row.id}
                  >
                    Seleccionar
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

export default Cotizaciones;
