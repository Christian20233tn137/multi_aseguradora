import React from "react";
import agentes from "./assets/image.png"; // Asegúrate de que la ruta sea correcta

const ImageSection = () => {
  return (
    <div className="relative w-full h-screen flex justify-center items-center overflow-hidden">
      <div className="absolute inset-0 flex justify-center items-center">
        <img
          src={agentes}
          alt="Agentes"
          className="object-cover " // Ajusta la imagen para cubrir el contenedor
        />
      </div>
      <div className="absolute opacity-75 w-64 h-64 -z-10 transform rotate-45"></div>
    </div>
  );
};

export default ImageSection;