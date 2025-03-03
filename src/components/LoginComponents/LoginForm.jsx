import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ setUser }) => {
  const navigate = useNavigate();

  // Estados para los campos (adaptando el nombre y contraseña)
  const [nombre, setNombre] = useState("");
  const [contra, setContra] = useState("");
  const [error, setError] = useState(false);

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (nombre === "" || contra === "") {
      setError(true);
      return;
    }
    setError(false);
    setUser([nombre]);
    navigate("/inicio"); // Redirige al usuario tras login exitoso
    console.log("Probando");
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
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </div>
      {error && (
        <p className="text-red-600 text-sm font-medium">
          El usuario es necesario{" "}
        </p>
      )}
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
          value={contra}
          onChange={(e) => setContra(e.target.value)}
        />
      </div>
      {error && (
        <p className="text-red-600 text-sm font-medium">
          La contrasena es necesaria{" "}
        </p>
      )}
      <div>
        <button
          type="submit"
          className="w-full mt-3 bg-blue-800 text-white py-2 rounded-md hover:bg-blue-700 transition botones"
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
