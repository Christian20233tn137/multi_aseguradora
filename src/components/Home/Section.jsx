import React, { useState } from "react";
import Close from "./assets/Close.png"; // Ajusta la ruta de tu ícono de cerrar

const Section = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <section className="flex flex-col justify-center items-center p-5 lg:p-10 relative">
      <div className="w-full max-w-[400px] text-center">
        <h1 className="text-2xl lg:text-4xl font-bold text-blue-950">
          BUSCAMOS AGENTES
        </h1>
        <p className="mt-2 lg:mt-3 text-black text-sm lg:text-base">
          ¡Impulsa tu éxito con Nar! Únete como agente y disfruta de ingresos
          atractivos, libertad laboral y el respaldo de una multi aseguradora
          líder. ¡Postúlate hoy y transforma tu futuro!
        </p>
        <button
          className="mt-4 lg:mt-6 text-white px-6 py-2 botones w-full bg-[#0B1956] hover:bg-[#0d246e] rounded-md"
          onClick={openModal}
        >
          Postularme
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center px-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full sm:max-w-lg md:max-w-xl lg:max-w-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-2 border-b">
              <h2 className="text-left font-bold text-lg">Postularme</h2>
              <img
                className="object-cover w-8 h-8 cursor-pointer p-1"
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
                  className="w-30 px-6 py-3 bg-[#0B1956] text-white rounded-md hover:bg-[#0d246e] botones"
                >
                  Enviar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Section;
