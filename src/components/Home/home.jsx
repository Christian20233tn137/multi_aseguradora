import React from "react";
import Navbar from "./NavBarHome";
import Section from "./Section";
import ImageSection from "./ImageSection";

const home = () => {
  return (
    <div className="font-sans">
      <Navbar />
      <div className="flex flex-col lg:flex-row items-center justify-between">
        <Section />
        <ImageSection />
      </div>
    </div>
  );
};

export default home;
