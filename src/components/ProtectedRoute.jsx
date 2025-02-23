// Este componente despues ayudara a aprotejer las rutas ahorita no le vayan a mover nadota
import React from 'react';

const ProtectedRoute = ({ children }) => {
  // Permitir acceso sin verificación de autenticación o roles
  return children;
};

export default ProtectedRoute;
