import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const EditarSeguro = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const id = location.state?.id;
  const idSeguro = location.state?.idSeguro; 
  const idAseguradora = location.state?.idAseguradora; // ID de la aseguradora
  console.log("ID de aseguradora:", idAseguradora); // Verifica que el ID de la aseguradora esté disponible
  console.log("ID del administrador:", id);
  console.log("ID del seguro:", idSeguro);

  const editorRef = useRef(null);
  const [nombre, setNombre] = useState("");
  const [cobertura, setCobertura] = useState("");
  const [icono, setIcono] = useState(null);
  const [tipo, setTipo] = useState("");
  const [precioBase, setPrecioBase] = useState("");

  const swalWithTailwindButtons = Swal.mixin({
    customClass: {
      confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
      cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
    },
    buttonsStyling: false
  });

  useEffect(() => {
    const fetchSeguroData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/nar/seguros/id/${idSeguro}`);
        const seguroData = response.data;
        console.log("Datos del seguro obtenidos:", seguroData);

        setNombre(seguroData.nombre);
        setCobertura(seguroData.cobertura);
        setIcono(seguroData.icono);
        setTipo(seguroData.tipo);
        setPrecioBase(seguroData.precioBase);
      } catch (error) {
        console.error("Error al obtener los datos del seguro:", error);
        swalWithTailwindButtons.fire("Error", "No se pudo cargar la información del seguro.", "error");
      }
    };

    if (idSeguro) {
      fetchSeguroData();
    } else {
      console.error("ID del seguro no proporcionado");
    }
  }, [idSeguro]);

  const formatText = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  
  const editarSeguro = async () => {
    // Validación de campos requeridos
    if (!nombre || !cobertura || !tipo || !precioBase || !idAseguradora) {
        swalWithTailwindButtons.fire("Error", "Por favor, complete todos los campos requeridos.", "error");
        return;
    }

    const dataToSend = {
        nombre,
        cobertura: cobertura.replace(/<\/?[^>]+(>|$)/g, ""), // Elimina etiquetas HTML
        icono,
        tipo,
        precioBase: Number(precioBase), // Asegúrate de que precioBase sea un número
        idAseguradora // Incluir el ID de la aseguradora
    };

    console.log("Datos a enviar en la edición:", dataToSend);

    // Mostrar alerta de cargando
    swalWithTailwindButtons.fire({
        title: 'Cargando',
        text: 'Por favor, espere...',
        icon: 'info',
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
            swalWithTailwindButtons.showLoading();
        }
    });

    try {
        const response = await axios.put(`http://localhost:3000/nar/seguros/id/${idSeguro}`, dataToSend);

        if (response.status === 200) {
            swalWithTailwindButtons.fire("Editado", "El seguro ha sido editado correctamente.", "success");
            navigate("/aseguradoras/seguros", { state: { idAseguradora, id:id } }); // Pasar el estado con idAseguradora
        } else {
            swalWithTailwindButtons.fire("Error", "Hubo un problema al editar el seguro.", "error");
        }
    } catch (error) {
        console.error("Error al editar el seguro:", error);
        if (error.response) {
            console.error("Respuesta del servidor:", error.response.data);
        }
        swalWithTailwindButtons.fire("Error", "Ocurrió un error inesperado.", "error");
    } finally {
        // Cerrar la alerta de cargando
        swalWithTailwindButtons.close();
    }
};


  const confirmarEditar = () => {
    swalWithTailwindButtons.fire({
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

  useEffect(() => {
    if (editorRef.current && cobertura !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = cobertura;
    }
  }, [cobertura]);

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
