import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/LoginComponents/login";
import InicioAdmin from "./components/AdminViews/InicioAdmin";
import Layout from "./components/Layout";
import NotFound from "./components/NotFound";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/inicioAdmin" element={<InicioAdmin />} />

        {/* Rutas con Layout */}
        <Route path="/inicio/*" element={<Layout activeSection="Inicio" />} />
        <Route path="/datos/*" element={<Layout activeSection="Datos" />} />
        <Route
          path="/documentos/*"
          element={<Layout activeSection="Documentos" />}
        />
        <Route
          path="/solicitudes/*"
          element={<Layout activeSection="Solicitudes" />}
        />
        <Route
          path="/solicitudes/solicitud-documentos"
          element={<Layout activeSection="SolicitudDocumentos" />}
        />
        <Route
          path="/aseguradoras/*"
          element={<Layout activeSection="Aseguradoras" />}
        />
        <Route path="/agentes/*" element={<Layout activeSection="Agentes" />} />
        <Route
          path="/configurar-cuotas/*"
          element={<Layout activeSection="Configurar Cuotas" />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;