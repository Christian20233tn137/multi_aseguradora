import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const EditarSeguro = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;
  console.log("ID del seguro a editar:", id);

  const editorRef = useRef(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cobertura, setCobertura] = useState("");
  const [icono, setIcono] = useState(null);
  const [tipo, setTipo] = useState("");
  const [precioBase, setPrecioBase] = useState("");

  useEffect(() => {
    const fetchSeguroData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/nar/seguros/id/${id}`);
        const seguroData = response.data;
        setNombre(seguroData.nombre);
        setDescripcion(seguroData.descripcion);
        setCobertura(seguroData.cobertura);
        setIcono(seguroData.icono);
        setTipo(seguroData.tipo);
        setPrecioBase(seguroData.precioBase);
      } catch (error) {
        console.error("Error al obtener los datos del seguro:", error);
        Swal.fire("Error", "No se pudo cargar la información del seguro.", "error");
      }
    };

    if (id) {
      fetchSeguroData();
    }
  }, [id]);

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setIcono(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const editarSeguro = async () => {
    const dataToSend = {
      nombre,
      descripcion,
      cobertura: cobertura.replace(/<\/?[^>]+(>|$)/g, ""), // Elimina etiquetas HTML
      icono,
      tipo,
      precioBase: Number(precioBase), // Asegúrate de que precioBase sea un número
    };

    try {
      const response = await axios.put(`http://localhost:3000/nar/seguros/id/${id}`, dataToSend);

      if (response.status === 200) {
        Swal.fire("Editado", "El seguro ha sido editado correctamente.", "success");
        navigate("/aseguradoras/ver-mas");
      } else {
        Swal.fire("Error", "Hubo un problema al editar el seguro.", "error");
      }
    } catch (error) {
      console.error("Error al editar el seguro:", error);
      Swal.fire("Error", "Ocurrió un error inesperado.", "error");
    }
  };

  const confirmarEditar = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres editar este seguro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        editarSeguro();
      }
    });
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-md">
      <h2 className="text-2xl font-bold text-gray-800">Editar Seguro</h2>

      {/* Campo del Nombre */}
      <div className="mb-4">
        <label className="block font-semibold">Nombre*</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border rounded p-2"
        />
      </div>

      {/* Campo de Descripción */}
      <div className="mb-4">
        <label className="block font-semibold">Descripción*</label>
        <textarea
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="w-full border rounded p-2"
          rows="3"
        />
      </div>

      {/* Campos de Tipo y Precio Base en una fila */}
      <div className="mb-4 flex space-x-4">
        <div className="w-1/2">
          <label className="block font-semibold">Tipo*</label>
          <input
            type="text"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Tipo de seguro"
          />
        </div>
        <div className="w-1/2">
          <label className="block font-semibold">Precio Base*</label>
          <input
            type="number"
            min="0"
            value={precioBase}
            onChange={(e) => setPrecioBase(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Precio base del seguro"
          />
        </div>
      </div>

      {/* Campo de Cobertura con Editor de Texto */}
      <div className="mb-4">
        <label className="block font-semibold">Cobertura*</label>
        <div className="border rounded p-2">
          {/* Barra de herramientas */}
          <div className="flex space-x-2 mb-2 pb-2">
            <button onClick={() => formatText("bold")} className="font-bold p-1">B</button>
            <button onClick={() => formatText("italic")} className="italic p-1">I</button>
            <button onClick={() => formatText("underline")} className="underline p-1">U</button>
            <button onClick={() => formatText("insertUnorderedList")} className="p-1">• List</button>
            <button onClick={() => formatText("justifyLeft")} className="p-1">⬅</button>
            <button onClick={() => formatText("justifyCenter")} className="p-1">⬆</button>
            <button onClick={() => formatText("justifyRight")} className="p-1">➡</button>
            <button onClick={() => formatText("foreColor", "red")} className="p-1 text-red-500">A</button>
          </div>

          {/* Área de edición */}
          <div
            ref={editorRef}
            contentEditable
            className="border p-2 min-h-[100px] focus:outline-none text-left"
            suppressContentEditableWarning={true}
            onInput={(e) => setCobertura(e.currentTarget.innerHTML)}
          >
            {cobertura}
          </div>
        </div>
      </div>

      {/* Botón Editar */}
      <div className="col-span-2 flex items-center justify-center mt-4">
        <button
          type="button"
          className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          style={{ backgroundColor: "#0B1956" }}
          onClick={confirmarEditar}
        >
          Editar
        </button>
      </div>
    </div>
  );
};

export default EditarSeguro;
