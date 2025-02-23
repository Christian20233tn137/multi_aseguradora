import React from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ handleSubmit }) => {
  const navigate = useNavigate();

  const handleAceptar = () => {
    navigate("/inicioAdmin");
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="usuario"
          className="flex justify-start text-sm font-medium text-black"
        >
          Correo Electrónico*
        </label>
        <input
          type="text"
          id="usuario"
          name="usuario"
          className="mt-3 block w-full py-2 px-4 font-medium border border-gray-300"
          required
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="flex justify-start text-sm font-medium text-black"
        >
          Contraseña*
        </label>
        <input
          type="password"
          id="password"
          name="password"
          className="mt-3 block w-full py-2 px-4 font-medium border border-gray-300"
          required
        />
      </div>
      <div>
        <button
          type="button" // Cambia a 'button' para evitar el envío del formulario (por que aun no hay logica)
          className="w-full mt-3 bg-blue-800 text-white py-2 rounded-md hover:bg-blue-700 transition botones"
          onClick={handleAceptar} 
        >
          Iniciar sesión
        </button>
        <div className="text-center mt-3">
          <a
            href="#"
            className="flex justify-center text-blue-600 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </a>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
