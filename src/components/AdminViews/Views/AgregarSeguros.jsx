import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const AgregarSeguro = () => {
  const location = useLocation();
  const id = location.state?.id;
  const idAseguradora = location.state?.idAseguradora;
  console.log("ID de aseguradora:", idAseguradora);

  const navigate = useNavigate();
  const editorRef = useRef(null);
  const [nombre, setNombre] = useState("");
  const [cobertura, setCobertura] = useState("");
  const [icono, setIcono] = useState(null);
  const [tipo, setTipo] = useState("");
  const [precioBase, setPrecioBase] = useState("");

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
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

  const agregarSeguro = async () => {
    // Validación de campos requeridos
    if (!nombre || !cobertura || !tipo || !precioBase) {
      swalWithTailwindButtons.fire({
        title: "Error",
        text: "Por favor, complete todos los campos requeridos.",
        icon: "error",
      });
      return;
    }

    const dataToSend = {
      nombre,
      cobertura: cobertura,
      idAseguradora,
      tipo,
      precioBase: Number(precioBase), // Asegúrate de que precioBase sea un número
    };

    console.log("Datos a enviar:", dataToSend); // Depuración: verifica los datos

    try {
      const response = await axios.post(
        "http://localhost:3001/nar/seguros/",
        dataToSend
      );

      if (response.status !== 200) {
        throw new Error("Error al agregar el seguro");
      }

      swalWithTailwindButtons.fire({
        title: "¡Agregado!",
        text: "El seguro se agregó con éxito.",
        icon: "success",
      });

      // Navigate to "VerMasAseguradora" with the correct state
      navigate("/aseguradoras/seguros", { state: { idAseguradora, id: id } });
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
    swalWithTailwindButtons
      .fire({
        title: "¿Estás seguro?",
        text: "¿Quieres agregar este seguro?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, agregar",
        cancelButtonText: "Cancelar",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          swalWithTailwindButtons.fire({
            title: "Agregando...",
            text: "Por favor, espera.",
            icon: "info",
            allowOutsideClick: false,
            showConfirmButton: false,
          });
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

      {/* Campos de Tipo y Precio Base en una fila */}
      <div className="mb-4 flex space-x-4">
        <div className="w-1/2">
          <label className="block font-semibold">Tipo*</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">Selecciona un tipo</option>
            <option value="Seguro de vida">Seguro de vida</option>
            <option value="Seguro de gastos medicos">
              Seguro de gastos médicos
            </option>
            <option value="Seguro de viajes">Seguro de viajes</option>
          </select>
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
            <button
              onClick={() => formatText("bold")}
              className="font-bold p-1"
            >
              B
            </button>
            <button onClick={() => formatText("italic")} className="italic p-1">
              I
            </button>
            <button
              onClick={() => formatText("underline")}
              className="underline p-1"
            >
              U
            </button>
            <button onClick={() => formatText("justifyLeft")} className="p-1">
              ⬅
            </button>
            <button onClick={() => formatText("justifyCenter")} className="p-1">
              ⬆
            </button>
            <button onClick={() => formatText("justifyRight")} className="p-1">
              ➡
            </button>
            <button
              onClick={() => formatText("foreColor", "red")}
              className="p-1 text-red-500"
            >
              A
            </button>
            <button
              onClick={() => formatText("foreColor", "black")}
              className="p-1 text-black-500"
            >
              A
            </button>
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

      {/* Botones Agregar y Regresar */}
      <div className="col-span-2 flex items-center justify-center mt-4 space-x-4">
        <button
          type="button"
          className="text-white font-bold py-2 px-4 botones focus:outline-none focus:shadow-outline"
          onClick={confirmarAgregar}
        >
          Agregar
        </button>
        <button
          type="button"
          className="text-white font-bold py-2 px-4 botones focus:outline-none focus:shadow-outline"
          onClick={() => navigate(-1)} // Regresar a la página anterior
        >
          Regresar
        </button>
      </div>
    </div>
  );
};

export default AgregarSeguro;
