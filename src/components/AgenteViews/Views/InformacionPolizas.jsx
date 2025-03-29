import React from 'react'

import { useNavigate, useParams } from "react-router-dom";


const InformacionPolizas = () => {

  const {id} = useParams();
  const navigate = useNavigate();

  const handleRegresar = () => {
    navigate("/clientes/polizas"); // 
  };
  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-3xl w-full p-3 text-center font-normal text-black miColor rounded-2xl">{"Nombre de la poliza segun su elección"}</h1>
      <div className="mt-8 p-8 border rounded-lg shadow-md w-full max-w-5xl text-left mx-auto">
        {/*Aqui se pone el contenido de las polizas */}
        <p>Info de polizas</p>
      </div>

      <button
        onClick={handleRegresar}
        className="mt-4 botones text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition self-center" 
      >
        Regresar
      </button>


     
    </div>
  )
}

export default InformacionPolizas
