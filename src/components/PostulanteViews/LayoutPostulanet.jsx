import React from 'react'
import SidebarPostulante from "../PostulanteViews/SideBarPostulante";
import HeaderPostulante from "../PostulanteViews/HeaderPostulante";
import MainContentPostulante from "../PostulanteViews/MainContentPostulante";

const LayoutPostulanet = ({title}) => {
  return (
    <div className='flex h-screen'>
      <SidebarPostulante/>
      <div className="flex flex-col flex-1">
        <HeaderPostulante title={title}/>
        <MainContentPostulante />
      </div>
    </div>
  )
}

export default LayoutPostulanet
