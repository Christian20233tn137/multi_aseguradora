// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import Login from './components/LoginComponents/login';
import InicioAdmin from './components/AdminViews/InicioAdmin';
import Layout from './components/Layout';
import NotFound from './components/NotFound';
import SolicitudSection from './components/AdminViews/SolicitudSection';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />

        {/* Rutas accesibles sin restricciones (aun nada esta restringido) */}
        <Route
          path="/inicioAdmin"
          element={
            <ProtectedRoute>
              <InicioAdmin />
            </ProtectedRoute>
          }
        />

        {/* Rutas con Layout */}
        <Route
          path="/inicio/*"
          element={
            <ProtectedRoute>
              <Layout activeSection="Inicio" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/datos/*"
          element={
            <ProtectedRoute>
              <Layout activeSection="Datos" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documentos/*"
          element={
            <ProtectedRoute>
              <Layout activeSection="Documentos" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/solicitudes/*"
          element={
            <ProtectedRoute>
              <Layout activeSection="Solicitudes" />
            </ProtectedRoute>
          }
        >
          <Route
            path="solicitud-documentos"
            element={<SolicitudSection />}
          />
        </Route>
        <Route
          path="/aseguradoras/*"
          element={
            <ProtectedRoute>
              <Layout activeSection="Aseguradoras" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/agentes/*"
          element={
            <ProtectedRoute>
              <Layout activeSection="Agentes" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/administradores/*"
          element={
            <ProtectedRoute>
              <Layout activeSection="Administradores" />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configurar-cuotas/*"
          element={
            <ProtectedRoute>
              <Layout activeSection="Configurar Cuotas" />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
