import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const SolicitudDocumentos = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = location.state || {};
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/nar/documentosPersona/files/persona/${profile._id}`);
        setDocuments(response.data);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    if (profile._id) {
      fetchDocuments();
    }
  }, [profile]);

  const handleBack = () => {
    navigate("/solicitudes");
  };

  const showAlert = async () => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
        cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
      },
      buttonsStyling: false
    });

    swalWithTailwindButtons.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, aceptarlo!",
      cancelButtonText: "No, cancelarlo!",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put(`http://localhost:3000/nar/usuarios/postulanteAgente/`, profile);
          swalWithTailwindButtons.fire({
            title: "¡Aceptado!",
            text: "El postulante fue aceptado y su rol cambió a agente.",
            icon: "success",
          });
          handleBack();
        } catch (error) {
          console.error("Error updating postulante:", error);
          swalWithTailwindButtons.fire({
            title: "Error",
            text: "Hubo un problema al aceptar al postulante.",
            icon: "error",
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithTailwindButtons.fire({
          title: "Cancelado",
          text: "El postulante no fue aceptado",
          icon: "error"
        });
      }
    });
  };

  const showAlertDenegar = () => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
        cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
      },
      buttonsStyling: false
    });

    swalWithTailwindButtons.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, eliminalo!",
      cancelButtonText: "No, cancelalo!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithTailwindButtons.fire({
          title: "Denegado!",
          text: "El postulante fue denegado.",
          icon: "success",
        });
        handleBack();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithTailwindButtons.fire({
          title: "Cancelado",
          text: "El postulante fue denegado correctamente",
          icon: "error"
        });
      }
    });
  };

  const nombrePostulante = `${profile.nombre} ${profile.apellidoPaterno} ${profile.apellidoMaterno}`;

  return (
    <div className="p-6 w-auto h-auto overflow-hidden">
      <h1 className="text-3xl max-w-screen p-3 text-center font-normal text-black bg-blue-200 rounded-2xl">
        {nombrePostulante}
      </h1>
      {documents.map((doc, index) => (
        <div key={index} className="mb-6">
          <label className="mt-10 block text-gray-700 text-lg font-bold mb-2">
            {doc.name}
          </label>
          <a href={`http://localhost:3000/nar/documentosPersona/files/persona/${profile._id}/${doc.file}`} target="_blank" rel="noopener noreferrer">
            <div className="shadow appearance-none border-2 rounded w-full py-18 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              Ver Documento
            </div>
          </a>
        </div>
      ))}
      <div className="flex space-x-5 justify-center mt-10">
        <button
          type="button"
          className="w-32 text-white py-2 rounded-md botones"
          onClick={showAlertDenegar}
        >
          Denegar
        </button>
        <button
          type="button"
          className="w-30 text-white py-2 px-4 rounded-md botones"
          onClick={() => navigate(-1)} // Esto regresará a la página anterior
        >
          Regresar
        </button>
        <button
          type="button"
          className="w-32 text-white py-2 rounded-md botones"
          onClick={showAlert}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default SolicitudDocumentos;
