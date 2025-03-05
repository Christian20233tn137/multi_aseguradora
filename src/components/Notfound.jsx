import React from "react";
import { useNavigate } from "react-router-dom";

const Notfound = () => {
  const navigate = useNavigate();

  const handleAceptar = () => {
    navigate("/");
  };

  return (
    <div
      className="relative w-full h-screen bg-no-repeat bg-right flex items-center justify-start"
      style={{
        backgroundImage: 'url("/public/image.png")',
        backgroundSize: "60% auto", // Ajustamos la imagen para que ocupe solo la mitad derecha
        backgroundPosition: "right", // Asegura que la imagen esté alineada a la derecha
      }}
    >
      <div className="w-full md:w-1/2 p-8 text-left">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">OOPS..</h1>
        <p className="text-xl md:text-2xl font-semibold mb-2">Página no encontrada</p>
        <p className="text-gray-600 mb-8">
          La página que buscas no existe o ocurrió algún otro error. Regresa a
          la página de inicio.
        </p>
        <button
          type="button"
          className="text-gray-900 hover:text-white border border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-800"
          onClick={handleAceptar}
        >
          Regresar
        </button>
      </div>

      <img
        src="/public/404.png"
        alt="404 Not Found"
        className="absolute top-0 right-0 w-full md:w-1/2 h-auto object-contain md:object-cover"
      />
    </div>
  );
};

export default Notfound;
