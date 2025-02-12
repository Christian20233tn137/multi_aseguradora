import React from "react";

const SolicitudSection = () => {
  let nombrePostulante = "Juan Perez";
  return (
    <div className=" p-6 w-auto h-auto overflow-hidden">
      <h1 className="text-3xl max-w-screen p-3 text-center font-normal text-black miColor rounded-2xl">
        {nombrePostulante}
      </h1>
      <div className="flex items-center gap-2 mt-5 justify-center">
        <div className="mt-10">
          <div className="flex items-center gap-2 mt-5 ">
            <label
              htmlFor="usuario"
              className="text-sm font-medium text-black w-48"
            >
              Correo Electrónico
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              className="py-2 px-4 font-medium border border-gray-300 flex-1"
              required
            />
          </div>

          <div className="flex items-center gap-2 mt-5">
            <label
              htmlFor="usuario"
              className="flex justify-start text-sm font-medium text-black w-48"
            >
              Telefono
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              className="py-2 px-4 font-medium border border-gray-300 flex-1"
              required
            />
          </div>

          <div className="flex items-center gap-2 mt-5">
            <label
              htmlFor="usuario"
              className="flex justify-start text-sm font-medium text-black w-48"
            >
              Domicilio
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              className="py-2 px-4 font-medium border border-gray-300 flex-1"
              required
            />
          </div>

          <div className="flex items-center gap-2 mt-5">
            <label
              htmlFor="usuario"
              className="flex justify-start text-sm font-medium text-black w-48"
            >
              RFC
            </label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              className="py-2 px-4 font-medium border border-gray-300 flex-1"
              required
            />
          </div>

          <div className="flex space-x-20 justify-center mt-20">
            <button
              type="submit"
              className="w-30 z-auto text-white py-3 rounded-md hover:bg-blue-700  justify-center botones"
            >
              Denegar
            </button>
            <button
              type="submit"
              className="w-30 text-white rounded-md hover:bg-blue-700  justify-center botones"
            >
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolicitudSection;
