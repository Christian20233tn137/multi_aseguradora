import React from "react";

const Header = ({title}) => {
  return (
    <div className="colorFondo shadow p-4">
      <h1 className="text-2xl font-bold text-center text-white">{title}</h1>
    </div>
  );
};

export default Header;