import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./components/Home/home";
import Login from "./components/LoginComponents/login";
import InicioAdmin from "./components/AdminViews/InicioAdmin";
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/inicioAdmin" element={<InicioAdmin />} /> {/* Nueva ruta */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
