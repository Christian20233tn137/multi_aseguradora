import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Close from "./assets/Close.png";

const RecruimentStructure = () => {
  let nombre = "Nombre de la aseguradora";
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
  const [isLoading, setIsLoading] = useState(false); // Estado para el loader

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
      // Prevent non-numeric input for telefono
      return;
    }
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Mostrar el loader
    try {
      console.log("Datos a enviar:", formData);

      // Validar que todos los campos estén llenos
      if (!formData.nombre || !formData.apellidoPaterno || !formData.apellidoMaterno || !formData.curp || !formData.rfc || !formData.correo || !formData.telefono) {
        throw new Error('Todos los campos son requeridos');
      }

      // Validar formato de correo, RFC y CURP
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

      await axios.post("http://localhost:3000/nar/usuarios/postulante", formData);

      // Show success alert with SweetAlert2
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

      // Show error alert with SweetAlert2
      swalWithTailwindButtons.fire({
        title: "Error",
        text: "Hubo un error al enviar la postulación: " + error.message,
        icon: "error",
        confirmButtonText: "Aceptar"
      });
    } finally {
      setIsLoading(false); // Ocultar el loader
    }
  };

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
      <button type="button" className="w-full px-4 py-2 botones" onClick={openModal}>
        Postularme
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex justify-center items-center px-4">
          <div className="bg-white rounded-lg shadow-lg w-full sm:max-w-lg md:max-w-xl lg:max-w-3xl p-4 sm:p-6 max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-center p-2 border-b">
              <h2 className="text-left font-bold text-lg">Postularme</h2>
              <img className="object-cover w-13vis h-13 cursor-pointer p-2" src={Close} alt="Cerrar" onClick={closeModal} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {["nombre", "apellidoPaterno", "apellidoMaterno", "correo", "telefono", "rfc", "curp"].map((field, index) => (
                  <div key={index} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.charAt(0).toUpperCase() + field.slice(1)}*
                    </label>
                    <input
                      type={field === "correo" ? "email" : field === "telefono" ? "tel" : "text"}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      className="mt-1 p-2 w-full border rounded-md"
                      required
                    />
                  </div>
                ))}
              </div>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <div className="mt-4 flex justify-center">
                <button type="submit" className="w-30 px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 botones" disabled={isLoading}>
                  {isLoading ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </form>
            {isLoading && (
              <div className="absolute inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
                <div className="loader border-8 border-t-8 border-gray-200 border-t-blue-500 rounded-full w-16 h-16 animate-spin"></div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruimentStructure;
