import React from 'react'
import { useNavigate } from 'react-router-dom';

const NuevaContra = () => {
    const navigate = useNavigate();
    const handleCodigo = () => {
        navigate("/login")
    }
  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden">
      <header className="colorFondo p-5 w-full">
        <h1 className="text-2xl font-bold text-center text-white">
          Solicitud de cambio de contraseña
        </h1>
      </header>

      <main className="flex flex-col items-center justify-center flex-grow p-5 bg-white w-full">
        <h2 className="text-lg font-semibold">
          Ingrese su nueva contraseña
        </h2>
        <input
          type="password"
          className="mt-10 p-2 border border-gray-300 rounded w-full max-w-md"
          placeholder="Contraseña"
        />
        <input
          type="password"
          className="mt-10 p-2 border border-gray-300 rounded w-full max-w-md"
          placeholder="Confirmar contraseña"
        />
        <button className="mt-4 px-4 py-2 botones text-white rounded" onClick={handleCodigo}>
          Enviar
        </button>
      </main>

      <footer className="colorFondo text-white text-center p-3 w-full">
        <p>&copy; 2025 Tu Empresa. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}

export default NuevaContra
