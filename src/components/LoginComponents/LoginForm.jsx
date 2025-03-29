import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ setUser }) => {
  const navigate = useNavigate();

  const handlePassword = () => {
    navigate("/recuperacion");
  };

  // Estados para los campos
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errorCorreo, setErrorCorreo] = useState(false); // Error para correo
  const [errorContrasena, setErrorContrasena] = useState(false); // Error para contraseña
  const [errorBackend, setErrorBackend] = useState(""); // Error desde el backend

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasError = false;

    // Validar correo
    if (!correo) {
      setErrorCorreo(true);
      hasError = true;
    } else {
      setErrorCorreo(false);
    }

    // Validar contraseña
    if (!contrasena) {
      setErrorContrasena(true);
      hasError = true;
    } else {
      setErrorContrasena(false);
    }

    // Si hay errores en los campos, no continuar
    if (hasError) return;

    try {
      // Enviar solicitud al backend
      const response = await axios.post(
        "http://localhost:3000/nar/usuarios/login",
        {
          correo,
          contrasena,
        }
      );

      const { success, data, message } = response.data;

      if (success) {
        // Guardar el token y la información del usuario en localStorage
        localStorage.setItem("token", data.token); // Asumiendo que el backend devuelve un token
        localStorage.setItem("user", JSON.stringify(data._doc));

        setUser(data); // Establecer usuario en el estado global

        // Redirigir según el rol
        if (data._doc.rol === "administrador") {
          navigate("/inicio");
        } else if (data._doc.rol === "agente") {
          navigate("/inicioAgentes");
        } else if (data._doc.rol === "postulante") {
          navigate("/archivosPostulante");
        }
      } else {
        setErrorBackend(message); // Mostrar mensaje de error del backend
      }
    } catch (error) {
      setErrorBackend(
        error.response?.data?.message || "Error al iniciar sesión"
      );
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="correo"
          className="flex justify-start text-sm font-medium text-black"
        >
          Correo Electrónico*
        </label>
        <input
          type="email"
          id="correo"
          name="correo"
          className="mt-3 block w-full py-2 px-4 font-medium border border-gray-300"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
      </div>
      {errorCorreo && (
        <p className="text-red-600 text-sm font-medium flex justify-start">
          Correo electrónico inválido, intente de nuevo
        </p>
      )}
      <div>
        <label
          htmlFor="contrasena"
          className="flex justify-start text-sm font-medium text-black"
        >
          Contraseña*
        </label>
        <input
          type="password"
          id="contrasena"
          name="contrasena"
          className="mt-3 block w-full py-2 px-4 font-medium border border-gray-300"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
      </div>
      {errorContrasena && (
        <p className="text-red-600 text-sm font-medium flex justify-start">
          Contraseña inválida, intente de nuevo
        </p>
      )}
      {errorBackend && (
        <p className="text-red-600 text-sm font-medium flex justify-start">
          {errorBackend}
        </p>
      )}
      <div>
        <button
          type="submit"
          className="w-full mt-3 botones text-white py-2 rounded-md hover:bg-blue-700 transition"
          onClick={handleSubmit}
        >
          Iniciar sesión
        </button>
        <div className="text-center mt-3">
          <a
            href="#"
            className="flex justify-center text-blue-600 hover:underline"
            onClick={handlePassword}
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
