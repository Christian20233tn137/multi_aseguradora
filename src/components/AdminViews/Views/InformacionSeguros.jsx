import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const InformacionSeguros = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id; // Obtener el ID del seguro desde el estado de navegación
  console.log("ID del seguro:", id);

  const [seguroData, setSeguroData] = useState({
    nombre: "",
    cobertura: "",
    tipo: "",
    precioBase: "",
    icono: null,
  });

  useEffect(() => {
    const fetchSeguroData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/nar/seguros/id/${id}`);
        const data = response.data;
        console.log("Datos del seguro obtenidos:", data);

        setSeguroData({
          nombre: data.nombre,
          cobertura: data.cobertura,
          tipo: data.tipo,
          precioBase: data.precioBase,
          icono: data.icono,
        });
      } catch (error) {
        console.error("Error al obtener los datos del seguro:", error);
        Swal.fire("Error", "No se pudo cargar la información del seguro.", "error");
      }
    };

    if (id) {
      fetchSeguroData();
    } else {
      console.error("ID del seguro no proporcionado");
    }
  }, [id]);

  const handleRegresar = () => {
    navigate("/aseguradoras/seguros",  { state: { idAseguradora } });
  };

  return (
    <div className="p-4 flex flex-col items-center">
      {/* Título */}
      <div className="text-xl rounded p-4 w-full max-w-3xl text-center">
        <h1 className="text-3xl max-w-screen p-3 text-center font-normal text-black bg-blue-100 rounded-2xl">
          Información del Seguro
        </h1>
      </div>

      {/* Contenedor de la información */}
      <div className="mt-8 p-8 border rounded-lg shadow-md w-full max-w-3xl text-left">
        {/* Círculo */}
        {seguroData.icono && (
          <div className="w-16 h-16 bg-[#3f4a66] rounded-full mb-4" style={{ backgroundImage: `url(${seguroData.icono})`, backgroundSize: 'cover' }}></div>
        )}
        {/* Nombre del Seguro */}
        <div className="mb-2">
          <strong>Nombre del Seguro:</strong> {seguroData.nombre}
        </div>
        {/* Tipo de Seguro */}
        <div className="mb-2">
          <strong>Tipo:</strong> {seguroData.tipo}
        </div>
        {/* Precio Base */}
        <div className="mb-2">
          <strong>Precio Base:</strong> ${seguroData.precioBase}
        </div>
        {/* Cobertura */}
        <div className="mt-4">
          <strong>Cobertura:</strong>
          <div className="border p-2 mt-2" dangerouslySetInnerHTML={{ __html: seguroData.cobertura }} />
        </div>
      </div>

      {/* Botón Regresar */}
      <button
        onClick={handleRegresar}
        className="mt-8 bg-[#0f2344] text-white px-8 py-3 rounded border-4"
      >
        Regresar
      </button>
    </div>
  );
};

export default InformacionSeguros;
