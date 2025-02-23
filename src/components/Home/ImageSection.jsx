import React from "react";
import agentes from "./assets/image.png"; // Asegúrate de colocar la imagen en public o src/assets

const ImageSection = () => {
  return (
    <div className="relative w-full lg:w-1/2 flex justify-center items-center h-screen">
      {" "}
      <img
        src={agentes}
        alt="Agentes"
        className="absolute bottom-0 right-0 h-200 w-xl" 
      />
      <div className="absolute opacity-75 w-64 h-64 -z-10 transform rotate-45"></div>
    </div>
  );
};

export default ImageSection;
