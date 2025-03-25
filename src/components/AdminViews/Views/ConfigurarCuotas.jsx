import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";

const ConfigurarCuotas = () => {
  const [emisiones, setEmisiones] = useState(0);
  const [nuevaCantidad, setNuevaCantidad] = useState("");
  const [loading, setLoading] = useState(false);

  // Simulación de carga inicial desde el backend
  useEffect(() => {
    const fetchEmisionesActuales = async () => {
      try {
        setLoading(true);
        // Aquí iría tu llamada real al backend
        // const response = await fetch('/api/configuracion/cuotas');
        // const data = await response.json();
        
        // Simulamos respuesta del backend
        const data = { emisionesRequeridas: 10 };
        setEmisiones(data.emisionesRequeridas);
      } catch (error) {
        console.error("Error al obtener las emisiones:", error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar las emisiones actuales',
          confirmButtonColor: '#0B1956',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEmisionesActuales();
  }, []);

  const handleActualizar = async () => {
    // Validación
    if (!nuevaCantidad || isNaN(nuevaCantidad)) {
      Swal.fire({
        icon: 'warning',
        title: 'Cantidad inválida',
        text: 'Por favor ingresa un número válido',
        confirmButtonColor: '#0B1956',
      });
      return;
    }

    const cantidad = parseInt(nuevaCantidad);
    if (cantidad <= 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Cantidad inválida',
        text: 'La cantidad debe ser mayor a cero',
        confirmButtonColor: '#0B1956',
      });
      return;
    }

    // Confirmación antes de actualizar
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Vas a cambiar las emisiones requeridas de ${emisiones} a ${cantidad}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#0B1956',
      cancelButtonColor: '#d33',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          setLoading(true);
          
          // Aquí iría tu llamada real al backend para actualizar
          // const response = await fetch('/api/configuracion/cuotas', {
          //   method: 'PUT',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({ emisionesRequeridas: cantidad }),
          // });
          
          // Simulamos respuesta exitosa del backend
          // if (response.ok) {
            setEmisiones(cantidad);
            setNuevaCantidad("");
            
            Swal.fire({
              icon: 'success',
              title: '¡Actualizado!',
              text: `Las emisiones requeridas se han actualizado a ${cantidad}`,
              confirmButtonColor: '#0B1956',
            });
          // } else {
          //   throw new Error('Error en la respuesta del servidor');
          // }
        } catch (error) {
          console.error("Error al actualizar:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar la configuración',
            confirmButtonColor: '#0B1956',
          });
        } finally {
          setLoading(false);
        }
      }
    });
  };

  return (
    <div className="p-6 w-auto h-auto overflow-hidden">
      <h1 className="text-3xl p-3 text-center font-normal text-black miColor rounded-2xl w-full">
        Configuración de Cuota
      </h1>
      
      {loading ? (
        <div className="text-center py-10">
          <p>Cargando...</p>
        </div>
      ) : (
        <>
          <h2 className="text-3xl p-3 text-center font-semibold text-black miColor rounded-2xl w-full mt-10">
            Actualmente se requieren {emisiones} emisiones mensuales
          </h2>
          
          <div className="w-full flex flex-col items-center mt-10">
            <label
              htmlFor="nuevaCantidad"
              className="text-lg font-medium text-black w-full text-center mb-2"
            >
              Ingresa la nueva cantidad
            </label>
            <input
              type="number"
              id="nuevaCantidad"
              name="nuevaCantidad"
              value={nuevaCantidad}
              onChange={(e) => setNuevaCantidad(e.target.value)}
              className="py-3 px-4 font-medium border border-gray-300 text-center rounded-md w-1/3"
              required
              min="1"
            />
          </div>
          
          <div className="flex items-center justify-center mt-10">
            <button
              type="button"
              onClick={handleActualizar}
              disabled={loading}
              className={`w-30 py-3 px-6 text-lg font-semibold text-white rounded-lg ${loading ? 'bg-gray-400' : 'botones hover:bg-blue-700'}`}
            >
              {loading ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ConfigurarCuotas;