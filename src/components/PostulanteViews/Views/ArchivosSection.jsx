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

  useEffect(() => {
    const fetchUploadedFiles = async () => {
      try {
        const userString = localStorage.getItem("user");
        if (!userString) {
          return;
        }

        const user = JSON.parse(userString);
        if (!user || !user._id) {
          return;
        }

        const response = await axios.get(
          `http://localhost:3000/nar/documentosPersona/documentosPostulante/${user._id}`
        );

        // Asumiendo que el backend devuelve un objeto con el estado de cada documento
        const uploadedFilesData = response.data;

        // Mapea el estado de los documentos a los campos específicos
        const uploadedFilesState = {
          domicilio: uploadedFilesData.domicilio === 'aceptado',
          fiscal: uploadedFilesData.fiscal === 'aceptado',
          identificacion: uploadedFilesData.identificacion === 'aceptado',
          banco: uploadedFilesData.banco === 'aceptado',
          afiliacion: uploadedFilesData.afiliacion === 'aceptado',
        };

        setLoadedFiles(uploadedFilesState);
      } catch (error) {
        console.error("Error al obtener el estado de los archivos:", error);
      }
    };

    fetchUploadedFiles();
  }, []);

  const handleFileChange = (event, key) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar que el archivo sea una imagen o PDF
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      Swal.fire("Error", "Solo se permiten imágenes y archivos PDF.", "error");
      return;
    }

    // Validar tamaño del archivo (ejemplo: máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Swal.fire("Error", "El archivo no debe exceder los 5MB", "error");
      return;
    }

    // Validar que los archivos se carguen en orden
    const keys = Object.keys(files);
    const currentIndex = keys.indexOf(key);
    for (let i = 0; i < currentIndex; i++) {
      if (!loadedFiles[keys[i]]) {
        Swal.fire("Error", `Debes cargar primero el archivo de ${keys[i]}`, "error");
        return;
      }
    }

    setFiles((prevFiles) => ({
      ...prevFiles,
      [key]: file,
    }));

    // Simulamos la carga con un pequeño delay
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
        // Marcar el archivo como cargado
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
    setLoadedFiles((prevLoadedFiles) => ({
      ...prevLoadedFiles,
      [key]: false,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Obtener usuario del localStorage
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

      // Verificar que todos los archivos estén cargados
      const allFilesLoaded = Object.values(loadedFiles).every(isLoaded => isLoaded);
      if (!allFilesLoaded) {
        Swal.fire("Error", "Debes cargar todos los archivos en orden antes de enviar", "error");
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

      const formData = new FormData();

      // Agregar cada archivo con su nombre de campo correspondiente
      Object.entries(files).forEach(([key, file]) => {
        if (file) formData.append('archivo', file); // Asegúrate de que el nombre coincida con el backend
      });

      // Agregar solo el ID del usuario
      formData.append("idUsuario", user._id);

      const response = await axios.post(
        "http://localhost:3000/nar/documentosPersona/subirDocumento",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            // Actualizar el progreso real
            setProgress((prevProgress) => {
              const updatedProgress = { ...prevProgress };
              Object.keys(files).forEach((key) => {
                if (files[key]) {
                  updatedProgress[key] = percentCompleted;
                }
              });
              return updatedProgress;
            });
          },
        }
      );

      console.log("Respuesta del backend:", response.data);

      await swalWithTailwindButtons.fire(
        "¡Enviado!",
        "Tus archivos han sido enviados correctamente.",
        "success"
      );

      // Limpiar el formulario después del envío exitoso
      setFiles({
        domicilio: null,
        fiscal: null,
        identificacion: null,
        banco: null,
        afiliacion: null,
      });
      setProgress({});
      setLoadedFiles({
        domicilio: false,
        fiscal: false,
        identificacion: false,
        banco: false,
        afiliacion: false,
      });

    } catch (error) {
      console.error("Error al enviar los archivos:", error);

      let errorMessage = "No se pudieron enviar los archivos";
      if (error.response) {
        // Error del servidor
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // Error de conexión
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
                  disabled={isSubmitting}
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
                  Archivo cargado
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

        {isSubmitting && (
          <div className="absolute inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50">
            <div className="loader border-8 border-t-8 border-gray-200 border-t-blue-500 rounded-full w-16 h-16 animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArchivosSection;
