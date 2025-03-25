import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

let correo = 'chrisaviles@gmail.com';

const Codigo = () => {

const navigate = useNavigate();
const handleMover = () => {
    navigate("/recuperacion/codigo/nuevaContra")
}
  const [codigo, setCodigo] = useState(['', '', '', '']);

  const handleChange = (index, value) => {
    const newCodigo = [...codigo];
    newCodigo[index] = value;
    setCodigo(newCodigo);
  };

  const handleSubmit = () => {
    const codigoCompleto = codigo.join('');
    console.log('Código ingresado:', codigoCompleto);
    handleMover()
  };

  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden">
      <header className="colorFondo p-5 w-full">
        <h1 className="text-2xl font-bold text-center text-white">
          Solicitud de cambio de contraseña
        </h1>
      </header>

      <main className="flex flex-col items-center justify-center flex-grow p-5 bg-white w-full">
        <h2 className="text-lg font-semibold">
          Ingrese el código enviado al correo de {correo}
        </h2>
        <div className="flex space-x-2 mt-10">
          {codigo.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              className="p-2 border border-gray-300 rounded w-12 text-center"
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          ))}
        </div>
        <button
          className="mt-4 px-4 py-2 botones text-white rounded hover:bg-blue-800"
          onClick={handleSubmit}
        >
          Enviar
        </button>
      </main>

      <footer className="colorFondo text-white text-center p-3 w-full">
        <p>&copy; 2025 Tu Empresa. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Codigo;
