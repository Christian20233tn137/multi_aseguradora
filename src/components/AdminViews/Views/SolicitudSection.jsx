import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const SolicitudSection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = location.state || {};

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
          const response = await axios.put(`http://localhost:3000/nar/usuarios/postulanteAceptado/${profile._id}`);
          swalWithTailwindButtons.fire({
            title: "¡Aceptado!",
            text: "El postulante fue aceptado.",
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
      <div className="flex items-center gap-2 mt-5 justify-center">
        <div className="mt-10">
          <div className="flex items-center gap-2 mt-5">
            <label
              htmlFor="usuario"
              className="text-sm font-medium text-black w-48"
            >
              Correo Electrónico
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              className="py-2 px-4 font-medium border border-gray-300 flex-1"
              value={profile.correo || ""}
              readOnly
            />
          </div>

          <div className="flex items-center gap-2 mt-5">
            <label
              htmlFor="telefono"
              className="text-sm font-medium text-black w-48"
            >
              Teléfono
            </label>
            <input
              type="text"
              id="telefono"
              name="telefono"
              className="py-2 px-4 font-medium border border-gray-300 flex-1"
              value={profile.telefono || ""}
              readOnly
            />
          </div>

          <div className="flex items-center gap-2 mt-5">
            <label
              htmlFor="domicilio"
              className="text-sm font-medium text-black w-48"
            >
             CURP
            </label>
            <input
              type="text"
              id="domicilio"
              name="domicilio"
              className="py-2 px-4 font-medium border border-gray-300 flex-1"
              value={profile.curp || ""}
              readOnly
            />
          </div>

          <div className="flex items-center gap-2 mt-5">
            <label
              htmlFor="rfc"
              className="text-sm font-medium text-black w-48"
            >
              RFC
            </label>
            <input
              type="text"
              id="rfc"
              name="rfc"
              className="py-2 px-4 font-medium border border-gray-300 flex-1"
              value={profile.rfc || ""}
              readOnly
            />
          </div>

          <div className="flex space-x-20 justify-center mt-20">
            <button
              type="button"
              className="w-30 z-auto text-white py-3 rounded-md botones"
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
              className="w-30 text-white rounded-md botones"
              onClick={showAlert}
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolicitudSection;
