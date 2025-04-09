import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

// SweetAlert configuration with Tailwind CSS classes
const swalWithTailwindButtons = Swal.mixin({
  customClass: {
    confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
    cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
  },
  buttonsStyling: false
});

const NuevaContra = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const correo = location.state?.correo || '';
  const codigoRecuperacion = location.state?.codigoRecuperacion || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleCodigo = async () => {
    if (password !== confirmPassword) {
      swalWithTailwindButtons.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden'
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/nar/usuarios/recuperacion/cambiar', {
        correo,
        codigoRecuperacion,
        nuevaContrasena: password
      });

      if (response.status === 200) {
        navigate("/login");
      } else {
        setError('Error al cambiar la contraseña');
      }
    } catch (error) {
      swalWithTailwindButtons.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error al comunicarse con el servidor'
      });
    }
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
          Ingrese su nueva contraseña
        </h2>
        <input
          type="password"
          className="mt-10 p-2 border border-gray-300 rounded w-full max-w-md"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          className="mt-10 p-2 border border-gray-300 rounded w-full max-w-md"
          placeholder="Confirmar contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button
          className="mt-4 px-4 py-2 botones text-white rounded"
          onClick={handleCodigo}
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

export default NuevaContra;
