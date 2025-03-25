import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const Seguros = () => {
  const [asegurado, setAsegurado] = useState({
    nombre: 'Prueba',
    telefono: '78978-5598-989',
    edad: '80',
    correo: 'Hola',
    imagen: '', // Aquí se cargará la imagen desde el back
  });

  const handleEmitir = () => {
    Swal.fire({
      title: '¿Estás seguro de emitir la acción?',
      text: 'Una vez emitido, no podrás revertir esta acción.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#0B1956',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, emitir',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('¡Emitido!', 'La póliza ha sido emitida a al correo del cliente.', 'success');
      }
    });
  };

  return (
    <div className="relative p-4">
      <h1 className="text-3xl p-3 text-center font-normal text-black miColor rounded-2xl w-full">
        Información sobre el seguro
      </h1>

      <div className="flex flex-col items-center p-4">
        {/* Contenedor modificado para alinear título e imagen */}
        <div className="flex items-center justify-center gap-4 mb-4">
          
          {/* Imagen asegurado */}
          <div className="w-24 h-24 rounded-full bg-gray-400 overflow-hidden">
            {asegurado.imagen ? (
              <img src={asegurado.imagen} alt="Foto asegurado" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white">Foto</div>
            )}
          </div>
          <h2 className="text-2xl font-semibold">SEGURO DE VIDA 1</h2>
        </div>

        {/* Datos del asegurado */}
        <div className="border border-gray-400 rounded-lg p-4 w-full max-w-xl text-sm mt-4">
          <p><span className="font-semibold">Nombre:</span> {asegurado.nombre}</p>
          <p><span className="font-semibold">Teléfono:</span> {asegurado.telefono}</p>
          <p><span className="font-semibold">Edad:</span> {asegurado.edad} años</p>
          <p><span className="font-semibold">Correo:</span> {asegurado.correo}</p>
        </div>

        {/* Costos y coberturas */}
        <div className="border border-gray-400 rounded-lg p-4 w-full max-w-4x1 text-sm mt-4">
          <p><span className="font-semibold">Costo mensual:</span> $90, $60</p>
          <p className="font-semibold">Coberturas:</p>
          <ul className="list-disc pl-6">
            <li>Muerte Natural – Pago a beneficiarios por fallecimiento.</li>
            <li>Muerte Accidental – Pago extra si la muerte es por accidente.</li>
            <li>Invalidez Total – Indemnización si el asegurado queda incapacitado.</li>
            <li>Enfermedad Terminal – Adelanto del seguro en casos graves.</li>
            <li>Gastos Funerarios – Cobertura de costos del funeral.</li>
            <li>Doble Indemnización – Pago doble si la muerte es accidental.</li>
          </ul>
        </div>

        {/* Botones */}
        <div className="flex space-x-20 justify-center mt-20">
          <button type='button'  className="px-4 py-2 botones text-white rounded disabled:bg-gray-400"
          onClick={() => navigate('/seguros')}
          >Regresar</button>
          <button 
          type='button'
             className="px-4 py-2 botones text-white rounded disabled:bg-gray-400"
            onClick={handleEmitir}
          >
            Emitir
          </button>
        </div>
      </div>
    </div>
  );
};

export default Seguros;