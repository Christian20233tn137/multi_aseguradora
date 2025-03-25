import React, { useState } from 'react';

const nombre = "Chris el macho";

const polizas = [
  { id: 1, tipo: "Seguro de viaje", vigencia: "10/10/2025", costo: "$500" },
  { id: 2, tipo: "Seguro de vida", vigencia: "10/10/2025", costo: "$500" },
  { id: 3, tipo: "Seguro de gastos médicos", vigencia: "10/10/2025", costo: "$500" },
  { id: 4, tipo: "Seguro de viaje", vigencia: "10/10/2025", costo: "$500" },
  { id: 5, tipo: "Seguro de viaje", vigencia: "10/10/2025", costo: "$500" }
];

const Polizas = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredPolizas = polizas.filter((poliza) =>
    poliza.tipo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='p-6 w-auto h-auto overflow-hidden'>
      <h1 className="text-3xl max-w-screen p-3 text-center font-normal text-black bg-blue-100 rounded-2xl">
        {nombre}
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
          <div key={poliza.id} className="border rounded-lg p-4 shadow-lg">
            <h2 className="font-bold">PÓLIZA N. {poliza.id}</h2>
            <p>{poliza.tipo}</p>
            <p>Vigencia: {poliza.vigencia}</p>
            <p>Costo mensual: {poliza.costo}</p>
            <button className="mt-4 botones text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
              Ver más
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Polizas;
