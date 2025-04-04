import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const AgregarSeguro = () => {
  const location = useLocation();
  const idAseguradora = location.state?.idAseguradora; // Obtener el ID de la aseguradora desde el estado de navegación
  console.log("ID de aseguradora:", idAseguradora);

  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cobertura, setCobertura] = useState("");
  const [icono, setIcono] = useState(null);
  const [tipo, setTipo] = useState("");
  const [precioBase, setPrecioBase] = useState("");

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

  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
      cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
    },
    buttonsStyling: false
  });

  const agregarSeguro = async () => {
    // Validación de campos requeridos
    if (!nombre || !descripcion || !cobertura || !tipo || !precioBase) {
      swalWithTailwindButtons.fire({
        title: "Error",
        text: "Por favor, complete todos los campos requeridos.",
        icon: "error",
      });
      return;
    }

    const dataToSend = {
      nombre,
      descripcion,
      cobertura: cobertura.replace(/<\/?[^>]+(>|$)/g, ""), // Elimina etiquetas HTML
      icono,
      idAseguradora,
      tipo,
      precioBase: Number(precioBase), // Asegúrate de que precioBase sea un número
    };

    console.log("Datos a enviar:", dataToSend); // Depuración: verifica los datos

    try {
      const response = await axios.post("http://localhost:3000/nar/seguros/", dataToSend);

      if (response.status !== 200) {
        throw new Error("Error al agregar el seguro");
      }

      swalWithTailwindButtons.fire({
        title: "¡Agregado!",
        text: "El seguro se agregó con éxito.",
        icon: "success",
      });

      // Navigate to "VerMasAseguradora" with the correct state
      navigate("/aseguradoras/seguros", { state: { idAseguradora } });
    } catch (error) {
      console.error("Error al agregar el seguro:", error);
      swalWithTailwindButtons.fire({
        title: "Error",
        text: error.message || "Ocurrió un error al agregar el seguro",
        icon: "error",
      });
    }
  };

  const confirmarAgregar = () => {
    swalWithTailwindButtons.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres agregar este seguro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, agregar",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        agregarSeguro();
      }
    });
  };

  useEffect(() => {
    if (editorRef.current && cobertura !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = cobertura;
    }
  }, [cobertura]);

  return (
    <div className="container mx-auto p-6 bg-white rounded-md">
      <h2 className="text-2xl font-bold text-gray-800">Agregar Seguro</h2>

      {/* Campo del Nombre */}
      <div className="mb-4">
        <label className="block font-semibold">Nombre*</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full border rounded p-2"
          placeholder="Nombre del seguro"
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
          placeholder="Descripción del seguro"
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
          />
        </div>
      </div>

      {/* Botón Agregar */}
      <div className="col-span-2 flex items-center justify-center mt-4">
        <button
          type="button"
          className="text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          style={{ backgroundColor: "#0B1956" }}
          onClick={confirmarAgregar}
        >
          Agregar
        </button>
      </div>
    </div>
  );
};

export default AgregarSeguro;
