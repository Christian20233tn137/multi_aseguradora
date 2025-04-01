import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const CotizacionesPendientes = () => {

    const API_URL = "hhtp://localhost:300/nar/cotizaciones/pendientes"

const navigate = useNavigate();
const location = useLocation();
const id = location.state.id;
console.log(id);

const [cotizaciones, setCotizaciones] = useState([]);

useEffect(()=> {
    const fetchCotizaciones = async () => {
        try {
            const response = await axios.get(API_URL);
            setCotizaciones(response.data)
        } catch (error) {
            console.error("Error al obtener las cotizaciones", error);
        }
    }

    fetchCotizaciones();
}, [])
  return (
    <div className='p-4'>
      <div className="flex flex-col sm:flex-row items-center mb-4">
        <input type="text" placeholder='Buscar' className='border p-2 w-64' value={search} aria-label='Buscar cotizacion'/>
      </div>
      <div className="border-0 p-4">
        
      </div>
    </div>
  )
}

export default CotizacionesPendientes
