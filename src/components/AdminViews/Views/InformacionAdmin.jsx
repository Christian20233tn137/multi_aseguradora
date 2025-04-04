import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = "http://localhost:3000/nar/usuarios/id";

const InformacionAdmin = () => {
  const location = useLocation();

  const navigate = useNavigate();
  const { id } = useParams(); // Obtener el ID del administrador desde la URL
  const [adminData, setAdminData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefono: "",
    curp: "",
    rfc: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get(`${API_URL}/${id}`);
        setAdminData(response.data);
      } catch (error) {
        console.error("Error al obtener los datos del administrador:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!adminData) {
    return <div>No se encontraron datos del administrador.</div>;
  }

  return (
    <div className="p-6 w-full h-auto overflow-hidden">
      <h1 className="text-3xl w-full p-3 text-center font-normal text-black miColor rounded-2xl">
        {adminData.nombre} {adminData.apellidoPaterno} {adminData.apellidoMaterno}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-2">Correo electrónico:</label>
          <input className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={adminData.correo} readOnly />
        </div>
        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-2">Teléfono:</label>
          <input className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={adminData.telefono} readOnly />
        </div>
        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-16">CURP:</label>
          <input className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={adminData.curp} readOnly />
        </div>
        <div className="flex items-center">
          <label className="text-gray-700 text-sm font-bold mr-10">RFC:</label>
          <input className="flex-1 shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" value={adminData.rfc} readOnly />
        </div>
      </div>

      {/* Botón Regresar */}
      <div className="col-span-2 flex items-center justify-center mt-8">
        <button
          type="button"
          className="text-white py-2 px-4 rounded-md botones"
          onClick={() => navigate(-1)} // Esto regresará a la página anterior
        >
          Regresar
        </button>
      </div>
    </div>
  );
};

export default InformacionAdmin;
