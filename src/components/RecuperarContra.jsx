import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

// SweetAlert configuration with Tailwind CSS classes
const swalWithTailwindButtons = Swal.mixin({
  customClass: {
    confirmButton:
      "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
    cancelButton:
      "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2",
  },
  buttonsStyling: false,
});

const RecuperarContra = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleCodigo = async () => {
    // Validate email
    if (!email) {
      swalWithTailwindButtons.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, ingrese su correo electrónico.",
      });
      return;
    }

    // Basic email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      swalWithTailwindButtons.fire({
        icon: "error",
        title: "Error",
        text: "Por favor, ingrese un correo electrónico válido.",
      });
      return;
    }

    // Show loading alert
    Swal.fire({
      title: "Enviando solicitud...",
      text: "Por favor espere mientras procesamos su solicitud",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await axios.post(
        "https://lz2k718xka.execute-api.us-east-1.amazonaws.com/nar/usuarios/recuperacion/generar",
        {
          correo: email,
        }
      );

      if (response.status === 200) {
        // Show success alert
        await Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Se ha enviado un código de recuperación a su correo electrónico",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/recuperacion/codigo", { state: { correo: email } });
      }
    } catch (error) {
      // Show error alert with specific message
      let errorMessage = "Error al comunicarse con el servidor";
      if (error.response) {
        // Server responded with an error
        errorMessage = error.response.data.message || "Error en el servidor";
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No se pudo conectar con el servidor";
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
      setError(errorMessage);
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
          Ingrese el correo electrónico asociado a la cuenta
        </h2>
        <input
          type="email"
          className="mt-10 p-2 border border-gray-300 rounded w-full max-w-md"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

export default RecuperarContra;
