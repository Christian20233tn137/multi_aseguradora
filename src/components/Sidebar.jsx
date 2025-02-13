import React, { useState, useEffect } from "react";
import UsuarioProfile from "./AdminViews/assets/UsuarioProfile.png";
import MenuIcon from "./AdminViews/assets/Menu.png";
import EditIcon from "./AdminViews/assets/BotonEdit.png";

const Sidebar = ({ setActiveSection }) => {
  const [isOpen, setIsOpen] = useState(false); // Siempre cerrado al inicio

  useEffect(() => {
    // Limpieza del evento al desmontar el componente
    return () => {};
  }, []);

  return (
    <>
      {/* Botón de menú siempre accesible */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 m-4 rounded colorFondo text-white fixed top-auto left-2"
      >
        <img src={MenuIcon} alt="Menú" className="w-8 h-8" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 colorFondo text-white p-5 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50`}
      >
        {/* Contenido del Sidebar */}
        <div className="mt-11 p-10">
          <img
            className="object-cover w-20 h-20 mx-auto"
            src={UsuarioProfile}
            alt="Usuario"
          />
          <h2 className="mt-4 text-base font-bold text-center flex items-center justify-center gap-2">
            Editar perfil
            <img className="w-5 h-5" src={EditIcon} alt="" />
          </h2>
        </div>

        {/* Menú de navegación */}
        <ul>
          {[
            "Inicio",
            "Solicitudes",
            "Aseguradoras",
            "Agentes",
            "Administradores",
            "Configurar Cuotas",
          ].map((item) => (
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
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 bg-gradient-to-b from-grey-300 to-100% z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
