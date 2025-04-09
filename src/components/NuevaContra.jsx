import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

const NuevaContra = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const correo = location.state?.correo || "";
  const codigoRecuperacion = location.state?.codigoRecuperacion || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors = [];
    if (password.length < minLength) {
      errors.push(`La contraseña debe tener al menos ${minLength} caracteres`);
    }
    if (!hasUpperCase) {
      errors.push("Debe incluir al menos una letra mayúscula");
    }
    if (!hasLowerCase) {
      errors.push("Debe incluir al menos una letra minúscula");
    }
    if (!hasNumbers) {
      errors.push("Debe incluir al menos un número");
    }
    if (!hasSpecialChar) {
      errors.push(
        'Debe incluir al menos un carácter especial (!@#$%^&*(),.?":{}|<>)'
      );
    }

    return errors;
  };

  const handleCodigo = async () => {
    // Validate passwords match
    if (password !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Las contraseñas no coinciden",
      });
      return;
    }

    // Validate password strength
    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      Swal.fire({
        icon: "error",
        title: "Contraseña no válida",
        html: passwordErrors.join("<br>"),
      });
      return;
    }

    // Show loading alert
    Swal.fire({
      title: "Cambiando contraseña...",
      text: "Por favor espere mientras actualizamos su contraseña",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await axios.post(
        "http://localhost:3001/nar/usuarios/recuperacion/cambiar",
        {
          correo,
          codigoRecuperacion,
          nuevaContrasena: password,
        }
      );

      if (response.status === 200) {
        // Show success alert
        await Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "Su contraseña ha sido actualizada correctamente",
          timer: 2000,
          showConfirmButton: false,
        });
        navigate("/login");
      }
    } catch (error) {
      let errorMessage = "Error al cambiar la contraseña";

      if (error.response) {
        // Server responded with an error
        if (error.response.status === 400) {
          errorMessage = "El código de recuperación ha expirado o es inválido";
        } else {
          errorMessage =
            error.response.data.message || "Error al actualizar la contraseña";
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "No se pudo conectar con el servidor";
      }

      // Show error alert
      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
        confirmButtonText: "Intentar de nuevo",
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
        <h2 className="text-lg font-semibold">Ingrese su nueva contraseña</h2>
        <div className="w-full max-w-md mt-10">
          <input
            type="password"
            className="p-2 border border-gray-300 rounded w-full mb-4"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            className="p-2 border border-gray-300 rounded w-full"
            placeholder="Confirmar contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-2">
            La contraseña debe tener al menos 8 caracteres, incluir mayúsculas,
            minúsculas, números y caracteres especiales.
          </p>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <button
          className="mt-4 px-4 py-2 botones text-white rounded hover:bg-blue-800"
          onClick={handleCodigo}
        >
          Cambiar contraseña
        </button>
      </main>

      <footer className="colorFondo text-white text-center p-3 w-full">
        <p>&copy; 2025 Tu Empresa. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default NuevaContra;
