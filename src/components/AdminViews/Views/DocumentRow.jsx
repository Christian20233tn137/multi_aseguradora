import React from "react";

const DocumentRow = ({ document, onView }) => {
  // Verificar si el documento tiene un ID válido
  const hasValidId = document.id && document.id !== "undefined" && document.id !== "null" && document.id !== "";

  console.log("Document ID:", document.id); // Agregar esto para depurar

  return (
    <tr className="border-b border-gray-200">
      <td className="py-2 text-center">
        <p className="text-gray-800">{document.name}</p>
      </td>
      <td className="py-2 text-center">
        <p className={`${document.status === "aceptado" ? "text-green-600" : document.status === "pendiente" ? "text-yellow-600" : "text-gray-800"}`}>
          {document.status}
        </p>
      </td>
      <td className="py-2 text-center">
        <button
          onClick={() => hasValidId ? onView(document.id, document.type) : null}
          className={`botones text-white py-1 px-3 rounded ${!hasValidId ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!hasValidId}
          aria-label={`Ver más detalles de ${document.name}`}
        >
          {hasValidId ? "Ver más" : "No disponible"}
        </button>
      </td>
    </tr>
  );
};

export default DocumentRow;
