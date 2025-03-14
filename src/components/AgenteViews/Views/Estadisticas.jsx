import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const Estadisticas = () => {

  const cuotas = 10;
  let tittle = "Cuotas a cumplir: ";

  const dataCotizaciones = [
    { name: "Ene", cotizaciones: 4 },
    { name: "Feb", cotizaciones: 3 },
    { name: "Mar", cotizaciones: 5 },
    { name: "Abr", cotizaciones: 2 },
  ];

  const dataVentas = [
    { name: "Ene", ventas: 3 },
    { name: "Feb", ventas: 4 },
    { name: "Mar", ventas: 2 },
    { name: "Abr", ventas: 5 },
  ];

  return (
    <div className="p-6 w-auto h-auto overflow-hidden">
      <h1 className="text-3xl max-w-screen p-3 text-center font-normal text-black miColor rounded-2xl">
        {tittle} {cuotas}
      </h1>
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

export default Estadisticas;
