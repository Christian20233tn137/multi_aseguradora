import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/LoginComponents/login";
import Layout from "./components/Layout";
import NotFound from "./components/NotFound";
import SolicitudSection from "./components/AdminViews/SolicitudSection";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {


  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login  />} />
      <Route path="/" element={<Home />} />


      {/* Rutas protegidas con Layout */}
      <Route
        path="/inicio/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/datos/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/documentos/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/solicitudes/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Ruta hija dentro de solicitudes */}
        <Route path="solicitud-documentos" element={<SolicitudSection />} />
      </Route>

      <Route
        path="/aseguradoras/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/agentes/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/administradores/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/configurar-cuotas/*"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      />

      {/* Ruta por defecto (404) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
