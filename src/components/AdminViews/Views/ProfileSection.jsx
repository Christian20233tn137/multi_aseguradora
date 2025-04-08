import React, { useEffect, useState } from "react";
import axios from "axios";
import emitter from "../../../utils/eventEmitter"; // Asegúrate de que esta ruta sea correcta

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

  // Setear mes actual al iniciar
  useEffect(() => {
    const mesActual = new Date().getMonth();
    setMonth(meses[mesActual]);
  }, []);

  // Llamar datos cuando cambia el mes
  useEffect(() => {
    if (month) {
      fetchAllStats(month);
    }
  }, [month]);

  // Escuchar eventos para actualizar las cards dinámicamente
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
    const mesIndex = meses.indexOf(mesSeleccionado) + 1; // Convertir nombre del mes a índice (1-12)

    try {
      const [agentesRes, cotizacionesRes, emisionesRes] = await Promise.all([
        axios.get(`http://localhost:3001/nar/usuarios/agentesActivos?mes=${mesIndex}`),
        axios.get(`http://localhost:3001/nar/cotizaciones?mes=${mesIndex}`),
        axios.get(`http://localhost:3001/nar/emisiones/?mes=${mesIndex}`),
      ]);

      setData({
        agentesActivos: agentesRes.data.length || 0,
        cotizaciones: cotizacionesRes.data.length || 0,
        emisiones: emisionesRes.data.length || 0,
      });
    } catch (error) {
      console.error("Error al obtener datos:", error);
    }
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  return (
    <div className="flex flex-col p-6">
      {/* Dropdown */}
      <div className="mb-6 self-end">
        <select className="p-2 border rounded" value={month} onChange={handleMonthChange}>
          {meses.map((mes, idx) => (
            <option key={idx} value={mes}>{mes}</option>
          ))}
        </select>
      </div>

      {/* Cards */}
      <div className="flex flex-wrap justify-center gap-6">
        {/* Agentes activos */}
        <div className="flex flex-col items-center flex-1 p-6 bg-blue-100 rounded-lg shadow min-w-[200px]">
          <h2 className="text-lg font-semibold mb-2">Agentes activos</h2>
          <p className="text-3xl font-bold">{data.agentesActivos}</p>
        </div>

        {/* Cotizaciones */}
        <div className="flex flex-col items-center flex-1 p-6 bg-blue-100 rounded-lg shadow min-w-[200px]">
          <h2 className="text-lg font-semibold mb-2">Cotizaciones</h2>
          <p className="text-3xl font-bold">{data.cotizaciones}</p>
        </div>

        {/* Emisiones */}
        <div className="flex flex-col items-center flex-1 p-6 bg-blue-100 rounded-lg shadow min-w-[200px]">
          <h2 className="text-lg font-semibold mb-2">Emisiones</h2>
          <p className="text-3xl font-bold">{data.emisiones}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
