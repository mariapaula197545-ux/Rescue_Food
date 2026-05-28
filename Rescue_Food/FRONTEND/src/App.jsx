// App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './pages/HomePage';
import LoginComprador from './pages/LoginComprador';
import RegisterComprador from './pages/RegisterComprador';
import CarritoPage from './pages/CarritoPage';
import PedidosPage from './pages/PedidosPage';
import ProductosPage from './pages/ProductosPage';
import LoginTienda from './pages/LoginTienda';
import RegistroTienda from './pages/RegisterTienda';
import PerfilComprador from './pages/PerfilComprador';
import PerfilTienda from './pages/PerfilTienda';
import ConfiguracionComprador from './pages/ConfiguracionComprador';
import ConfiguracionTienda from './pages/ConfiguracionTienda';
import Inicio from './pages/InicioPage';
import Tiendas from './pages/TiendasPage';
import ContactoPage from './pages/ContactoPage';
import TuCuentaPage from './pages/TuCuentaPage';
import QuienesSomosPage from './pages/QuienesSomosPage';
import PreguntasFrecuentesPage from './pages/PreguntasFrecuentesPage';
import PoliticasPage from './pages/PoliticasPage';
import OpcionesDePago from './pages/OpcionesDePago';
import NuestrosServicios from './pages/NuestrosServicios';
import NuestraEmpresa from './pages/NuestraEmpresa';
import Nosotros from './pages/Nosotros';
import GestionarProductos from './pages/GestionarProductos';
import MisPedidos from './pages/MisPedidos';
import SeguridadTienda from './pages/SeguridadTienda';
import SeguridadComprador from './pages/SeguridadComprador';

import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<HomePage />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/login-comprador" element={<LoginComprador />} />
        <Route path="/registro-comprador" element={<RegisterComprador />} />
        <Route path="/productos" element={<ProductosPage />} />
        
        <Route path="/carrito" element={<CarritoPage />} />

        <Route path="/login-tienda" element={<LoginTienda />} />
        <Route path="/registro-tienda" element={<RegistroTienda />} />
        <Route path="/configuracion-comprador" element={<ConfiguracionComprador />} />
        <Route path="/configuracion-tienda" element={<ConfiguracionTienda />} />
        <Route path="/tiendas" element={<Tiendas />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/tu-cuenta" element={<TuCuentaPage />} />
        <Route path="/quienes-somos" element={<QuienesSomosPage />} />
        <Route path="/preguntas" element={<PreguntasFrecuentesPage />} />
        <Route path="/politicas" element={<PoliticasPage />} />
        <Route path="/pagos" element={<OpcionesDePago />} />
        <Route path="/servicios" element={<NuestrosServicios />} />
        <Route path="/empresa" element={<NuestraEmpresa />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/seguridad-tienda" element={<SeguridadTienda />} />
        <Route path="/seguridad-comprador" element={<SeguridadComprador />} />

        {/* RUTAS PRIVADAS PROTEGIDAS */}
        <Route
          path="/pedidos"
          element={
            <PrivateRoute>
              <PedidosPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/perfil-comprador"
          element={
            <PrivateRoute>
              <PerfilComprador />
            </PrivateRoute>
          }
        />

        <Route
          path="/perfil-tienda"
          element={
            <PrivateRoute>
              <PerfilTienda />
            </PrivateRoute>
          }
        />

        <Route
          path="/gestionar-productos"
          element={
            <PrivateRoute>
              <GestionarProductos />
            </PrivateRoute>
          }
        />

        <Route
          path="/mis-pedidos"
          element={
            <PrivateRoute>
              <MisPedidos />
            </PrivateRoute>
          }
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;