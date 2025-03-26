import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "http://localhost:3000/nar/aseguradoras/id";

const EditarAseguradora = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [aseguradora, setAseguradora] = useState({
    nombre: "",
    contactoNombre: "",
    contactoTelefono: "",
    contactoEmail: "",
    logo: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAseguradoraDetails = async () => {
      try {
        if (location.state && location.state.aseguradora) {
          setAseguradora(location.state.aseguradora);
        } else if (id) {
          const response = await axios.get(`${API_URL}/${id}`);
          setAseguradora(response.data);
        } else {
          throw new Error("ID de aseguradora no definido");
        }
      } catch (error) {
        console.error("Error al obtener detalles de la aseguradora:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudieron obtener los detalles de la aseguradora.",
          icon: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAseguradoraDetails();
  }, [id, location.state]);

  const handleBack = () => {
    navigate("/aseguradoras");
  };

  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton:
        "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
      cancelButton:
        "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2",
    },
    buttonsStyling: false,
  });

  const handleEditSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("nombre", aseguradora.nombre);
      formData.append("contactoNombre", aseguradora.contactoNombre);
      formData.append("contactoTelefono", aseguradora.contactoTelefono);
      formData.append("contactoEmail", aseguradora.contactoEmail);
      if (aseguradora.logo) {
        formData.append("logo", aseguradora.logo);
      }

      const response = await axios.put(`${API_URL}/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      swalWithTailwindButtons.fire({
        title: response.status === 200 ? "¡Editado!" : "Error",
        text:
          response.status === 200
            ? "La aseguradora se editó con éxito."
            : "Error al editar",
        icon: response.status === 200 ? "success" : "error",
      });

      if (response.status === 200) navigate("/aseguradoras");
    } catch (error) {
      console.error("Error al editar:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo editar la aseguradora.",
        icon: "error",
      });
    }
  };

  const showEditAlert = () => {
    swalWithTailwindButtons
      .fire({
        title: "¿Deseas guardar los cambios?",
        text: "Se actualizará la aseguradora.",
        icon: "warning",
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Sí, guardar cambios",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          handleEditSubmit();
        }
      });
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setAseguradora({ ...aseguradora, logo: files[0] });
    } else {
      setAseguradora({ ...aseguradora, [name]: value });
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex items-center justify-center w-auto h-auto p-6">
      <div className="bg-white p-8 rounded w-full max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Editar Aseguradora
        </h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Logo*
            </label>
            <input
              type="file"
              name="logo"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nombre del contacto*
            </label>
            <input
              type="text"
              name="contactoNombre"
              value={aseguradora.contactoNombre}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nombre*
            </label>
            <input
              type="text"
              name="nombre"
              value={aseguradora.nombre}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Teléfono del contacto*
            </label>
            <input
              type="text"
              name="contactoTelefono"
              value={aseguradora.contactoTelefono}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Correo electrónico del contacto*
            </label>
            <input
              type="email"
              name="contactoEmail"
              value={aseguradora.contactoEmail}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              onChange={handleInputChange}
            />
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <button
              type="button"
              className="botones text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={showEditAlert}
            >
              Editar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarAseguradora;
