import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const SolicitudDocumentos = () => {
  const navigate = useNavigate();
  const location = useLocation();
    console.log("Prueba", id);
    
  const { profile } = location.state || {};
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (profile && profile._id && /^[0-9a-fA-F]{24}$/.test(profile._id)) {
        try {
          console.log("Fetching documents for profile ID:", profile._id);
          const response = await axios.get(`http://localhost:3000/nar/documentosPersona/files/persona/${profile._id}`);
          console.log("Fetched documents:", response.data);
          const transformedDocuments = transformDocuments(response.data);
          setDocuments(transformedDocuments);
        } catch (error) {
          setError("Error fetching documents. Please try again later.");
          console.error("Error fetching documents:", error);
        } finally {
          setLoading(false);
        }
      } else {
        console.error("Invalid profile ID:", profile._id);
        setError("Invalid profile ID format.");
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [profile]);

  const transformDocuments = (data) => {
    return data.map(doc => ({
      id: doc.idDocumento,  // Ahora usa el ID correcto de GridFS
      name: doc.nombreDocumento,
      file: doc.idDocumento,  // Esto debe ser el mismo ID que en GridFS
      type: 'unknown' // Si no guardaste la extensión, lo manejas aparte
    }));
  };

  const handleBack = () => {
    navigate("/solicitudes");
  };

  const showAlert = async (action) => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
        cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
      },
      buttonsStyling: false
    });

    swalWithTailwindButtons.fire({
      title: `¿Estás seguro de ${action} al postulante?`,
      text: "No podrás revertir esto!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Si, ${action}!`,
      cancelButtonText: "No, cancelar!",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put(`http://localhost:3000/nar/usuarios/postulanteAgente/${profile._id}`);
          swalWithTailwindButtons.fire({
            title: `${action.charAt(0).toUpperCase() + action.slice(1)}!`,
            text: `El postulante fue ${action}.`,
            icon: "success",
          });
          handleBack();
        } catch (error) {
          setError("Error updating postulante. Please try again later.");
          console.error("Error updating postulante:", error);
          swalWithTailwindButtons.fire({
            title: "Error",
            text: "Hubo un problema al aceptar al postulante.",
            icon: "error",
          });
        }
      }
    });
  };

  const nombrePostulante = `${profile.nombre} ${profile.apellidoPaterno} ${profile.apellidoMaterno}`;

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 w-auto h-auto overflow-hidden">
      <h1 className="text-3xl max-w-screen p-3 text-center font-normal text-black bg-blue-200 rounded-2xl">
        {nombrePostulante}
      </h1>
      {documents.map((doc) => (
        <div key={doc.id} className="mb-6">
          <label className="mt-10 block text-gray-700 text-lg font-bold mb-2">
            {doc.name}
          </label>
          <iframe
            src={`http://localhost:3000/nar/documentosPersona/files/${doc.id}`}
            width="100%"
            height="500px"
            title={doc.name}
          ></iframe>
        </div>
      ))}
      <div className="flex space-x-5 justify-center mt-10">
        <button
          type="button"
          className="w-32 text-white py-2 rounded-md botones"
          onClick={() => showAlert("denegar")}
        >
          Denegar
        </button>
        <button
          type="button"
          className="w-30 text-white py-2 px-4 rounded-md botones"
          onClick={() => navigate(-1)}
        >
          Regresar
        </button>
        <button
          type="button"
          className="w-32 text-white py-2 rounded-md botones"
          onClick={() => showAlert("aceptar")}
        >
          Aceptar
        </button>
      </div>
    </div>
  );
};

export default SolicitudDocumentos;
