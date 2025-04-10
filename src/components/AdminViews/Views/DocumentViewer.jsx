import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const DocumentViewer = () => {
  const location = useLocation();
  const documentId = location.state?.documentId;
  const id = location.state?.id;
  const documentType = location.state?.documentType;
  console.log("Tipo de documento: ", documentType);
  console.log("El id del admin es: ", id);
  console.log("El id del documento es: ", documentId);
  const navigate = useNavigate();
  const [documentContent, setDocumentContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [documentStatus, setDocumentStatus] = useState(null);


  useEffect(() => {
    const fetchDocument = async () => {
      try {
        if (
          !documentType ||
          !documentId ||
          documentId === "undefined" ||
          documentId === "null"
        ) {
          throw new Error("Faltan parámetros: tipo de documento o id válido.");
        }

        // 1. Obtener el estado del documento
        const statusResponse = await axios.get(
          `http://localhost:3001/nar/${documentType}/estado/${documentId}`
        );
        const estado = statusResponse.data.estado; // Ajusta según tu respuesta exacta
        setDocumentStatus(estado);

        // 2. Descargar el documento
        const endpoint = documentType;
        if (!endpoint) {
          throw new Error("Tipo de documento no válido.");
        }

        const response = await axios.get(
          `http://localhost:3001/nar/${endpoint}/descargarDocumento/${documentId}`,
          {
            responseType: "blob",
          }
        );

        const blob = new Blob([response.data], { type: "application/pdf" });
        const fileURL = URL.createObjectURL(blob);
        setDocumentContent(fileURL);
      } catch (error) {
        if (error.response && error.response.status === 500) {
          setError(
            "Error del servidor: El documento no existe o no está disponible."
          );
        } else {
          setError(`Error al obtener el documento: ${error.message}`);
        }
        console.error("Error al consultar el documento:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId, documentType]);


  const showAlert = async (action) => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        confirmButton:
          "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
        cancelButton:
          "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2",
      },
      buttonsStyling: false,
    });

    swalWithTailwindButtons
      .fire({
        title: `¿Estás seguro de que deseas ${action} el documento?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, ¡hazlo!",
        cancelButtonText: "No, cancelar",
        reverseButtons: true,
      })
      .then(async (result) => {
        if (result.isConfirmed) {
          setIsProcessing(true);
          try {
            if (action === "aceptar") {
              await axios.put(
                `http://localhost:3001/nar/${documentType}/aceptarDocumento/${documentId}`
              );
              Swal.fire(
                "¡Aceptado!",
                "El documento ha sido aceptado.",
                "success"
              );
            } else if (action === "rechazar") {
              await axios.delete(
                `http://localhost:3001/nar/${documentType}/rechazarDocumento/${documentId}`
              );
              Swal.fire(
                "¡Rechazado!",
                "El documento ha sido rechazado.",
                "success"
              );
            }
            navigate(-2);
          } catch (error) {
            console.error("Error al procesar documento:", error);
            Swal.fire(
              "Error",
              "Hubo un problema al procesar el documento.",
              "error"
            );
          } finally {
            setIsProcessing(false);
          }
        }
      });
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loader border-8 border-t-8 border-gray-200 border-t-blue-500 rounded-full w-16 h-16 animate-spin"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-xl mb-4">{error}</div>
        <button
          type="button"
          className="w-32 text-white py-2 rounded-md bg-gray-500 hover:bg-gray-600"
          onClick={() => navigate(-1, { state: { id: id, } })}
        >
          Regresar
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center h-screen relative">
      {documentContent ? (
        <div className="border-2 border-gray-300 rounded-lg shadow-lg p-2 w-11/12 h-5/6 mb-4">
          <iframe
            src={documentContent}
            className="w-full h-full border-none"
            title="Document Viewer"
          ></iframe>
        </div>
      ) : (
        <div>No se pudo cargar el documento.</div>
      )}
      <div className="flex space-x-4">
        <button
          type="button"
          className={`w-32 text-white py-2 rounded-md ${documentStatus === 'aceptado' ? 'bg-green-300 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
          disabled={documentStatus === 'aceptado'}
          onClick={() => showAlert("aceptar")}
        >
          Aceptar
        </button>
        <button
          type="button"
          className="w-32 text-white py-2 rounded-md botones"
          onClick={() => navigate(-1, { state: { id: id, } })}
        >
          Regresar
        </button>
        <button
          type="button"
          className={`w-32 text-white py-2 rounded-md ${documentStatus === 'aceptado' ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
          disabled={documentStatus === 'aceptado'}
          onClick={() => showAlert("rechazar")}
        >
          Rechazar
        </button>
      </div>
      {isProcessing && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
          <div className="loader border-8 border-t-8 border-gray-200 border-t-blue-500 rounded-full w-16 h-16 animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;
