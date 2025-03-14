import React, { useState } from "react";
import FileUploadIcon from "../assets/FileUpload.png";

const ArchivosSection = () => {
  const [files, setFiles] = useState({
    domicilio: null,
    fiscal: null,
    identificacion: null,
    banco: null,
    afiliacion: null,
  });

  const handleFileChange = (event, key) => {
    const file = event.target.files[0];
    setFiles((prevFiles) => ({
      ...prevFiles,
      [key]: file,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(files);
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
    <div className="flex flex-col items-center p-6">
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-3 gap-6 text-center"
      >
        {/* Primera fila */}
        <label className="flex flex-col items-center cursor-pointer">
          <img src={FileUploadIcon} alt="Upload" className="w-20 h-20" />
          <span className="mt-2 text-sm text-gray-600">
            Comprobante de domicilio
          </span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleFileChange(e, "domicilio")}
          />
        </label>

        <label className="flex flex-col items-center cursor-pointer">
          <img src={FileUploadIcon} alt="Upload" className="w-20 h-20" />
          <span className="mt-2 text-sm text-gray-600">
            Constancia de situación fiscal
          </span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleFileChange(e, "fiscal")}
          />
        </label>

        <label className="flex flex-col items-center cursor-pointer">
          <img src={FileUploadIcon} alt="Upload" className="w-20 h-20" />
          <span className="mt-2 text-sm text-gray-600">
            Identificación oficial
          </span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleFileChange(e, "identificacion")}
          />
        </label>

        {/* Segunda fila */}
        <label className="flex flex-col items-center cursor-pointer">
          <img src={FileUploadIcon} alt="Upload" className="w-20 h-20" />
          <span className="mt-2 text-sm text-gray-600">Carátula de banco</span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleFileChange(e, "banco")}
          />
        </label>

        <label className="flex flex-col items-center cursor-pointer">
          <img src={FileUploadIcon} alt="Upload" className="w-20 h-20" />
          <span className="mt-2 text-sm text-gray-600">
            Documento de afiliación
          </span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => handleFileChange(e, "afiliacion")}
          />
        </label>

        <div className="flex flex-col items-center justify-center">
          <div className="text-sm text-gray-700 text-center">
            <p>Descarga, llena y firma este formato</p>
            <button className="mt-2 px-4 py-2 botones text-white rounded">
              Descargar
            </button>
          </div>
        </div>
      </form>
      <button className="mt-8 px-6 py-3 botones text-white rounded">
        Enviar archivos
      </button>
    </div>
    </div>
  );
};

export default ArchivosSection;
