import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UsuarioProfile from "../AdminViews/assets/UsuarioProfile.png";
import MenuIcon from "../AdminViews/assets/Menu.png";
import EditIcon from "../AdminViews/assets/BotonEdit.png";
import Swal from "sweetalert2";

const SideBarAgente = () => {
  const location = useLocation();
  const id = location.state?.id || null;
  console.log(id);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const manejarNavegacion = (ruta) => {
    navigate(ruta, { state: { id } });
    setIsOpen(false);
  };

  const handleLogout = () => {
    Swal.fire({
      title: "¿Estás seguro de que quieres cerrar sesión?",
      text: "No podrás volver a acceder a tu cuenta sin iniciar sesión nuevamente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, cerrar sesión",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Eliminar datos de autenticación
        localStorage.removeItem("id");
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        // Redirigir al login
        navigate("/login");
      }
    });
  };

  const handleEditProfile = () => {
    if (id) {
      navigate("/inicioAgentes/editarPerfil", {
        state: { id },
      });
    } else {
      console.error("ID is missing");
    }
  };

  const menuItems = [
    { nombre: "Inicio", ruta: "/inicioAgentes" },
    { nombre: "Cotizar", ruta: "/inicioAgentes/cotizar" },
    { nombre: "Cotizaciones", ruta: `/inicioAgentes/cotizaciones` },
    { nombre: "Estadisticas", ruta: "/inicioAgentes/estadisticas" },
    { nombre: "Clientes", ruta: `/inicioAgentes/clientes` }
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
        <div className="mt-11 p-10 rounded-lg transition-transform transform hover:scale-105">
          <img
            className="object-cover w-20 h-20 mx-auto rounded-full transition-transform transform hover:scale-110"
            src={UsuarioProfile}
            alt="Usuario"
          />
          <h2
            className="mt-4 text-base font-bold text-center flex items-center justify-center gap-2 cursor-pointer hover:text-blue-400 transition-colors"
            onClick={handleEditProfile}
          >
            Editar perfil
            <img
              className="w-5 h-5 transition-transform transform hover:rotate-45"
              src={EditIcon}
              alt="Editar"
            />
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
          className="fixed inset-0 bg-transparent bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default SideBarAgente;
