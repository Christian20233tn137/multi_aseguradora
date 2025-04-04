import React from "react";
import { useLocation } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const AgentesInfo = () => {
  const location = useLocation();
  const id = location.state?.id;
  console.log("Prueba", id);

  const nombrePostulante = "Juan Perez";
  const correoElectronico = "juan.perez@example.com";
  const telefono = "555-1234";
  const domicilio = "Calle Falsa 123";
  const rfc = "XAXX010101000";

  const dataCotizaciones = [
    { name: 'Ene', cotizaciones: 4 },
    { name: 'Feb', cotizaciones: 3 },
    { name: 'Mar', cotizaciones: 5 },
    { name: 'Abr', cotizaciones: 2 },
  ];

  const dataVentas = [
    { name: 'Ene', ventas: 3 },
    { name: 'Feb', ventas: 4 },
    { name: 'Mar', ventas: 2 },
    { name: 'Abr', ventas: 5 },
  ];

  return (
    <div className="p-6 w-full h-auto overflow-hidden">
      <h1 className="text-3xl w-full p-3 text-center font-normal text-black miColor rounded-2xl">
        {nombrePostulante}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-2">Correo electrónico:</label>
          <input className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={correoElectronico} readOnly />
        </div>
        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-2">Teléfono:</label>
          <input className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={telefono} readOnly />
        </div>
        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-16">Domicilio:</label>
          <input className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={domicilio} readOnly />
        </div>
        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-10">RFC:</label>
          <input className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={rfc} readOnly />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Cotizaciones por Mes</h2>
          <BarChart width={400} height={300} data={dataCotizaciones}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cotizaciones" fill="#8884d8" />
          </BarChart>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Ventas por Mes</h2>
          <BarChart width={400} height={300} data={dataVentas}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="ventas" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default AgentesInfo;
