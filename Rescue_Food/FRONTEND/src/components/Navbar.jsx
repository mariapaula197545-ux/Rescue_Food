// Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Dropdown } from 'bootstrap';
import axios from 'axios';

function Navbar() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [cantidadCarrito, setCantidadCarrito] = useState(0);
  
  // 🔥 NUEVO ESTADO: Controla si el menú hamburguesa está abierto o cerrado
  const [menuAbierto, setMenuAbierto] = useState(false);

  // =====================================
  // ACTUALIZAR CONTADOR DE CARRITO (DINÁMICO)
  // =====================================
  const actualizarContador = async () => {
    const usuarioGuardado = localStorage.getItem('usuario');
    const userObj = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

    if (userObj) {
      try {
        const response = await axios.get(`http://localhost:3000/api/carrito/${userObj.id}`);
        const items = response.data.data?.items || [];
        const totalItems = items.reduce((acc, curr) => acc + Number(curr.cantidad), 0);
        setCantidadCarrito(totalItems);
      } catch (error) {
        console.error("Error al sincronizar contador con backend:", error);
        setCantidadCarrito(0);
      }
    } else {
      const localCart = JSON.parse(localStorage.getItem('carrito_invitado')) || [];
      const totalItems = localCart.reduce((acc, curr) => acc + Number(curr.cantidad), 0);
      setCantidadCarrito(totalItems);
    }
  };

  // SINCRONIZAR USUARIO Y EVENTOS DE CONTADOR
  useEffect(() => {
    const syncUsuario = () => {
      const usuarioGuardado = localStorage.getItem('usuario');
      setUsuario(usuarioGuardado ? JSON.parse(usuarioGuardado) : null);
      actualizarContador();
    };

    syncUsuario();

    window.addEventListener('storage', syncUsuario);
    window.addEventListener('carrito-actualizado', actualizarContador);

    return () => {
      window.removeEventListener('storage', syncUsuario);
      window.removeEventListener('carrito-actualizado', actualizarContador);
    };
  }, []);

  // Bootstrap dropdown
  useEffect(() => {
    const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
    dropdownElementList.forEach((dropdownToggleEl) => {
      new Dropdown(dropdownToggleEl);
    });
  }, []);

  // CERRAR SESIÓN
  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
    setCantidadCarrito(0);
    setMenuAbierto(false); // Cierra el menú al desloguearse

    navigate('/');
    window.location.href = '/';
  };

  // FUNCIÓN PARA INTERCAMBIAR EL ESTADO DEL MENÚ
  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  // FUNCIÓN PARA CERRAR EL MENÚ AL HACER CLIC EN UN ENLACE
  const cerrarMenu = () => {
    setMenuAbierto(false);
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="bg-success text-white py-1">
        <div
          className="container-fluid d-flex align-items-center justify-content-between"
          style={{ height: '55px' }}
        >
          {/* LOGO */}
          <Link to="/" className="d-flex align-items-center" onClick={cerrarMenu}>
            <img
              src="/img/Lo.ico"
              alt="RescueFood"
              style={{ width: '120px' }}
            />
          </Link>

          {/* BUSCADOR */}
          <form
            className="d-flex align-items-center"
            role="search"
            style={{ width: '95%', justifyContent: 'flex-end' }}
          >
            <input
              className="form-control rounded-pill px-4"
              type="search"
              placeholder="Buscar productos o tiendas..."
              style={{ maxWidth: '980px' }}
            />

            <button
              className="btn btn-light text-success rounded-circle ms-2"
              type="submit"
            >
              <i className="bi bi-search fs-5"></i>
            </button>
          </form>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: '#7FD45D' }}>
        <div className="container-fluid">

          {/* BOTÓN HAMBURGUESA CORREGIDO CON CLASES DINÁMICAS DE REACT */}
          <button
            className={`navbar-toggler border-white ${!menuAbierto ? 'collapsed' : ''}`}
            type="button"
            onClick={toggleMenu}
            aria-controls="navbarRescue"
            aria-expanded={menuAbierto}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" style={{ filter: 'invert(1)' }}></span>
          </button>

          {/* CONTENEDOR COLAPSIBLE CONTROLADO POR EL ESTADO 'menuAbierto' */}
          <div className={`collapse navbar-collapse ${menuAbierto ? 'show' : ''}`} id="navbarRescue">

            {/* MENÚ IZQUIERDO */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link text-white fw-medium" to="/inicio" onClick={cerrarMenu}>
                  Inicio
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white fw-medium" to="/nosotros" onClick={cerrarMenu}>
                  Nosotros
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white fw-medium" to="/productos" onClick={cerrarMenu}>
                  Productos
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white fw-medium" to="/tiendas" onClick={cerrarMenu}>
                  Tiendas
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-white fw-medium" to="/contacto" onClick={cerrarMenu}>
                  Contáctanos
                </Link>
              </li>
            </ul>

            {/* MENÚ DERECHO */}
            <ul className="navbar-nav ms-auto align-items-center">

              {/* USUARIO */}
              <li className="nav-item dropdown">
                {usuario ? (
                  <>
                    <button
                      className="btn nav-link dropdown-toggle text-white bg-transparent border-0"
                      data-bs-toggle="dropdown"
                    >
                      <i className="bi bi-person-circle fs-5 me-2"></i>
                      {usuario.nombre}
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <Link
                          className="dropdown-item"
                          to={usuario.rol === 'TIENDA' ? '/perfil-tienda' : '/perfil-comprador'}
                          onClick={cerrarMenu}
                        >
                          Mi cuenta
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={cerrarSesion}
                        >
                          Cerrar sesión
                        </button>
                      </li>
                    </ul>
                  </>
                ) : (
                  <Link className="nav-link text-white" to="/tu-cuenta" onClick={cerrarMenu}>
                    <i className="bi bi-person-circle fs-5 me-2"></i>
                    Iniciar sesión
                  </Link>
                )}
              </li>

              {/* CARRITO */}
              <li className="nav-item position-relative ms-3">
                <Link className="nav-link text-white d-flex align-items-center" to="/carrito" onClick={cerrarMenu}>
                  <i className="bi bi-cart-fill fs-5"></i>
                  {cantidadCarrito > 0 && (
                    <span 
                      className="badge bg-danger rounded-circle position-absolute"
                      style={{ top: '-4px', right: '-10px', fontSize: '0.7rem' }}
                    >
                      {cantidadCarrito}
                    </span>
                  )}
                </Link>
              </li>

            </ul>

          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;