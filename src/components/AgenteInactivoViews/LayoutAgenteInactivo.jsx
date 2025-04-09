import React from 'react'
import Header from "../AgenteInactivoViews/HeaderAgenteInactivo";
import SideBar from "../AgenteInactivoViews/SideBarAgenteInactivo";
import MainContent from '../AgenteInactivoViews/MainContentAgenteInactivo';

const LayoutAgenteInactivo = ({title}) => {
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

export default LayoutAgenteInactivo
