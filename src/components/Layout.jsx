import React, { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";

const Layout = () => {
  const [activeSection, setActiveSection] = useState("Inicio");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar setActiveSection={setActiveSection} />

      {/* Contenedor Principal */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        <MainContent activeSection={activeSection} />
      </div>
    </div>
  );
};

export default Layout;
