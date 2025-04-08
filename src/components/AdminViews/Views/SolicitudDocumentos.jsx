import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import DocumentRow from "../Views/DocumentRow";

const SolicitudDocumentos = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;
  const { profile } = location.state || {};
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (profile && profile._id && /^[0-9a-fA-F]{24}$/.test(profile._id)) {
        try {
          const documentTypes = [
            { name: "Comprobante de Domicilio", endpoint: "comprobanteDomicilio" },
            { name: "Constancia de Situación Fiscal", endpoint: "constanciaFiscal" },
            { name: "Identificación Oficial", endpoint: "identificacionOficial" },
            { name: "Carátula de Banco", endpoint: "caratulaBanco" },
            { name: "Documento de Afiliación", endpoint: "documentoAfiliacion" },
          ];

          const documentPromises = documentTypes.map(async (docType) => {
            const response = await axios.get(
              `http://localhost:3000/nar/${docType.endpoint}/documentosPostulante/${profile._id}`
            );
            return {
              id: response.data.idDocumento,
              name: docType.name,
              status: response.data.estado || "Pending",
              type: docType.endpoint,
            };
          });

          const transformedDocuments = await Promise.all(documentPromises);
          setDocuments(transformedDocuments);
        } catch (error) {
          setError("Error al obtener los documentos.");
          console.error("Error fetching documents:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error("Invalid profile ID:", profile._id);
        setError("Invalid profile ID format.");
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [profile]);

  const handleViewDocument = (documentId, documentType) => {
    navigate(`/solicitudes/verDocumento/${documentId}/${documentType}`);
  };

  const handleBack = () => {
    navigate("/solicitudes");
  };

  const showAlert = async (action) => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
        cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2",
      },
      buttonsStyling: false,
    });

    swalWithTailwindButtons
      .fire({
        title: `¿Estás seguro de ${action} al postulante?`,
        text: "No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: `Si, ${action}!`,
        cancelButtonText: "No, cancelar!",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          try {
            await axios.put(
              `http://localhost:3000/nar/usuarios/postulanteAgente/${profile._id}`
            );
            swalWithTailwindButtons.fire({
              title: `${action.charAt(0).toUpperCase() + action.slice(1)}!`,
              text: `El postulante fue ${action}.`,
              icon: "success",
            });
            handleBack();
          } catch (error) {
            setError("Error updating postulante. Please try again later.");
            console.error("Error updating postulante:", error);
            swalWithTailwindButtons.fire({
              title: "Error",
              text: "Hubo un problema al aceptar al postulante.",
              icon: "error",
            });
          }
        }
      });
  };

  const nombrePostulante = `${profile.nombre} ${profile.apellidoPaterno} ${profile.apellidoMaterno}`;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 w-auto h-auto overflow-hidden">
      <h1 className="text-3xl p-3 text-center font-normal text-black bg-blue-200 rounded-2xl">
        {nombrePostulante}
      </h1>
      <br />
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 text-center">Nombre del Archivo</th>
            <th className="py-2 px-4 border-b border-gray-200 text-center">Estado</th>
            <th className="py-2 px-4 border-b border-gray-200 text-center">Acción</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, index) => (
            <DocumentRow key={index} document={doc} onView={handleViewDocument} />
          ))}
        </tbody>
      </table>
      <div className="flex space-x-5 justify-center mt-10">
        <button
          type="button"
          className="w-32 text-white py-2 rounded-md bg-red-500 hover:bg-red-600"
          onClick={() => showAlert("denegar")}
        >
          Denegar
        </button>
        <button
          type="button"
          className="w-30 text-white py-2 px-4 rounded-md bg-gray-500 hover:bg-gray-600"
          onClick={() => navigate(-1)}
        >
          Regresar
        </button>
        <button
          type="button"
          className="w-32 text-white py-2 rounded-md bg-green-500 hover:bg-green-600"
          onClick={() => showAlert("aceptar")}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default SolicitudDocumentos;
