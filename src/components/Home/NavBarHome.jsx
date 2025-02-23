// src/components/Navbar.jsx
import React from "react";
import Logo from "./assets/logo-nar-variante.png";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const navigate = useNavigate();
  
    const handleAceptar = () => {
      navigate("/login");
    };
  
  return (
    <nav className="text-white flex justify-between items-center p-4 colorFondo">
      <div className="ml-4">
        <img src={Logo} alt="Nar Multi Aseguradora" className="h-16" />
      </div>
      <button className="bg-white text-blue-900 px-4 py-2 rounded mr-4 botonLogin" onClick={handleAceptar}>
        Iniciar Sesión
      </button>
    </nav>
  );
};

export default Navbar;