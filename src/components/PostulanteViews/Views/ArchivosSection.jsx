import React, { useState, useEffect } from "react";
import FileUploadIcon from "../assets/FileUpload.png";
import { MdCancel } from 'react-icons/md';
import Swal from 'sweetalert2';
import { AiOutlineDownload } from "react-icons/ai";
import axios from 'axios';

const ArchivosSection = () => {
  const [files, setFiles] = useState({
    domicilio: null,
    fiscal: null,
    identificacion: null,
    banco: null,
    afiliacion: null,
  });

  const [progress, setProgress] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  useEffect(() => {
    const fetchUploadedFiles = async () => {
      try {
        const userString = localStorage.getItem("user");
        if (!userString) return;

        const user = JSON.parse(userString);
        if (!user || !user._id) return;

        const endpoints = {
          domicilio: "comprobanteDomicilio",
          fiscal: "constanciaFiscal",
          identificacion: "identificacionOficial",
          banco: "caratulaBanco",
          afiliacion: "documentoAfiliacion",
        };

        const newLoadedFiles = {};
        const newDocumentIds = {};

        const requests = Object.entries(endpoints).map(async ([key, endpoint]) => {
          try {
            const response = await axios.get(
              `http://localhost:3001/nar/${endpoint}/documentosPostulante/${user._id}`
            );
            console.log(`Respuesta para ${key}:`, response.data);

            newLoadedFiles[key] = response.data.estado === 'aceptado';
            newDocumentIds[key] = response.data.idDocumento || null;

            return { key, success: true };
          } catch (error) {
            console.error(`Error al obtener documento ${key}:`, error);
            newLoadedFiles[key] = false;
            newDocumentIds[key] = null;
            return { key, success: false };
          }
        });

        await Promise.all(requests);

        setLoadedFiles(newLoadedFiles);
        setDocumentIds(newDocumentIds);

      } catch (error) {
        console.error("Error al obtener el estado de los archivos:", error);
      }
    };

    fetchUploadedFiles();
  }, []);

  const handleFileChange = (event, key) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      Swal.fire("Error", "Solo se permiten imágenes y archivos PDF.", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("Error", "El archivo no debe exceder los 5MB", "error");
      return;
    }

    if (documentIds[key]) {
      Swal.fire("Error", `Este archivo ya ha sido enviado.`, "error");
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
        setLoadedFiles((prevLoadedFiles) => ({
          ...prevLoadedFiles,
          [key]: true,
        }));
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
    if (!documentIds[key]) {
      setLoadedFiles((prevLoadedFiles) => ({
        ...prevLoadedFiles,
        [key]: false,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        Swal.fire("Error", "No se encontró la información del usuario", "error");
        return;
      }

      const user = JSON.parse(userString);
      if (!user || !user._id) {
        Swal.fire("Error", "No se encontró el ID del usuario", "error");
        return;
      }

      const hasFilesToUpload = Object.values(files).some(file => file !== null);
      if (!hasFilesToUpload) {
        Swal.fire("Error", "No hay archivos para enviar", "error");
        return;
      }

      const swalWithTailwindButtons = Swal.mixin({
        customClass: {
          confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
          cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
        },
        buttonsStyling: false
      });

      const result = await swalWithTailwindButtons.fire({
        title: '¿Estás seguro?',
        text: "¿Quieres enviar los archivos?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, enviar',
        cancelButtonText: 'No, cancelar',
        reverseButtons: true
      });

      if (!result.isConfirmed) {
        swalWithTailwindButtons.fire(
          'Cancelado',
          'Tus archivos están seguros :)',
          'info'
        );
        return;
      }

      setIsSubmitting(true);

      const endpoints = {
        domicilio: "comprobanteDomicilio",
        fiscal: "constanciaFiscal",
        identificacion: "identificacionOficial",
        banco: "caratulaBanco",
        afiliacion: "documentoAfiliacion",
      };

      const uploadPromises = Object.entries(files).map(async ([key, file]) => {
        if (!file) return null;

        const formData = new FormData();
        formData.append('archivo', file);
        formData.append("idUsuario", user._id);

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

          console.log(`Respuesta para ${key}:`, response.data);

          if (response.data && response.data.idDocumento) {
            setDocumentIds(prev => ({
              ...prev,
              [key]: response.data.idDocumento
            }));
          }

          return { key, success: true };
        } catch (error) {
          console.error(`Error al subir ${key}:`, error);
          return { key, success: false, error };
        }
      });

      const results = await Promise.all(uploadPromises);
      const allSucceeded = results.every(result => !result || result.success);

      if (allSucceeded) {
        await swalWithTailwindButtons.fire(
          "¡Enviado!",
          "Tus archivos han sido enviados correctamente.",
          "success"
        );

        const newFiles = {...files};
        results.forEach(result => {
          if (result && result.success) {
            newFiles[result.key] = null;
          }
        });

        setFiles(newFiles);
        setProgress({});
      } else {
        const failedFiles = results
          .filter(result => result && !result.success)
          .map(result => result.key)
          .join(", ");

        await swalWithTailwindButtons.fire(
          "Error",
          `Hubo problemas al subir los siguientes archivos: ${failedFiles}`,
          "error"
        );
      }

    } catch (error) {
      console.error("Error al enviar los archivos:", error);

      let errorMessage = "No se pudieron enviar los archivos";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = "No se pudo conectar con el servidor";
      }

      Swal.fire("Error", errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto relative">
      <div className="flex flex-col items-center p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6 text-center">
          {Object.entries(files).map(([key, file]) => (
            <div key={key} className="flex flex-col items-center">
              <label className="flex flex-col items-center cursor-pointer">
                <img src={FileUploadIcon} alt="Upload" className="w-20 h-20" />
                <span className="mt-2 text-sm text-gray-600">
                  {key === "domicilio" && "Comprobante de domicilio"}
                  {key === "fiscal" && "Constancia de situación fiscal"}
                  {key === "identificacion" && "Identificación oficial"}
                  {key === "banco" && "Carátula de banco"}
                  {key === "afiliacion" && "Documento de afiliación"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, key)}
                  accept="image/*,application/pdf"
                  disabled={isSubmitting || documentIds[key]}
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
                    <span className="text-xs text-gray-600 truncate max-w-xs">{file.name}</span>
                    <MdCancel
                      className="w-5 h-5 text-red-500 cursor-pointer ml-2"
                      onClick={() => !isSubmitting && handleRemoveFile(key)}
                    />
                  </div>
                </div>
              )}

              {loadedFiles[key] && (
                <div className="mt-2 text-green-500">
                  {documentIds[key] ? "Documento aceptado" : "Archivo listo para enviar"}
                </div>
              )}
            </div>
          ))}

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
        </form>

        <button
          type="submit"
          className={`mt-8 px-6 py-3 botones text-white rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Enviando...' : 'Enviar archivos'}
        </button>
      </div>
    </div>
  );
};

export default ArchivosSection;
