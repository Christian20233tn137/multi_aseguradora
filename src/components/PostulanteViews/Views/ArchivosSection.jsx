import React, { useState } from "react";
import FileUploadIcon from "../assets/FileUpload.png";
import { MdCancel } from 'react-icons/md'; // Importa un ícono de cancelar
import Swal from 'sweetalert2'; // Importa SweetAlert2
import { AiOutlineDownload } from "react-icons/ai";

const ArchivosSection = () => {
  const [files, setFiles] = useState({
    domicilio: null,
    fiscal: null,
    identificacion: null,
    banco: null,
    afiliacion: null,
  });

  const [progress, setProgress] = useState({}); // Para manejar la barra de carga

  const handleFileChange = (event, key) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validar que el archivo sea una imagen o PDF
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      alert('Solo se permiten imágenes y archivos PDF.');
      return;
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
      if (fakeProgress >= 100) clearInterval(interval);
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

  const handleSubmit = (event) => {
    event.preventDefault();

    const swalWithTailwindButtons = Swal.mixin({
      customClass: {
        confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
        cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
      },
      buttonsStyling: false
    });

    swalWithTailwindButtons.fire({
      title: '¿Estás seguro?',
      text: "¿Estás seguro de enviar los archivos?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithTailwindButtons.fire(
          'Enviado!',
          'Tus archivos han sido enviados.',
          'success'
        ).then(() => {
          // Recargar la página para limpiar los archivos
          window.location.reload();
        });

        // Aquí puedes agregar la lógica para enviar los archivos usando axios
        // Ejemplo comentado:
        /*
        const formData = new FormData();
        Object.entries(files).forEach(([key, file]) => {
          if (file) formData.append(key, file);
        });

        axios.post('URL_DEL_BACKEND', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          console.log('Archivos enviados exitosamente');
        }).catch(error => {
          console.error('Error al enviar los archivos:', error);
        });
        */
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithTailwindButtons.fire(
          'Cancelado',
          'Tus archivos están seguros :)',
          'error'
        )
      }
    });
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div className="flex flex-col items-center p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-6 text-center">
          {Object.entries(files).map(([key, file], index) => (
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
                  accept="image/*,application/pdf" // Solo acepta imágenes y PDFs
                />
              </label>

              {/* Barra de progreso y botón de eliminar */}
              {file && (
                <div className="mt-2 w-full flex flex-col items-center">
                  <div className="w-40 bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${progress[key]}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-600">{file.name}</span>
                    <MdCancel
                      className="w-5 h-5 text-red-500 cursor-pointer ml-2"
                      onClick={() => handleRemoveFile(key)}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="mt-2 w-full flex flex-col items-center">
            {/* Botón de descargar plantilla en blanco */}
            <a
              href="afiliacion.pdf" // Cambia esto a la ruta correcta de tu archivo PDF
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
          className="mt-8 px-6 py-3 botones text-white rounded"
          onClick={handleSubmit}
        >
          Enviar archivos
        </button>
      </div>
    </div>
  );
};

export default ArchivosSection;
