import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const SolicitudDocumentos = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;
  console.log("id del admin", id);
  const { profile } = location.state || {};
  console.log("Id del postulante: ", profile._id);

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (profile && profile._id) {
        try {
          // Check API endpoints directly
          console.log("Checking API endpoints for user ID:", profile._id);
          const documentTypes = [
            {
              name: "Comprobante de Domicilio",
              endpoint: "comprobanteDomicilio",
            },
            {
              name: "Constancia de Situación Fiscal",
              endpoint: "constanciaFiscal",
            },
            {
              name: "Identificación Oficial",
              endpoint: "identificacionOficial",
            },
            { name: "Carátula de Banco", endpoint: "caratulaBanco" },
            {
              name: "Documento de Afiliación",
              endpoint: "documentoAfiliacion",
            },
          ];

          // First, check each endpoint directly to see what it returns
          for (const docType of documentTypes) {
            try {
              console.log(`Direct API check for ${docType.name}...`);
              const directResponse = await axios.get(
                `http://localhost:3001/nar/${docType.endpoint}/documentosPostulante/${profile._id}`
              );
              console.log(
                `Direct API response for ${docType.name}:`,
                directResponse.data
              );
            } catch (directError) {
              console.error(
                `Direct API check failed for ${docType.name}:`,
                directError
              );
            }
          }

          const documentPromises = documentTypes.map(async (docType) => {
            try {
              console.log(
                `Fetching ${docType.name} for user ${profile._id}...`
              );
              const response = await axios.get(
                `http://localhost:3001/nar/${docType.endpoint}/documentosPostulante/${profile._id}`
              );

              // Improved document ID extraction with better error handling
              console.log(`Raw response for ${docType.name}:`, response.data);

              // Handle different response formats
              let documentData;
              let idDocumento = null;
              let estado = "pendiente";

              if (Array.isArray(response.data) && response.data.length > 0) {
                // If response is an array, take the first item
                documentData = response.data[0];
                idDocumento =
                  documentData.idDocumento || documentData._id || null;
                estado = documentData.estado || "pendiente";
              } else if (response.data && typeof response.data === "object") {
                // If response is a single object
                documentData = response.data;
                idDocumento =
                  documentData.idDocumento || documentData._id || null;
                estado = documentData.estado || "pendiente";
              } else {
                // If response is not in expected format
                console.warn(
                  `Unexpected response format for ${docType.name}:`,
                  response.data
                );
              }

              console.log(`Processed document data for ${docType.name}:`, {
                idDocumento,
                estado,
              });

              return {
                id: idDocumento,
                name: docType.name,
                status: estado,
                type: docType.endpoint,
              };
            } catch (error) {
              console.error(`Error obteniendo ${docType.endpoint}:`, error);
              return {
                id: null,
                name: docType.name,
                status: "Error",
                type: docType.endpoint,
              };
            }
          });

          const transformedDocuments = await Promise.all(documentPromises);
          console.log("Transformed documents:", transformedDocuments);
          setDocuments(transformedDocuments);
        } catch (error) {
          setError("Error al obtener los documentos.");
          console.error("Error fetching documents:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error("Invalid profile ID:", profile?._id);
        setError("ID de perfil inválido o no encontrado.");
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [profile]);

  const handleViewDocument = (documentId, documentType) => {
    if (documentId) {
      navigate(`/solicitudes/verDocumento`, {state :{id:id, documentId : documentId, documentType: documentType}});
    } else {
      Swal.fire({
        title: "Error",
        text: "No se puede visualizar este documento porque no tiene un ID válido",
        icon: "error",
      });
    }
  };

  const handleBack = () => {
    navigate("/solicitudes", { state: { id: id } });
  };

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
              `http://localhost:3001/nar/usuarios/postulanteAgente/${profile._id}`
            );
            swalWithTailwindButtons.fire({
              title: `${action.charAt(0).toUpperCase() + action.slice(1)}!`,
              text: `El postulante fue ${action}.`,
              icon: "success",
            });
            handleBack();
          } catch (error) {
            setError("Error al actualizar el postulante. Inténtalo más tarde.");
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

  const nombrePostulante = profile
    ? `${profile.nombre || ""} ${profile.apellidoPaterno || ""} ${
        profile.apellidoMaterno || ""
      }`
    : "Postulante";

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
          onClick={() => navigate(-1)}
        >
          Regresar
        </button>
      </div>
    );

  return (
    <div className="p-6 w-auto h-auto overflow-hidden">
      <h1 className="text-3xl p-3 text-center font-normal text-black bg-blue-200 rounded-2xl">
        {nombrePostulante}
      </h1>
      <br />
      <table className="min-w-full">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200 text-center">
              Nombre del Archivo
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-center">
              Estado
            </th>
            <th className="py-2 px-4 border-b border-gray-200 text-center">
              Acción
            </th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, index) => {
            // Improved validation logic for document IDs
            const hasValidId =
              doc.id &&
              typeof doc.id === "string" &&
              doc.id.trim() !== "" &&
              doc.id !== "undefined" &&
              doc.id !== "null";

            console.log(`Document ${doc.name}:`, {
              id: doc.id,
              idType: typeof doc.id,
              hasValidId,
              status: doc.status,
            });

            return (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2 text-center">
                  <p className="text-gray-800">{doc.name}</p>
                </td>
                <td className="py-2 text-center">
                  <p
                    className={`${
                      doc.status === "aceptado"
                        ? "text-green-600"
                        : doc.status === "pendiente"
                        ? "text-yellow-600"
                        : "text-gray-800"
                    }`}
                  >
                    {doc.status}
                  </p>
                </td>
                <td className="py-2 text-center">
                  <button
                    onClick={() =>
                      hasValidId ? handleViewDocument(doc.id, doc.type) : null
                    }
                    className={`botones text-white py-1 px-3 rounded ${
                      !hasValidId ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={!hasValidId}
                    aria-label={`Ver más detalles de ${doc.name}`}
                  >
                    {hasValidId ? "Ver más" : "No disponible"}
                  </button>
                </td>
              </tr>
            );
          })}
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
          className="w-30 text-white py-2 px-4 rounded-md botones"
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
