import React, { useEffect, useState } from "react";
import axios from "axios";
import emitter from "../../../utils/eventEmitter";

const ProfileSection = () => {
  const [month, setMonth] = useState("");
  const [data, setData] = useState({
    agentesActivos: 0,
    cotizaciones: 0,
    emisiones: 0,
  });

  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  useEffect(() => {
    const mesActual = new Date().getMonth(); // 0-11
    setMonth(meses[mesActual]);
  }, []);

  useEffect(() => {
    if (month) fetchAllStats(month);
  }, [month]);

  useEffect(() => {
    const refresh = () => fetchAllStats(month);
    emitter.on("cotizacionRealizada", refresh);
    emitter.on("emisionRealizada", refresh);
    emitter.on("nuevoAgente", refresh);

    return () => {
      emitter.off("cotizacionRealizada", refresh);
      emitter.off("emisionRealizada", refresh);
      emitter.off("nuevoAgente", refresh);
    };
  }, [month]);

  const fetchAllStats = async (mesSeleccionado) => {
    const monthIndex = meses.indexOf(mesSeleccionado); // 0-11

    try {
      const [agentesRes, cotizacionesRes, emisionesRes] = await Promise.all([
        axios.get("http://localhost:3001/nar/usuarios/agentesActivos"),
        axios.get("http://localhost:3001/nar/cotizaciones"),
        axios.get("http://localhost:3001/nar/emisiones"),
      ]);

      // Filtrar por mes
      const agentesFiltrados = agentesRes.data.filter(a => {
        const fecha = new Date(a.fechaRegistro);
        return fecha.getMonth() === monthIndex;
      });

      const cotizacionesFiltradas = cotizacionesRes.data.filter(c => {
        const fecha = new Date(c.fechaCotizacion);
        return fecha.getMonth() === monthIndex;
      });

      const emisionesFiltradas = emisionesRes.data.filter(e => {
        const fecha = new Date(e.fechaEmision);
        return fecha.getMonth() === monthIndex;
      });

      setData({
        agentesActivos: agentesFiltrados.length,
        cotizaciones: cotizacionesFiltradas.length,
        emisiones: emisionesFiltradas.length,
      });
    } catch (error) {
      console.error("Error al obtener datos:", error);
      setData({
        agentesActivos: 0,
        cotizaciones: 0,
        emisiones: 0,
      });
    }
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  return (
    <div className="flex flex-col p-6">
      <div className="mb-6 self-end">
        <select
          className="w-full p-3 border border-gray-300 rounded bg-blue-900 text-white text-xl"
          value={month}
          onChange={handleMonthChange}
        >
          {meses.map((mes, idx) => (
            <option
              key={idx}
              value={mes}
              className="bg-white text-black"
            >
              {mes}
            </option>
          ))}
        </select>
      </div>


      <div className="flex justify-center gap-12">
        <div className="flex flex-col items-center  p-12 bg-blue-100 rounded-lg shadow w-56">
          <h2 className="text-3xl font-extrabold text-gray-700 mt-2">Agentes activos</h2>
          <p className="text-8xl font-extrabold text-black">{data.agentesActivos}</p>
        </div>
        <div className="flex flex-col items-center p-20 bg-blue-100 rounded-lg shadow w-56">
          <h2 className="text-3xl font-extrabold text-gray-700 mb-2">Cotizaciones</h2>
          <p className="text-8xl font-extrabold text-black">{data.cotizaciones}</p>
        </div>
        <div className="flex flex-col items-center p-20 bg-blue-100 rounded-lg shadow w-56">
          <h2 className="text-3xl font-extrabold text-gray-700 mb-2">Emisiones</h2>
          <p className="text-8xl font-extrabold text-black">{data.emisiones}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
