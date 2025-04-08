import React from 'react'
import Header from "./HeaderAgenteInactivo";
import SideBar from "./SideBarAgenteInactivo";
import MainContent from '../AgenteViews/MainContentAgente';

const LayoutAgente = ({title}) => {
  return (
    <div className='flex h-screen'>
      <SideBar/>
      <div className="flex flex-col flex-1">
        <Header title={title}/>
        <MainContent/>
      </div>
    </div>
  )
}

export default LayoutAgente
