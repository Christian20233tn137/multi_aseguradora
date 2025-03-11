import React from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const SolicitudDocumentos = () => {

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/solicitudes");
  }

  const showAlert = () => {
      Swal.fire({
        title: "Estas seguro?",
        text: "No podras revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si quiero aceptarlo!"
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: "Aceptado!",
            text: "El postulante fue aceptado con exito",
            icon: "success"
          });
          handleBack();
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
      title: "Estas seguro?",
      text: "No podras revertir esto!",
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
      <h1 className="text-3xl max-w-screen p-3 text-center font-normal text-black bg-blue-200 rounded-2xl">
        {nombrePostulante}
      </h1>
      <div className="mb-6">
        <label className="mt-10 block text-gray-700 text-lg font-bold mb-2">
          Comprobante de domicilio
        </label>
        <input
          className="shadow appearance-none border-2 rounded w-full py-18  px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="file"
        />  
      </div>

      <div className="mb-6">
        <label className="mt-10 block text-gray-700 text-lg font-bold mb-2">
          Constancia de situación fiscal
        </label>
        <input
          className="shadow appearance-none border-2 rounded w-full py-18 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="file"
        />
      </div>

      <div className="flex space-x-5 justify-center mt-10">
        <button
          type="button"
          className="w-32 text-white py-2 rounded-md  botones"
          onClick={showAlertDenegar}
        >
          Denegar
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
