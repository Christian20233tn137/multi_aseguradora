import React, { useState } from "react";
import Sidebar from "../Sidebar";
import MainContent from "../MainContent";
import Header from "../Header";

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("Inicio");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar setActiveSection={setActiveSection} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <MainContent activeSection={activeSection} />
      </div>
    </div>
  );
};

export default Dashboard;
