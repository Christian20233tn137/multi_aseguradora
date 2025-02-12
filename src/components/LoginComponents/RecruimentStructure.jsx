import React from "react";

const RecruimentStructure = () => {
  let nombre = 'Nombre de la aseguradora';

  return (
    <div className="p-13 bg-white shadow-md">
      <h3 className="mt-3 text-center text-2xl font-bold mb-4">¡Buscamos Agentes!</h3>
      <p className="mt-4 text-black mb-6">
        <strong className="font-semibold">{nombre}</strong>, líder en el sector asegurador.
        Ofrecemos seguros personalizados que brindan tranquilidad a nuestros
        clientes. Buscamos agentes apasionados para llevar nuestras soluciones
        innovadoras a más personas.
      </p>
      <button
        type="button"
        className="w-full px-4 py-2 botones"
        data-bs-toggle="modal"
        data-bs-target="#registroProspecto"
      >
        Postularme
      </button>
    </div>
  );
};

export default RecruimentStructure;
