import React, { useState } from 'react'
import UsuarioProfile from '../AdminViews/assets/UsuarioProfile.png';
import MenuIcon from '../AdminViews/assets/Menu.png';
import EditIcon from '../AdminViews/assets/BotonEdit.png';
import { useNavigate } from 'react-router-dom';

const SideBarPostulante = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const manejarNavegacion = (ruta) => {
    navigate(ruta);
    setIsOpen(false); 
  };

  const handleLogout = () => {
    navigate("/login");
    console.log("Sesion cerrada");
    
  };

  const menuItems = [
    { nombre: "Carga de Archivos", ruta: "/archivosPostulante" },
  ];

  return (

    <>
          {/* Botón flotante para abrir menú */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 m-4 rounded colorFondo text-white fixed top-0 left-2 z-50"
          >
            <img src={MenuIcon} alt="Menú" className="w-8 h-8" />
          </button>
    
          {/* Sidebar */}
          <div
            className={`fixed top-0 left-0 h-full w-64 colorFondo text-white p-5 transform ${
              isOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 z-50`}
          >
            {/* Perfil */}
            <div className="mt-11 p-10">
              <img
                className="object-cover w-20 h-20 mx-auto"
                src={UsuarioProfile}
                alt="Usuario"
              />
              <h2 className="mt-4 text-base font-bold text-center flex items-center justify-center gap-2">
                Editar perfil
                <img className="w-5 h-5" src={EditIcon} alt="Editar" />
              </h2>
            </div>
    
            {/* Menú de navegación */}
            <ul>
              {menuItems.map(({ nombre, ruta }) => (
                <li key={nombre} className="mb-2">
                  <button
                    onClick={() => manejarNavegacion(ruta)}
                    className="w-full text-left hover:bg-blue-900 p-2 rounded transition"
                  >
                    {nombre}
                  </button>
                </li>
              ))}
            </ul>
    
            {/* Botón Cerrar sesión */}
            <div className="absolute bottom-5 left-5 right-5">
              <button
                onClick={handleLogout}
                className="w-full text-left hover:bg-red-800 p-2 rounded transition"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
    
          {/* Fondo oscuro al abrir el menú (para cerrar al hacer click fuera) */}
          {isOpen && (
            <div
              className="fixed inset-0 bg-trasnparent bg-opacity-50 z-40"
              onClick={() => setIsOpen(false)}
            ></div>
          )}
        </>
  )
}

export default SideBarPostulante
