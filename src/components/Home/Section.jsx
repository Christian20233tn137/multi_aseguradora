import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Close from "./assets/Close.png";

const Section = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    correo: "",
    telefono: "",
    rfc: "",
    curp: ""
  });
  const [errorMessage, setErrorMessage] = useState("");

  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
      cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
    },
    buttonsStyling: false
  });

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setErrorMessage("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "telefono" && !/^\d*$/.test(value)) {
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Datos a enviar:", formData);

      if (!formData.nombre || !formData.apellidoPaterno || !formData.apellidoMaterno || !formData.correo || !formData.telefono || !formData.rfc || !formData.curp) {
        throw new Error('Todos los campos son requeridos');
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.correo)) {
        throw new Error('El correo electrónico no tiene un formato válido');
      }

      const rfcPattern = /^[A-ZÑ&]{3,4}\d{6}[A-Z\d]{3}$/;
      if (!rfcPattern.test(formData.rfc)) {
        throw new Error('El RFC no tiene un formato válido (ej. ABC123456XYZ)');
      }

      const curpPattern = /^[A-Z]{4}\d{6}[HM]{1}[A-Z]{2}[BCDFGHJKLMNPQRSTVWXYZ]{3}[A-Z\d]{2}$/;
      if (!curpPattern.test(formData.curp)) {
        throw new Error('La CURP no tiene un formato válido (ej. ABCD123456HMZXYZ)');
      }

      swalWithTailwindButtons.fire({
        title: "Enviando...",
        text: "Por favor espera.",
        icon: "info",
        showConfirmButton: false,
        allowOutsideClick: false,
      });

      await axios.post("http://localhost:3000/nar/usuarios/postulante", formData);

      swalWithTailwindButtons.fire({
        title: "Éxito",
        text: "Postulación enviada con éxito",
        icon: "success",
        confirmButtonText: "Aceptar"
      }).then(() => {
        closeModal();
      });
    } catch (error) {
      console.error("Error al enviar la postulación", error);
      setErrorMessage(error.response?.data || error.message);

      swalWithTailwindButtons.fire({
        title: "Error",
        text: "Hubo un error al enviar la postulación: " + error.message,
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    }
  };

  return (
    <section className="flex flex-col justify-center items-center p-5 lg:p-10">
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
          className="mt-4 lg:mt-6 text-white px-6 py-2 botones w-full"
          onClick={openModal}
        >
          Postularme
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center px-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full sm:max-w-lg md:max-w-xl lg:max-w-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center p-2 border-b">
              <h2 className="text-left font-bold text-lg">Postularme</h2>
              <img
                className="object-cover w-13vis h-13 cursor-pointer p-2"
                src={Close}
                alt="Cerrar"
                onClick={closeModal}
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { label: "Nombre*", type: "text", name: "nombre" },
                  { label: "Apellido paterno*", type: "text", name: "apellidoPaterno" },
                  { label: "Apellido materno*", type: "text", name: "apellidoMaterno" },
                  { label: "Correo electrónico*", type: "email", name: "correo" },
                  { label: "Teléfono*", type: "tel", name: "telefono" },
                  { label: "RFC*", type: "text", name: "rfc" },
                  { label: "CURP*", type: "text", name: "curp" },
                ].map((field, index) => (
                  <div key={index} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="mt-1 p-2 w-full border rounded-md"
                      required
                    />
                  </div>
                ))}
              </div>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
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
    </section>
  );
};

export default Section;
