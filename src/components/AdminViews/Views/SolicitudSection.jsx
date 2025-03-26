import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const SolicitudSection = () => {

  const navigate = useNavigate();

  const handleBack = () =>{
    navigate("/solicitudes");
  }
  const showAlert = () => {
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
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithTailwindButtons.fire({
          title: "Aceptado!",
          text: "El postulante fue aceptado.",
          icon: "success",
        });
        handleBack(); 
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithTailwindButtons.fire({
          title: "Cancelado",
          text: "El postulante no fue aceptado",
          icon: "error"
        });
      }
    });
  }

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
          text: "El postulunante fue denegado correctamente",
          icon: "error"
        });
      }
    });
    
    
  }

  let nombrePostulante = "Juan Perez";

  return (
    <div className="p-6 w-auto h-auto overflow-hidden">
      <h1 className="text-3xl max-w-screen p-3 text-center font-normal text-black miColor rounded-2xl">
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
              required
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
              required
            />
          </div>

          <div className="flex items-center gap-2 mt-5">
            <label
              htmlFor="domicilio"
              className="text-sm font-medium text-black w-48"
            >
              Domicilio
            </label>
            <input
              type="text"
              id="domicilio"
              name="domicilio"
              className="py-2 px-4 font-medium border border-gray-300 flex-1"
              required
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
              required
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
