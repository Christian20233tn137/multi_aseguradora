import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Swal from "sweetalert2";

const AgentesInfo = () => {
  const location = useLocation();
  const id = location.state?.id;
  const idAgente = location.state?.idAgente;

  const API_URL = "http://localhost:3000/nar/usuarios/cotizacionesYEmisiones";
  const API_URL_DATOS = "http://localhost:3000/nar/usuarios";

  const [nombrePostulante, setNombrePostulante] = useState("");
  const [agente, setAgente] = useState({
    correo: "",
    telefono: "",
    domicilio: "",
    curp: "",
  });
  const [loading, setLoading] = useState(true);

  const [dataCotizaciones, setDataCotizaciones] = useState([
    { name: "Ene", cotizaciones: 0 },
    { name: "Feb", cotizaciones: 0 },
    { name: "Mar", cotizaciones: 0 },
    { name: "Abr", cotizaciones: 0 },
    { name: "May", cotizaciones: 0 },
    { name: "Jun", cotizaciones: 0 },
    { name: "Jul", cotizaciones: 0 },
    { name: "Ago", cotizaciones: 0 },
    { name: "Sep", cotizaciones: 0 },
    { name: "Oct", cotizaciones: 0 },
    { name: "Nov", cotizaciones: 0 },
    { name: "Dic", cotizaciones: 0 },
  ]);

  const [dataVentas, setDataVentas] = useState([
    { name: "Ene", ventas: 0 },
    { name: "Feb", ventas: 0 },
    { name: "Mar", ventas: 0 },
    { name: "Abr", ventas: 0 },
    { name: "May", ventas: 0 },
    { name: "Jun", ventas: 0 },
    { name: "Jul", ventas: 0 },
    { name: "Ago", ventas: 0 },
    { name: "Sep", ventas: 0 },
    { name: "Oct", ventas: 0 },
    { name: "Nov", ventas: 0 },
    { name: "Dic", ventas: 0 },
  ]);

  useEffect(() => {
    const obtenerAgente = async () => {
      try {
        if (location.state && location.state.agente) {
          setAgente(location.state.agente);
          setNombrePostulante(location.state.agente.nombre);
        } else if (idAgente) {
          const response = await axios.get(`${API_URL_DATOS}/id/${idAgente}`);
          setAgente(response.data);
          setNombrePostulante(response.data.nombre); // Asumiendo que el nombre está en response.data.nombre
        } else {
          throw new Error("ID del agente no definido");
        }
      } catch (error) {
        console.error("Error al obtener detalles del agente:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron obtener los detalles del agente.",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    obtenerAgente();
  }, [idAgente, location.state]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/${idAgente}`);
        const { emisiones, cotizaciones } = response.data;

        // Obtener el mes actual (0-11)
        const currentMonth = new Date().getMonth();

        // Actualizar los datos del mes actual
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
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, [idAgente]);

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

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="p-6 w-full h-auto overflow-hidden">
      <h1 className="text-3xl w-full p-3 text-center font-normal text-black miColor rounded-2xl">
        {nombrePostulante}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-2">
            Correo electrónico:
          </label>
          <input
            className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={agente.correo}
            readOnly
          />
        </div>
        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-2">
            Teléfono:
          </label>
          <input
            className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={agente.telefono}
            readOnly
          />
        </div>
        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-16">
            Curp:
          </label>
          <input
            className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={agente.curp}
            readOnly
          />
        </div>
        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-10">RFC:</label>
          <input
            className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            value={agente.curp}
            readOnly
          />
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
