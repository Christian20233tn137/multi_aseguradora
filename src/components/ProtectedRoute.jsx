// Este componente despues ayudara a aprotejer las rutas ahorita no le vayan a mover nadota
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();

  // Verificar tanto el token como el usuario
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Si no hay token o usuario, redirigir al login
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se especificaron roles permitidos, verificar si el usuario tiene el rol correcto
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
    // Redirigir según el rol del usuario
    if (user.rol === "administrador") {
      return <Navigate to="/inicio" replace />;
    } else if (user.rol === "agente") {
      return <Navigate to="/inicioAgentes" replace />;
    } else if (user.rol === "postulante") {
      return <Navigate to="/archivosPostulante" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
