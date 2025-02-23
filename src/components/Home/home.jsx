import React, { useEffect } from "react";
import Navbar from "./NavBarHome";
import Section from "./Section";
import ImageSection from "./ImageSection";

const Home = () => {
  // Deshabilitar el scroll al montar el componente
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "visible"; // Restaurar el scroll al desmontar
    };
  }, []);

  return (
    <div className="font-sans">
      <Navbar />
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <Section />
        <ImageSection />
      </div>
    </div>
  );
};

export default Home;