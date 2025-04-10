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

    if (!correo) {
      setErrorCorreo(true);
      hasError = true;
    } else {
      setErrorCorreo(false);
    }

    if (!contrasena) {
      setErrorContrasena(true);
      hasError = true;
    } else {
      setErrorContrasena(false);
    }

    if (hasError) return;

    try {
      const response = await axios.post(
        "https://lz2k718xka.execute-api.us-east-1.amazonaws.com/nar/usuarios/login",
        {
            correo,
            contrasena,
        },
        {
            withCredentials: true, // Permite enviar y recibir cookies/sesiones
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    

      const { success, data, message } = response.data;

      if (success) {
        localStorage.setItem("user", JSON.stringify(data));
        localStorage.setItem("token", data.token);
        localStorage.setItem("id", data._id);

        if (data.rol === "administrador") {
          navigate("/inicio", {
            state: { id: data._id },
            replace: true, 
          });
        }
        else if (data.rol === "agente" && data.estado === "inactivo") {
          navigate("/agenteInactivo",{
            state: { id: data._id },
            replace: true, 
          })
        }
         else if (data.rol === "agente") {
          navigate("/inicioAgentes", {
            state: { id: data._id },
            replace: true, 
          });
        } else if (data.rol === "postulante") {
          navigate("/archivosPostulante", {
            state: { id: data._id },
            replace: true, 
          });
        } else if (data.rol==="agenteInactivo"){
          navigate("/agenteInactivo");
        }
      } else {
        setErrorBackend(message);
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
