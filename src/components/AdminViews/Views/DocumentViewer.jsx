import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const DocumentViewer = () => {
  const { id: documentId } = useParams();
  const [documentContent, setDocumentContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/nar/documentosPersona/descargarDocumento/${documentId}`,
          {
            responseType: 'blob', // Importante para manejar archivos binarios
          }
        );

        // Crear una URL para el blob y mostrarlo
        const fileURL = URL.createObjectURL(response.data);
        setDocumentContent(fileURL);
      } catch (error) {
        setError("Error al obtener el documento.");
        console.error("Error fetching document:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [documentId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex items-center justify-center h-screen">
      {documentContent ? (
        <div className="border-2 border-gray-300 rounded-lg shadow-lg p-2 w-11/12 h-5/6">
          <iframe
            src={documentContent}
            className="w-full h-full border-none"
            title="Document Viewer"
          ></iframe>
        </div>
      ) : (
        <div>No se pudo cargar el documento.</div>
      )}
    </div>
  );
};

export default DocumentViewer;
