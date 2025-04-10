import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "https://lz2k718xka.execute-api.us-east-1.amazonaws.com/nar/emisiones/id";

const InformacionPolizas = () => {
  const location = useLocation();
  const id = location.state.id;
  const idPoliza = location.state.idPoliza;
  const [poliza, setPoliza] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  console.log("ID de la póliza:", id);
  console.log("ID de la póliza:", idPoliza);

  useEffect(() => {
    const fetchInformacionPolizas = async () => {
      try {
        if (!idPoliza) {
          setError("ID de la póliza no definido");
          return;
        }

        console.log("Intentando obtener información de la póliza:", id);
        const response = await axios.get(`${API_URL}/${idPoliza}`);

        if (response.data.success) {
          setPoliza(response.data.data);
          setError(null);
        } else {
          setError(
            response.data.message ||
            "Error al obtener la información de la póliza"
          );
        }
      } catch (error) {
        console.error("Error al obtener la información de la póliza:", error);
        setError("Error al conectar con el servidor");
      }
    };

    fetchInformacionPolizas();
  }, [id]);

  const handleRegresar = () => {
    navigate(-1);
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!poliza) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="p-4 sm:p-6 flex flex-col items-center">
      <h1 className="text-xl sm:text-2xl font-semibold text-black bg-blue-100 py-3 px-6 rounded-xl w-full text-center">
        Póliza N.1
      </h1>

      <div className="mt-6 p-4 sm:p-6 border-0 shadow-md rounded-lg w-full max-w-3xl bg-white">
        <h2 className="text-lg font-bold">INFORMACIÓN DE LA PÓLIZA</h2>
        <p>
          <strong>Correo del titular:</strong> {poliza.correoTitular}
        </p>
        <p>
          <strong>Nombre del Asegurado:</strong> {poliza.nombreAsegurado}
        </p>
        <p>
          <strong>RFC:</strong> {poliza.rfc}
        </p>
        <p>
          <strong>Teléfono:</strong> {poliza.telefono}
        </p>
        <p>
          <strong>Nombre del Seguro:</strong> {poliza.nombreSeguro}
        </p>
        <p>
          <strong>Tipo de Seguro:</strong> {poliza.tipoSeguro}
        </p>
        <p>
          <div>
            <strong>Cobertura:</strong>
            <div className="pl-4 mt-1" dangerouslySetInnerHTML={{ __html: poliza.cobertura }} />
          </div>
        </p>
        <p>
          <strong>Vigencia:</strong> {poliza.vigencia}
        </p>
        <p>
          <strong>Monto Total:</strong> ${poliza.montoTotal.toFixed(2)}
        </p>
      </div>

      <button
        onClick={handleRegresar}
        className="mt-6 botones rounded-lg text-white px-6 py-2 transition font-medium w-full sm:w-auto"
      >
        Regresar
      </button>
    </div>
  );

};

export default InformacionPolizas;
