import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import MainContent from "./MainContent";

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
