import React from "react";

const Section = () => {
  return (
    <section className="flex flex-col justify-center items-center p-5 lg:p-10">
      <div className="w-full max-w-[400px] text-center">
        <h1 className="text-2xl lg:text-4xl font-bold text-blue-950">
          BUSCAMOS AGENTES
        </h1>
        <p className="mt-2 lg:mt-3 text-black text-sm lg:text-base">
          ¡Impulsa tu éxito con Nar! Únete como agente y disfruta de ingresos
          atractivos, libertad laboral y el respaldo de una multi aseguradora
          líder. ¡Postúlate hoy y transforma tu futuro!
        </p>
        <button className="mt-4 lg:mt-6 text-white px-6 py-2 botones w-full">
          Postularme
        </button>
      </div>
    </section>
  );
};

export default Section;
