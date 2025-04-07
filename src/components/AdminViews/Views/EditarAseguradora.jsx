import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = "http://localhost:3000/nar/aseguradoras/id";
const API_URL_EDIT = "http://localhost:3000/nar/aseguradoras";

const EditarAseguradora = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state?.id;
  const idaseguradora = location.state?.aseguradoraId;
  console.log("ID del admin:", id);
  console.log("ID de la aseguradora:", idaseguradora);
  const [aseguradora, setAseguradora] = useState({
    nombre: "",
    nombreContacto: "",
    telefonoContacto: "",
    correoContacto: "",
    informacion: "",
    seguros: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAseguradoraDetails = async () => {
      try {
        if (location.state && location.state.aseguradora) {
          setAseguradora(location.state.aseguradora);
        } else if (idaseguradora) {
          const response = await axios.get(`${API_URL}/${idaseguradora}`);
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
  }, [idaseguradora, location.state]);

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
      formData.append("nombreContacto", aseguradora.nombreContacto);
      formData.append("telefonoContacto", aseguradora.telefonoContacto);
      formData.append("correoContacto", aseguradora.correoContacto);
      formData.append("informacion", aseguradora.informacion);
      formData.append("seguros", aseguradora.seguros);

      const response = await axios.put(
        `${API_URL_EDIT}/${idaseguradora}`,
        formData
      );

      swalWithTailwindButtons.fire({
        title: response.status === 200 ? "¡Editado!" : "Error",
        text:
          response.status === 200
            ? "La aseguradora se editó con éxito."
            : "Error al editar",
        icon: response.status === 200 ? "success" : "error",
      });

      if (response.status === 200)
        navigate("/aseguradoras", { state: { id: id } });
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
          swalWithTailwindButtons.fire({
            title: "Realizando los cambios..",
            text: "Por favor espera.",
            icon: "info",
            showConfirmButton: false,
            allowOutsideClick: false,
          });
          handleEditSubmit();
        }
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAseguradora({ ...aseguradora, [name]: value });
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
              Nombre*
            </label>
            <input
              type="text"
              name="nombre"
              value={aseguradora.nombre}
              className="border-0 shadow-md rounded-lg py-2 px-3 w-full"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Nombre del contacto*
            </label>
            <input
              type="text"
              name="nombreContacto"
              value={aseguradora.nombreContacto}
              className="border-0 shadow-md rounded-lg py-2 px-3 w-full"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Teléfono del contacto*
            </label>
            <input
              type="text"
              name="telefonoContacto"
              value={aseguradora.telefonoContacto}
              className="border-0 shadow-md rounded-lg py-2 px-3 w-full"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Correo electrónico del contacto*
            </label>
            <input
              type="email"
              name="correoContacto"
              value={aseguradora.correoContacto}
              className="border-0 shadow-md rounded-lg py-2 px-3 w-full"
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Información*
            </label>
            <input
              type="text"
              name="informacion"
              value={aseguradora.informacion}
              className="border-0 shadow-md rounded-lg py-2 px-3 w-full"
              onChange={handleInputChange}
            ></input>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Seguros*
            </label>
            <select
              name="seguros"
              value={aseguradora.seguros}
              className="border-0 shadow-md rounded-lg py-2 px-3 w-full"
              onChange={handleInputChange}
            >
              <option value="">Selecciona un tipo de seguro</option>
              <option value="Seguro de vida">Seguro de vida</option>
              <option value="Seguro de gastos medicos">
                Seguro de gastos médicos
              </option>
              <option value="Seguro de viajes">Seguro de viajes</option>
            </select>
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <button
              type="button"
              className="botones text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              onClick={showEditAlert}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarAseguradora;
