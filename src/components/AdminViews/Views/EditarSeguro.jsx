import React, { useRef, useState } from "react";
import Swal from "sweetalert2";

const EditarSeguro = () => {
  const editorRef = useRef(null);
  const [nombre, setNombre] = useState("Seguro de vida");
  const [descripcion, setDescripcion] = useState(
    "Un seguro de vida es un contrato entre una persona y una aseguradora..."
  );
  const [cobertura, setCobertura] = useState("Escribe aquí...");
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

  const confirmarAgregar = () => {
    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
        cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
      },
      buttonsStyling: false
    });
  
    swalWithTailwindButtons.fire({
      title: "¿Estás seguro?",
      text: "¿Quieres agregar este seguro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, agregar",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Comenta esta parte para probar los botones sin necesidad de un backend activo
          /*
          const response = await axios.post("http://localhost:3000/api/seguros", {
            // Aquí irían los datos del seguro que deseas agregar
          });
  
          if (response.status === 200) {
            swalWithTailwindButtons.fire("Agregado", "El seguro ha sido agregado correctamente.", "success");
          } else {
            swalWithTailwindButtons.fire("Error", "Hubo un problema al agregar el seguro.", "error");
          }
          */
  
          // Para probar sin backend, descomenta la siguiente línea:
          swalWithTailwindButtons.fire("Agregado", "El seguro ha sido agregado correctamente.", "success");
  
        } catch (error) {
          console.error("Error al agregar el seguro:", error);
          swalWithTailwindButtons.fire("Error", "Ocurrió un error inesperado.", "error");
        }
      }
    });
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-md">
      <h2 className="text-2xl font-bold text-gray-800">Editar</h2>

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
            onInput={(e) => setCobertura(e.currentTarget.innerText)}
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
          Editar
        </button>
      </div>
    </div>
  );
};

export default EditarSeguro;














