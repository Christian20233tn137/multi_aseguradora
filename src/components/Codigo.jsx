import React, { useState, useRef } from 'react';
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

const Codigo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const correo = location.state?.correo || '';
  const [codigo, setCodigo] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    const newCodigo = [...codigo];
    newCodigo[index] = value;
    setCodigo(newCodigo);

    if (value && index < codigo.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleSubmit = async () => {
    const codigoCompleto = codigo.join('');

    if (!correo) {
      swalWithTailwindButtons.fire({
        icon: 'error',
        title: 'Error',
        text: 'El correo es obligatorio.'
      });
      return;
    }
    if (codigoCompleto.length !== 4) {
      swalWithTailwindButtons.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes ingresar el código completo.'
      });
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/nar/usuarios/recuperacion/validar', {
        correo,
        codigoRecuperacion: codigoCompleto
      });

      if (response.status === 200) {
        navigate("/recuperacion/codigo/nuevaContra", { state: { correo, codigoRecuperacion: codigoCompleto } });
      } else {
        setError('Código incorrecto');
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
              ref={el => inputRefs.current[index] = el}
            />
          ))}
        </div>
        {error && <p className="text-red-500">{error}</p>}
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
