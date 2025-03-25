import React, { useRef, useState } from "react";
import Swal from "sweetalert2";

const AgregarSeguro = () => {
  const editorRef = useRef(null);
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [cobertura, setCobertura] = useState("");
  const [icono, setIcono] = useState(null);

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

  const agregarSeguro = async () => {
    try {
      // Aquí irá tu endpoint real
      const response = await fetch("/api/seguros", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          descripcion,
          cobertura,
          icono,
        }),
      });

      if (response.ok) {
        Swal.fire("Agregado", "El seguro ha sido agregado correctamente.", "success");
      } else {
        Swal.fire("Error", "Hubo un problema al agregar el seguro.", "error");
      }
    } catch (error) {
      console.error("Error al agregar el seguro:", error);
      Swal.fire("Error", "Ocurrió un error inesperado.", "error");
    }
  };

  const confirmarAgregar = () => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres agregar este seguro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, agregar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        agregarSeguro();
      }
    });
  };

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
            style={{ direction: "ltr", unicodeBidi: "plaintext" }}
            onInput={(e) => setCobertura(e.currentTarget.innerHTML)}
          >
            {cobertura}
          </div>
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
