import React from "react";
import Header from "./Header"
import MainContent from "./MainContent"
import Sidebar from "./Sidebar"

const Layout = ({ title }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header title={title} />
        <MainContent />
      </div>
    </div>
  );
};

export default Layout;
