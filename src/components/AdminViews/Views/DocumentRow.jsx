import React from "react";

const DocumentRow = ({ document, onView }) => {
  return (
    <tr className="border-b border-gray-200">
      <td className="py-2 text-center">
        <p className="text-gray-800">{document.name}</p>
      </td>
      <td className="py-2 text-center">
        <p className="text-gray-800">{document.status}</p>
      </td>
      <td className="py-2 text-center">
        <button
          onClick={() => onView(document.id, document.type)}
          className="botones text-white py-1 px-3 rounded"
          aria-label={`Ver más detalles de ${document.name}`}
        >
          Ver más
        </button>
      </td>
    </tr>
  );
};

export default DocumentRow;
