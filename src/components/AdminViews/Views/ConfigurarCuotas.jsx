import React, { useState, useEffect } from "react";
import axios from 'axios';
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";

const ConfigurarCuotas = () => {
    const location = useLocation();
    const id = location.state?.id;
    console.log("Prueba", id);

    const [emisiones, setEmisiones] = useState(0);
    const [nuevaCantidad, setNuevaCantidad] = useState("");
    const [loading, setLoading] = useState(false);

    const swalWithTailwindButtons = Swal.mixin({
        customClass: {
            confirmButton: "bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mx-2",
            cancelButton: "bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mx-2"
        },
        buttonsStyling: false
    });

    useEffect(() => {
        const fetchEmisionesActuales = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://localhost:3000/nar/cuotas/');
                const data = response.data;
                setEmisiones(data.emisionesRequeridas);
            } catch (error) {
                console.error("Error al obtener las emisiones:", error);
                swalWithTailwindButtons.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'No se pudieron cargar las emisiones actuales',
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
            swalWithTailwindButtons.fire({
                icon: 'warning',
                title: 'Cantidad inválida',
                text: 'Por favor ingresa un número válido',
            });
            return;
        }

        const cantidad = parseInt(nuevaCantidad);
        if (cantidad <= 0) {
            swalWithTailwindButtons.fire({
                icon: 'warning',
                title: 'Cantidad inválida',
                text: 'La cantidad debe ser mayor a cero',
            });
            return;
        }

        // Confirmación antes de actualizar
        swalWithTailwindButtons.fire({
            title: '¿Estás seguro?',
            text: `Vas a cambiar las emisiones requeridas de ${emisiones} a ${cantidad}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'Cancelar',
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setLoading(true);

                    const response = await axios.put(`http://localhost:3000/nar/cuotas/id/67ef962c86cbecc00539053d`, {
                        cuotaMensual: cantidad,
                    });

                    if (response.status === 200) {
                        setEmisiones(cantidad);
                        setNuevaCantidad("");

                        swalWithTailwindButtons.fire({
                            icon: 'success',
                            title: '¡Actualizado!',
                            text: `Las emisiones requeridas se han actualizado a ${cantidad}`,
                        });
                    } else {
                        throw new Error('Error en la respuesta del servidor');
                    }
                } catch (error) {
                    console.error("Error al actualizar:", error);
                    swalWithTailwindButtons.fire({
                        icon: 'error',
                        title: 'Error',
                        text: 'No se pudo actualizar la configuración',
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
