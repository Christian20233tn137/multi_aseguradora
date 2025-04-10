import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
  const API_URL = "https://lz2k718xka.execute-api.us-east-1.amazonaws.com/nar/usuarios/cotizacionesYEmisiones";
  const location = useLocation();
  const id = location.state?.id;

  const [cuotas, setCuotas] = useState(10);
  const [tittle, setTittle] = useState("Cuotas a cumplir: ");

  const [dataCotizaciones, setDataCotizaciones] = useState([
    { name: "Ene", cotizaciones: 12 },
    { name: "Feb", cotizaciones: 8 },
    { name: "Mar", cotizaciones: 22 },
    { name: "Abr", cotizaciones: 0 },
  ]);

  const [dataVentas, setDataVentas] = useState([
    { name: "Ene", ventas: 12 },
    { name: "Feb", ventas: 9 },
    { name: "Mar", ventas: 11 },
    { name: "Abr", ventas: 0 },
  ]);

  useEffect(() => {
    const fetchEmisionesActuales = async () => {
      try {
        const response = await axios.get("http://localhost:3001/nar/cuotas/");
        const data = response.data;

        if (data.length > 0) {
          setCuotas(data[0].cuotaMensual);
          setTittle("Cuotas a cumplir: ");
          console.log("Cuotas a cumplir: ", data[0].cuotaMensual);
        } else {
          console.log("No se encontraron cuotas.");
        }

      } catch (error) {
        console.error("Error al obtener las emisiones:", error);
        swalWithTailwindButtons.fire({
          icon: "error",
          title: "Error",
          text: "No se pudieron cargar las emisiones actuales",
        });
      }
    };

    fetchEmisionesActuales();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        const { emisiones, cotizaciones } = response.data;

        // Obtener el mes actual (0-11)
        const currentMonth = new Date().getMonth();

        // Actualizar los datos del mes actual
        if (currentMonth < 4) { // Solo actualizar si el mes es entre enero y abril
          setDataCotizaciones((prevData) =>
            prevData.map((data, index) =>
              index === currentMonth ? { ...data, cotizaciones } : data
            )
          );

          setDataVentas((prevData) =>
            prevData.map((data, index) =>
              index === currentMonth ? { ...data, ventas: emisiones } : data
            )
          );
        }
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    // Reiniciar los datos al inicio de cada mes
    const currentDate = new Date();
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );

    const timer = setTimeout(() => {
      setDataCotizaciones((prevData) =>
        prevData.map((data) => ({ ...data, cotizaciones: 0 }))
      );
      setDataVentas((prevData) =>
        prevData.map((data) => ({ ...data, ventas: 0 }))
      );
    }, nextMonth.getTime() - currentDate.getTime());

    return () => clearTimeout(timer);
  }, []);

  const currentMonth = new Date().getMonth();
  const currentCotizaciones = dataCotizaciones[currentMonth]?.cotizaciones || 0;
  const currentEmisiones = dataVentas[currentMonth]?.ventas || 0;

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
          <h2 className="text-xl font-bold mb-4">Emisiones por Mes</h2>
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

      {currentEmisiones >= cuotas ? (
        <p className="text-green-600 text-center mt-4">Meta mensual completada</p>
      ) : (
        <p className="text-red-600 text-center mt-4">¡Sigue realizando emisiones!</p>
      )}
    </div>
  );
};

export default Estadisticas;
