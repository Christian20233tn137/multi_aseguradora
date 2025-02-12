import React, { useState, useEffect } from "react";
import UsuarioProfile from "./AdminViews/assets/UsuarioProfile.png";
import MenuIcon from "./AdminViews/assets/Menu.png"; // Icono de menú

const Sidebar = ({ setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024); // Abierto en pantallas grandes

  // Manejo de cambio de tamaño para corregir visibilidad en responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true); // Siempre abierto en pantallas grandes
      } else {
        setIsOpen(false); // Cerrar en pantallas pequeñas
      }
    };
  
    window.addEventListener('resize', handleResize);
  
    // Limpieza del evento al desmontar el componente
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Botón de menú siempre accesible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 m-4 rounded colorFondo text-white fixed top-0 left-4 z-50"
      >
        <img src={MenuIcon} alt="Menú" className="w-8 h-8" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 colorFondo text-white p-5 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:relative lg:w-64 lg:translate-x-0`}
      >
        {/* Contenido del Sidebar */}
        <div className="mt-11 p-10">
          <img className="object-cover w-20 h-20 mx-auto" src={UsuarioProfile} alt="Usuario" />
          <h2 className="mt-4 text-xl font-bold text-center">Editar perfil</h2>
        </div>

        {/* Menú de navegación */}
        <ul>
          {["Inicio", "Solicitudes", "Aseguradoras", "Agentes", "Cuotas"].map((item) => (
            <li key={item} className="mb-2">
              <button
                onClick={() => setActiveSection(item)}
                className="w-full text-left hover:bg-blue-900 p-2 rounded transition"
              >
                {item}
              </button>
            </li>
          ))}
        </ul>

        {/* Cerrar sesión */}
        <div className="absolute bottom-5 left-5 right-5">
          <button className="w-full text-left hover:bg-red-700 p-2 rounded transition">
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Fondo oscuro cuando el sidebar está abierto en móviles */}
      {isOpen && window.innerWidth < 1024 && (
        <div
          className="fixed inset-0 bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
