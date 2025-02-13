import React, { useState } from "react";
import Close from "./assets/Close.png";

const RecruimentStructure = () => {
  let nombre = "Nombre de la aseguradora";
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="p-6 bg-white shadow-md">
      <h3 className="mt-3 text-center text-2xl font-bold mb-4">
        ¡Buscamos Agentes!
      </h3>
      <p className="mt-4 text-black mb-6">
        <strong className="font-semibold">{nombre}</strong>, líder en el sector
        asegurador. Ofrecemos seguros personalizados que brindan tranquilidad a
        nuestros clientes. Buscamos agentes apasionados para llevar nuestras
        soluciones innovadoras a más personas.
      </p>
      <button
        type="button"
        className="w-full px-4 py-2 botones"
        onClick={openModal}
      >
        Postularme
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center px-4">
          <div className="bg-white rounded-lg shadow-lg w-full sm:max-w-lg md:max-w-xl lg:max-w-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-2 border-b">
              <h2 className="text-left font-bold text-lg">Postularme</h2>
              <img
                className="object-cover w-13 h-13 cursor-pointer p-2"
                src={Close}
                alt="Cerrar"
                onClick={closeModal}
              />
            </div>
            <form>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Nombre*", type: "text" },
                  { label: "Apellido paterno*", type: "text" },
                  { label: "Apellido materno*", type: "text" },
                  { label: "Correo electrónico*", type: "email" },
                  { label: "Teléfono*", type: "tel" },
                  { label: "Domicilio*", type: "text" },
                  { label: "RFC*", type: "text" },
                ].map((field, index) => (
                  <div key={index} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      className="mt-1 p-2 w-full border rounded-md"
                      required
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  type="submit"
                  className="w-30 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 botones"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruimentStructure;
