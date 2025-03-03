import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";

const Layout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        {/* Aquí puedes insertar MainContent directamente */}
        <MainContent />
      </div>
    </div>
  );
};

export default Layout;
