import React, { useState, useEffect } from "react";
import FileUploadIcon from "../assets/FileUpload.png";
import { MdCancel } from "react-icons/md";
import Swal from "sweetalert2";
import { AiOutlineDownload } from "react-icons/ai";
import axios from "axios";

const ArchivosSection = () => {
  const [files, setFiles] = useState({
    domicilio: null,
    fiscal: null,
    identificacion: null,
    banco: null,
    afiliacion: null,
  });

  const [progress, setProgress] = useState({});
  const [isSubmitting, setIsSubmitting] = useState({});
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

  // Nombres descriptivos para mostrar en UI
  const documentNames = {
    domicilio: "Comprobante de domicilio",
    fiscal: "Constancia de situación fiscal",
    identificacion: "Identificación oficial",
    banco: "Carátula de banco",
    afiliacion: "Documento de afiliación",
  };

  // Mapeo de endpoints
  const endpoints = {
    domicilio: "comprobanteDomicilio",
    fiscal: "constanciaFiscal",
    identificacion: "identificacionOficial",
    banco: "caratulaBanco",
    afiliacion: "documentoAfiliacion",
  };

  // Mapeo de estados a colores y mensajes
  const statusConfig = {
    aceptado: { color: "text-green-500", bgColor: "bg-green-100", message: "ACEPTADO", icon: "✓" },
    rechazado: { color: "text-red-500", bgColor: "bg-red-100", message: "RECHAZADO", icon: "✗" },
    pendiente: { color: "text-yellow-500", bgColor: "bg-yellow-100", message: "EN REVISIÓN", icon: "⋯" },
    default: { color: "text-gray-500", bgColor: "bg-gray-100", message: "SIN INFORMACIÓN", icon: "?" },
  };

  // Función para obtener el usuario actual
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

  // Función para cargar un documento específico
  const fetchDocumentStatus = async (key, userId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/nar/${endpoints[key]}/documentosPostulante/${userId}`
      );
      
      console.log(`Respuesta para ${key}:`, response.data);
      
      if (response.data && response.data.idDocumento) {
        return {
          loaded: true,
          id: response.data.idDocumento,
          status: response.data.estado || "pendiente"
        };
      }
      
      return { loaded: false, id: null, status: null };
    } catch (error) {
      console.error(`Error al obtener documento ${key}:`, error);
      return { loaded: false, id: null, status: null, error };
    }
  };

  // Función principal para cargar todos los documentos
  const fetchAllDocuments = async () => {
    const user = getCurrentUser();
    if (!user) {
      console.log("No hay usuario autenticado");
      return;
    }

    try {
      const newLoadedFiles = {...loadedFiles};
      const newDocumentIds = {...documentIds};
      const newDocumentStatuses = {...documentStatuses};
      
      // Array para almacenar documentos rechazados
      const rejectedDocs = [];
      
      // Cargar cada documento de forma secuencial
      for (const [key] of Object.entries(endpoints)) {
        const result = await fetchDocumentStatus(key, user._id);
        
        newLoadedFiles[key] = result.loaded;
        newDocumentIds[key] = result.id;
        newDocumentStatuses[key] = result.status;
        
        if (result.status === "rechazado") {
          rejectedDocs.push(key);
        }
      }
      
      // Actualizar estados
      setLoadedFiles(newLoadedFiles);
      setDocumentIds(newDocumentIds);
      setDocumentStatuses(newDocumentStatuses);
      
      // Mostrar notificaciones sobre documentos rechazados
      if (rejectedDocs.length > 0) {
        const rejectedNames = rejectedDocs.map(key => documentNames[key]).join(", ");
        setTimeout(() => {
          Swal.fire({
            title: "Documentos rechazados",
            html: `Los siguientes documentos han sido <span class="text-red-500 font-bold">rechazados</span>:<br><br>${rejectedNames}<br><br>Por favor, vuelve a subirlos.`,
            icon: "warning",
            confirmButtonText: "Entendido"
          });
        }, 1000);
      }
      
      // Mostrar resumen de estado de documentos
      const pending = Object.values(newDocumentStatuses).filter(status => status === "pendiente").length;
      const accepted = Object.values(newDocumentStatuses).filter(status => status === "aceptado").length;
      const rejected = Object.values(newDocumentStatuses).filter(status => status === "rechazado").length;
      
      if (pending > 0 || accepted > 0 || rejected > 0) {
        setTimeout(() => {
          Swal.fire({
            title: "Estado de tus documentos",
            html: `
              <div class="text-left">
                <p><span class="text-green-500 font-bold">${accepted}</span> documentos aceptados</p>
                <p><span class="text-yellow-500 font-bold">${pending}</span> documentos en revisión</p>
                <p><span class="text-red-500 font-bold">${rejected}</span> documentos rechazados</p>
              </div>
            `,
            icon: "info",
            confirmButtonText: "Entendido"
          });
        }, 500);
      }
      
      return { newLoadedFiles, newDocumentIds, newDocumentStatuses };
    } catch (error) {
      console.error("Error al obtener documentos:", error);
      Swal.fire("Error", "Hubo un problema al cargar tus documentos", "error");
    }
  };

  // Inicialización y carga de documentos al montar el componente
  useEffect(() => {
    fetchAllDocuments();
    
    // Agregar un event listener para detectar cuando el usuario inicia sesión
    const handleStorageChange = () => {
      console.log("Cambio detectado en localStorage");
      fetchAllDocuments();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Verificar periódicamente si hay cambios en el usuario
    const checkUserInterval = setInterval(() => {
      const userString = localStorage.getItem("user");
      if (userString) {
        fetchAllDocuments();
      }
    }, 5000); // Verificar cada 5 segundos
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(checkUserInterval);
    };
  }, []);

  const handleFileChange = (event, key) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/") && file.type !== "application/pdf") {
      Swal.fire("Error", "Solo se permiten imágenes y archivos PDF.", "error");
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
        <div className={`${config.bgColor} ${config.color} py-1 px-3 rounded-full inline-flex items-center justify-center font-bold`}>
          <span className="mr-1">{config.icon}</span>
          {config.message}
        </div>
        {status === "rechazado" && (
          <div className="block text-xs text-red-500 mt-1 font-semibold">
            Este documento fue rechazado.<br/>Por favor, súbelo nuevamente.
          </div>
        )}
      </div>
    );
  };

  // Nueva función para subir un archivo individual
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

      // Verificaciones de estado del documento
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
      });

      if (!result.isConfirmed) {
        return;
      }

      // Establecer estado de subida para este documento específico
      setIsSubmitting(prev => ({
        ...prev,
        [key]: true
      }));

      const formData = new FormData();
      formData.append("archivo", file);
      formData.append("idUsuario", user._id);

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

      console.log(`Respuesta para ${key}:`, response.data);

      if (response.data && response.data.idDocumento) {
        setDocumentIds((prev) => ({
          ...prev,
          [key]: response.data.idDocumento,
        }));
        setLoadedFiles((prev) => ({
          ...prev,
          [key]: true,
        }));
        setDocumentStatuses((prev) => ({
          ...prev,
          [key]: "pendiente",
        }));

        // Limpiar el archivo subido
        setFiles(prev => ({
          ...prev,
          [key]: null
        }));
        
        await swalWithTailwindButtons.fire(
          "¡Enviado!",
          `El documento "${documentNames[key]}" ha sido enviado correctamente y está en revisión.`,
          "success"
        );
      }

    } catch (error) {
      console.error(`Error al subir ${key}:`, error);
      
      let errorMessage = "No se pudo enviar el archivo";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = "No se pudo conectar con el servidor";
      }

      Swal.fire("Error", errorMessage, "error");
    } finally {
      // Restablecer estado de subida para este documento
      setIsSubmitting(prev => ({
        ...prev,
        [key]: false
      }));
      
      // Actualizar estados después de la subida
      fetchAllDocuments();
    }
  };

  // Botón para actualizar manualmente el estado de los documentos
  const handleRefreshDocuments = () => {
    Swal.fire({
      title: "Actualizando...",
      text: "Obteniendo estado actual de tus documentos",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        fetchAllDocuments().then(() => {
          Swal.close();
        });
      }
    });
  };

  const isDocumentUploadable = (key) => {
    // Un documento es subible si:
    // 1. No está cargado
    // 2. O está rechazado
    return !loadedFiles[key] || documentStatuses[key] === "rechazado";
  };

  // Nueva función para determinar si se debe deshabilitar el botón de subida
  const isUploadButtonDisabled = (key) => {
    // Deshabilitar si:
    // 1. Está subiendo actualmente
    // 2. Ya está pendiente de revisión
    // 3. Ya está aceptado
    // 4. No hay archivo seleccionado para subir
    return (
      isSubmitting[key] || 
      documentStatuses[key] === "pendiente" || 
      documentStatuses[key] === "aceptado" ||
      !files[key]
    );
  };

  // Función para obtener el texto del botón según estado
  const getButtonText = (key) => {
    if (isSubmitting[key]) return "Enviando...";
    if (documentStatuses[key] === "pendiente") return "En revisión";
    if (documentStatuses[key] === "aceptado") return "Documento aceptado";
    return "Subir este documento";
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto relative">
      <div className="flex flex-col items-center p-6">
        <div className="flex justify-between w-full mb-4">
          <h2 className="text-xl font-bold">Mis Documentos</h2>
          <button 
            onClick={handleRefreshDocuments}
            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Actualizar estado
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-6 text-center">
          {Object.entries(files).map(([key, file]) => {
            const isUploadable = isDocumentUploadable(key);
            const isAccepted = documentStatuses[key] === "aceptado";
            const isRejected = documentStatuses[key] === "rechazado";
            const isPending = documentStatuses[key] === "pendiente";
            const isUploading = isSubmitting[key];
            const buttonDisabled = isUploadButtonDisabled(key);
            
            return (
              <div key={key} className="relative">
                {isAccepted && (
                  <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl">
                    ✓
                  </div>
                )}
                
                {isRejected && (
                  <div className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl">
                    ✗
                  </div>
                )}
                
                <label className={`flex flex-col items-center ${isUploadable ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                  <img 
                    src={FileUploadIcon} 
                    alt="Upload" 
                    className={`w-20 h-20 ${!isUploadable && 'opacity-50'}`} 
                  />
                  <span className="mt-2 text-sm text-gray-600 font-semibold">
                    {documentNames[key]}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, key)}
                    accept="image/*,application/pdf"
                    disabled={isUploading || !isUploadable}
                  />
                </label>

                {file && (
                  <div className="mt-2 w-full flex flex-col items-center">
                    <div className="w-40 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${progress[key]}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-600 truncate max-w-xs">
                        {file.name}
                      </span>
                      <MdCancel
                        className="w-5 h-5 text-red-500 cursor-pointer ml-2"
                        onClick={() => !isUploading && handleRemoveFile(key)}
                      />
                    </div>
                    
                    {/* Botón individual de subida con estado dinámico */}
                    <button
                      onClick={() => handleUploadSingleFile(key)}
                      disabled={buttonDisabled}
                      className={`mt-3 px-4 py-2 botones text-white rounded-full text-sm ${
                        buttonDisabled ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {getButtonText(key)}
                    </button>
                  </div>
                )}

                {/* Status display section - always visible */}
                {loadedFiles[key] && !file && (
                  <div className="mt-2 flex flex-col items-center w-full">
                    {getDocumentStatusDisplay(key)}
                    
                    {isRejected && (
                      <div className="mt-3 px-4 py-2 bg-red-100 border border-red-300 rounded-lg text-sm text-red-800 w-full">
                        <strong>Documento rechazado</strong>
                        <p className="text-xs mt-1">Debes subir este documento nuevamente.</p>
                      </div>
                    )}
                    
                    {isAccepted && (
                      <div className="mt-3 px-4 py-2 bg-green-100 border border-green-300 rounded-lg text-sm text-green-800 w-full">
                        <strong>Documento aceptado</strong>
                        <p className="text-xs mt-1">Este documento ha sido verificado y aprobado.</p>
                      </div>
                    )}
                    
                    {documentStatuses[key] === "pendiente" && (
                      <div className="mt-3 px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-lg text-sm text-yellow-800 w-full">
                        <strong>En revisión</strong>
                        <p className="text-xs mt-1">Tu documento está siendo evaluado.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          <div className="mt-2 w-full flex flex-col items-center">
            <a
              href="afiliacion.pdf"
              download="afiliacion.pdf"
              className="mt-8 px-6 py-3 flex items-center gap-2 botones text-white rounded"
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