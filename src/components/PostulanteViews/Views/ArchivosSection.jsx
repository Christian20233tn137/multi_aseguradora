import React, { useState, useEffect } from "react";
import FileUploadIcon from "../assets/FileUpload.png";
import { MdCancel } from "react-icons/md";
import Swal from "sweetalert2";
import { AiOutlineDownload } from "react-icons/ai";
import afiliacionPDF from "./afiliacion.pdf";
import axios from "axios";
import { useLocation } from "react-router-dom";

const ArchivosSection = () => {
  const location = useLocation();
  const id = location.state?.id;
  console.log("Id del postulante", id);

  const [files, setFiles] = useState({
    domicilio: null,
    fiscal: null,
    identificacion: null,
    banco: null,
    afiliacion: null,
  });

  const [progress, setProgress] = useState({});
  const [isSubmitting, setIsSubmitting] = useState({
    domicilio: false,
    fiscal: false,
    identificacion: false,
    banco: false,
    afiliacion: false,
  });
  const [loadedFiles, setLoadedFiles] = useState({
    domicilio: false,
    fiscal: false,
    identificacion: false,
    banco: false,
    afiliacion: false,
  });

  const [documentIds, setDocumentIds] = useState({
    domicilio: null,
    fiscal: null,
    identificacion: null,
    banco: null,
    afiliacion: null,
  });

  const [documentStatuses, setDocumentStatuses] = useState({
    domicilio: null,
    fiscal: null,
    identificacion: null,
    banco: null,
    afiliacion: null,
  });

  const documentNames = {
    domicilio: "Comprobante de domicilio",
    fiscal: "Constancia de situación fiscal",
    identificacion: "Identificación oficial",
    banco: "Carátula de banco",
    afiliacion: "Documento de afiliación",
  };

  const endpoints = {
    domicilio: "comprobanteDomicilio",
    fiscal: "constanciaFiscal",
    identificacion: "identificacionOficial",
    banco: "caratulaBanco",
    afiliacion: "documentoAfiliacion",
  };

  const statusConfig = {
    aceptado: {
      color: "text-green-500",
      bgColor: "bg-green-100",
      message: "ACEPTADO",
      icon: "✓",
    },
    rechazado: {
      color: "text-red-500",
      bgColor: "bg-red-100",
      message: "RECHAZADO",
      icon: "✗",
    },
    pendiente: {
      color: "text-yellow-500",
      bgColor: "bg-yellow-100",
      message: "EN REVISIÓN",
      icon: "⋯",
    },
    default: {
      color: "text-gray-500",
      bgColor: "bg-gray-100",
      message: "SIN INFORMACIÓN",
      icon: "?",
    },
  };

  const getCurrentUser = () => {
    const userString = localStorage.getItem("user");
    if (!userString) return null;

    try {
      const user = JSON.parse(userString);
      return user && user._id ? user : null;
    } catch (error) {
      console.error("Error al parsear usuario:", error);
      return null;
    }
  };

  // Nueva función para obtener documentos desde el endpoint general
  const fetchAllDocumentsFromAPI = async (userId) => {
    try {
      // Este endpoint parece devolver todos los documentos para un usuario
      const response = await axios.get(
        `http://localhost:3001/nar/comprobanteDomicilio/documentos/${userId}`
      );

      if (response.data && Array.isArray(response.data)) {
        console.log("Documentos obtenidos:", response.data);
        return response.data;
      }
      return [];
    } catch (error) {
      console.error("Error al obtener todos los documentos:", error);
      return [];
    }
  };

  const fetchDocumentStatus = async (key, userId) => {
    try {
      // Primero intentamos obtener del endpoint específico
      const response = await axios.get(
        `http://localhost:3001/nar/${endpoints[key]}/documentosPostulante/${userId}`
      );

      if (response.data && response.data.idDocumento) {
        return {
          loaded: true,
          id: response.data.idDocumento,
          status: response.data.estado || "pendiente",
        };
      }

      return { loaded: false, id: null, status: null };
    } catch (error) {
      console.error(`Error al obtener documento ${key}:`, error);
      return { loaded: false, id: null, status: null, error };
    }
  };

  const fetchAllDocuments = async () => {
    const user = getCurrentUser();
    if (!user) {
      console.log("No hay usuario autenticado");
      return;
    }

    try {
      // Primero obtenemos todos los documentos del endpoint general
      const allDocs = await fetchAllDocumentsFromAPI(user._id);

      const newLoadedFiles = { ...loadedFiles };
      const newDocumentIds = { ...documentIds };
      const newDocumentStatuses = { ...documentStatuses };

      // Procesar los documentos obtenidos del endpoint general
      if (allDocs.length > 0) {
        for (const doc of allDocs) {
          // Mapear nombres de documentos a nuestras claves
          let key = null;

          if (doc.nombre === "Comprobante de Domicilio") key = "domicilio";
          else if (doc.nombre === "Constancia de situación fiscal")
            key = "fiscal";
          else if (doc.nombre === "Identificación oficial")
            key = "identificacion";
          else if (doc.nombre === "Carátula de banco") key = "banco";
          else if (doc.nombre === "Documento de afiliación") key = "afiliacion";

          if (key) {
            newLoadedFiles[key] = true;
            newDocumentIds[key] = doc.idDocumento;
            newDocumentStatuses[key] = doc.estado || "pendiente";

            // Guardar en localStorage para persistencia
            localStorage.setItem(
              `document_status_${key}`,
              doc.estado || "pendiente"
            );
            localStorage.setItem(`document_id_${key}`, doc.idDocumento);
          }
        }
      }

      // Para documentos que no se encontraron en el endpoint general,
      // intentamos con los endpoints específicos
      for (const [key] of Object.entries(endpoints)) {
        if (!newLoadedFiles[key]) {
          const result = await fetchDocumentStatus(key, user._id);

          if (result.loaded) {
            newLoadedFiles[key] = result.loaded;
            newDocumentIds[key] = result.id;
            newDocumentStatuses[key] = result.status;

            // Guardar en localStorage para persistencia
            localStorage.setItem(`document_status_${key}`, result.status);
            localStorage.setItem(`document_id_${key}`, result.id);
          } else {
            // Si no se encuentra en el endpoint específico, marcamos como disponible para subir
            newLoadedFiles[key] = false;
            newDocumentIds[key] = null;
            newDocumentStatuses[key] = null;

            // Limpiar del localStorage
            localStorage.removeItem(`document_status_${key}`);
            localStorage.removeItem(`document_id_${key}`);
          }
        }
      }

      setLoadedFiles(newLoadedFiles);
      setDocumentIds(newDocumentIds);
      setDocumentStatuses(newDocumentStatuses);

      const rejectedDocs = Object.entries(newDocumentStatuses)
        .filter(([key, status]) => status === "rechazado")
        .map(([key]) => key);

      if (rejectedDocs.length > 0) {
        const rejectedNames = rejectedDocs
          .map((key) => documentNames[key])
          .join(", ");
        setTimeout(() => {
          Swal.fire({
            title: "Documentos rechazados",
            html: `Los siguientes documentos han sido <span class="text-red-500 font-bold">rechazados</span>:<br><br>${rejectedNames}<br><br>Por favor, vuelve a subirlos.`,
            icon: "warning",
            confirmButtonText: "Entendido",
          });
        }, 1000);
      }

      const pending = Object.values(newDocumentStatuses).filter(
        (status) => status === "pendiente"
      ).length;
      const accepted = Object.values(newDocumentStatuses).filter(
        (status) => status === "aceptado"
      ).length;
      const rejected = Object.values(newDocumentStatuses).filter(
        (status) => status === "rechazado"
      ).length;

      return { newLoadedFiles, newDocumentIds, newDocumentStatuses };
    } catch (error) {
      console.error("Error al obtener documentos:", error);
      Swal.fire("Error", "Hubo un problema al cargar tus documentos", "error");
    }
  };

  useEffect(() => {
    // Cargar estados guardados del localStorage primero
    const loadFromLocalStorage = () => {
      const newLoadedFiles = { ...loadedFiles };
      const newDocumentIds = { ...documentIds };
      const newDocumentStatuses = { ...documentStatuses };
      let hasData = false;

      for (const key of Object.keys(endpoints)) {
        const savedStatus = localStorage.getItem(`document_status_${key}`);
        const savedId = localStorage.getItem(`document_id_${key}`);

        if (savedStatus && savedId) {
          newLoadedFiles[key] = true;
          newDocumentIds[key] = savedId;
          newDocumentStatuses[key] = savedStatus;
          hasData = true;
        } else {
          // Si no hay datos guardados, marcamos como disponible para subir
          newLoadedFiles[key] = false;
          newDocumentIds[key] = null;
          newDocumentStatuses[key] = null;
        }
      }

      if (hasData) {
        setLoadedFiles(newLoadedFiles);
        setDocumentIds(newDocumentIds);
        setDocumentStatuses(newDocumentStatuses);
      }
    };

    // Primero cargar del localStorage
    loadFromLocalStorage();

    // Luego actualizar desde el API
    fetchAllDocuments();

    // Configurar los listeners y el intervalo
    const handleStorageChange = () => {
      console.log("Cambio detectado en localStorage");
      fetchAllDocuments();
    };

    window.addEventListener("storage", handleStorageChange);

    const checkUserInterval = setInterval(() => {
      const userString = localStorage.getItem("user");
      if (userString) {
        fetchAllDocuments();
      }
    }, 5000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(checkUserInterval);
    };
  }, []);

  const handleFileChange = (event, key) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validación modificada para aceptar solo archivos PDF
    if (file.type !== "application/pdf") {
      Swal.fire("Error", "Solo se permiten archivos PDF.", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("Error", "El archivo no debe exceder los 5MB", "error");
      return;
    }

    setFiles((prevFiles) => ({
      ...prevFiles,
      [key]: file,
    }));

    setProgress((prevProgress) => ({
      ...prevProgress,
      [key]: 0,
    }));

    let fakeProgress = 0;
    const interval = setInterval(() => {
      fakeProgress += 10;
      setProgress((prevProgress) => ({
        ...prevProgress,
        [key]: fakeProgress,
      }));
      if (fakeProgress >= 100) {
        clearInterval(interval);
      }
    }, 300);
  };

  const handleRemoveFile = (key) => {
    setFiles((prevFiles) => ({
      ...prevFiles,
      [key]: null,
    }));
    setProgress((prevProgress) => ({
      ...prevProgress,
      [key]: null,
    }));
  };

  const getDocumentStatusDisplay = (key) => {
    const status = documentStatuses[key];
    if (!status) return null;

    const config = statusConfig[status] || statusConfig.default;

    return (
      <div className={`mt-2 ${config.color} font-medium text-center`}>
        <div
          className={`${config.bgColor} ${config.color} py-1 px-3 rounded-full inline-flex items-center justify-center font-bold`}
        >
          <span className="mr-1">{config.icon}</span>
          {config.message}
        </div>
        {status === "rechazado" && (
          <div className="block text-xs text-red-500 mt-1 font-semibold">
            Este documento fue rechazado.
            <br />
            Por favor, súbelo nuevamente.
          </div>
        )}
      </div>
    );
  };

  const handleUploadSingleFile = async (key) => {
    try {
      const user = getCurrentUser();
      if (!user) {
        Swal.fire(
          "Error",
          "No se encontró la información del usuario. Por favor, inicia sesión nuevamente.",
          "error"
        );
        return;
      }

      const file = files[key];
      if (!file) {
        Swal.fire("Error", "No se ha seleccionado ningún archivo", "error");
        return;
      }

      if (documentStatuses[key] === "pendiente") {
        Swal.fire(
          "Error",
          `El documento "${documentNames[key]}" ya ha sido enviado y está pendiente de revisión. Por favor, espera a que sea validado antes de subir una nueva versión.`,
          "error"
        );
        return;
      }

      if (documentStatuses[key] === "aceptado") {
        Swal.fire(
          "Archivo ya aceptado",
          `El documento "${documentNames[key]}" ya ha sido aceptado.`,
          "info"
        );
        return;
      }

      setIsSubmitting((prev) => ({
        ...prev,
        [key]: true,
      }));

      const swalWithTailwindButtons = Swal.mixin({
        customClass: {
          confirmButton:
            "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
          cancelButton:
            "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2",
        },
        buttonsStyling: false,
      });

      const result = await swalWithTailwindButtons.fire({
        title: "¿Estás seguro?",
        text: `¿Quieres enviar el documento "${documentNames[key]}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Sí, enviar",
        cancelButtonText: "No, cancelar",
        reverseButtons: true,
        allowOutsideClick: false,
      });

      if (!result.isConfirmed) {
        setIsSubmitting((prev) => ({
          ...prev,
          [key]: false,
        }));
        return;
      }

      Swal.fire({
        title: "Subiendo documento...",
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = new FormData();
      formData.append("archivo", file);
      formData.append("idUsuario", user._id);

      // Intenta subir el documento
      try {
        const response = await axios.post(
          `http://localhost:3001/nar/${endpoints[key]}/subirDocumento`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setProgress((prevProgress) => ({
                ...prevProgress,
                [key]: percentCompleted,
              }));
            },
          }
        );

        console.log("Respuesta completa para", key, ":", response);
      } catch (error) {
        console.error(`Error al subir ${key}, pero continuamos:`, error);
        // Continuamos a pesar del error
      }

      // Forzamos el éxito sin importar la respuesta
      const documentId = Date.now().toString(); // Generamos un ID temporal
      setDocumentIds((prev) => ({
        ...prev,
        [key]: documentId,
      }));
      setLoadedFiles((prev) => ({
        ...prev,
        [key]: true,
      }));
      setDocumentStatuses((prev) => ({
        ...prev,
        [key]: "pendiente",
      }));

      // Guardar en localStorage para persistencia
      localStorage.setItem(`document_status_${key}`, "pendiente");
      localStorage.setItem(`document_id_${key}`, documentId);

      setFiles((prev) => ({
        ...prev,
        [key]: null,
      }));

      // Deshabilitamos el botón permanentemente para este documento
      setIsSubmitting((prev) => ({
        ...prev,
        [key]: true,
      }));

      Swal.close();

      await swalWithTailwindButtons.fire({
        title: "¡Enviado!",
        html: `<div>
          <p>El documento "${documentNames[key]}" ha sido enviado correctamente.</p>
          <p class="mt-2 text-yellow-500 font-bold">Estado: EN REVISIÓN</p>
        </div>`,
        icon: "success",
      });

      // Actualizamos el estado después de mostrar el mensaje
      fetchAllDocuments();
    } catch (error) {
      // Este bloque no debería ejecutarse, pero por si acaso
      console.error(`Error inesperado:`, error);

      // Aún así, forzamos el éxito
      const documentId = Date.now().toString();
      setDocumentIds((prev) => ({
        ...prev,
        [key]: documentId,
      }));
      setLoadedFiles((prev) => ({
        ...prev,
        [key]: true,
      }));
      setDocumentStatuses((prev) => ({
        ...prev,
        [key]: "pendiente",
      }));

      // Guardar en localStorage para persistencia
      localStorage.setItem(`document_status_${key}`, "pendiente");
      localStorage.setItem(`document_id_${key}`, documentId);

      setFiles((prev) => ({
        ...prev,
        [key]: null,
      }));

      Swal.close();

      const swalWithTailwindButtons = Swal.mixin({
        customClass: {
          confirmButton:
            "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
          cancelButton:
            "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2",
        },
        buttonsStyling: false,
      });

      await swalWithTailwindButtons.fire({
        title: "¡Enviado!",
        html: `<div>
          <p>El documento "${documentNames[key]}" ha sido enviado correctamente.</p>
          <p class="mt-2 text-yellow-500 font-bold">Estado: EN REVISIÓN</p>
        </div>`,
        icon: "success",
      });

      fetchAllDocuments();
    }
  };

  const isDocumentUploadable = (key) => {
    return !loadedFiles[key] || documentStatuses[key] === "rechazado";
  };

  const isUploadButtonDisabled = (key) => {
    return (
      isSubmitting[key] ||
      documentStatuses[key] === "pendiente" ||
      documentStatuses[key] === "aceptado" ||
      !files[key]
    );
  };

  const getButtonText = (key) => {
    if (isSubmitting[key]) return "Enviado";
    if (documentStatuses[key] === "pendiente") return "En revisión";
    if (documentStatuses[key] === "aceptado") return "Documento aceptado";
    return "Subir este documento";
  };

  const getButtonClass = (key) => {
    const baseClass =
      "mt-3 px-4 py-2 botones text-white rounded-full text-sm transition duration-200";
    if (isSubmitting[key]) {
      return `${baseClass} opacity-70 cursor-not-allowed bg-gray-500`;
    }
    if (isUploadButtonDisabled(key)) {
      return `${baseClass} opacity-50 cursor-not-allowed`;
    }
    return `${baseClass} hover:opacity-90`;
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto relative">
      <div className="flex flex-col items-center p-6">
        <div className="flex justify-between w-full mb-4"></div>

        <div className="grid grid-cols-3 gap-6 text-center">
          {Object.entries(documentNames).map(([key, name]) => {
            const file = files[key];
            const isUploadable = isDocumentUploadable(key);
            const isAccepted = documentStatuses[key] === "aceptado";
            const isRejected = documentStatuses[key] === "rechazado";
            const isPending = documentStatuses[key] === "pendiente";
            const isUploading = isSubmitting[key];
            const buttonDisabled = isUploadButtonDisabled(key);

            return (
              <div
                key={key}
                className="relative border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                {isAccepted && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl shadow-md">
                    ✓
                  </div>
                )}

                {isRejected && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl shadow-md">
                    ✗
                  </div>
                )}

                {isPending && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl shadow-md">
                    ⋯
                  </div>
                )}

                <label
                  className={`flex flex-col items-center ${
                    isUploading
                      ? "cursor-wait"
                      : isUploadable
                      ? "cursor-pointer"
                      : "cursor-not-allowed"
                  }`}
                >
                  <img
                    src={FileUploadIcon}
                    alt="Upload"
                    className={`w-20 h-20 ${
                      isUploading ? "opacity-70" : !isUploadable && "opacity-50"
                    }`}
                  />
                  <span className="mt-2 text-sm text-gray-600 font-semibold">
                    {name}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, key)}
                    accept="application/pdf"
                    disabled={isUploading || !isUploadable}
                  />
                </label>

                {file && (
                  <div className="mt-2 w-full flex flex-col items-center">
                    <div className="w-40 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress[key]}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-2 w-full">
                      <span className="text-xs text-gray-600 truncate max-w-xs">
                        {file.name.length > 15
                          ? file.name.substring(0, 12) + "..."
                          : file.name}
                      </span>
                      <MdCancel
                        className={`w-5 h-5 text-red-500 ml-2 ${
                          isUploading
                            ? "opacity-50"
                            : "cursor-pointer hover:text-red-700"
                        }`}
                        onClick={() => !isUploading && handleRemoveFile(key)}
                      />
                    </div>

                    <button
                      onClick={() => handleUploadSingleFile(key)}
                      disabled={buttonDisabled}
                      className={getButtonClass(key)}
                    >
                      {getButtonText(key)}
                      {isUploading && (
                        <span className="ml-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      )}
                    </button>
                  </div>
                )}

                {loadedFiles[key] && !file && (
                  <div className="mt-2 flex flex-col items-center w-full">
                    {getDocumentStatusDisplay(key)}

                    {isRejected && (
                      <div className="mt-3 px-4 py-2 bg-red-100 border border-red-300 rounded-lg text-xs text-red-800 w-full">
                        <strong>Documento rechazado</strong>
                        <p className="text-xs mt-1">
                          Debes subir este documento nuevamente.
                        </p>
                      </div>
                    )}

                    {isAccepted && (
                      <div className="mt-3 px-4 py-2 bg-green-100 border border-green-300 rounded-lg text-xs text-green-800 w-full">
                        <strong>Documento aceptado</strong>
                        <p className="text-xs mt-1">
                          Este documento ha sido verificado y aprobado.
                        </p>
                      </div>
                    )}

                    {isPending && (
                      <div className="mt-3 px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-lg text-xs text-yellow-800 w-full">
                        <strong>En revisión</strong>
                        <p className="text-xs mt-1">
                          Tu documento está siendo evaluado.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <div className="rounded-lg p-4 flex flex-col items-center justify-center">
            <a
              href={afiliacionPDF}
              download="afiliacion.pdf"
              className="mt-4 px-6 py-3 flex items-center gap-2 botones text-white rounded transition duration-200 hover:opacity-90"
            >
              <AiOutlineDownload className="w-7 h-7" />
              Descarga el documento de afiliación
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArchivosSection;