// PerfilTienda.jsx
import { Link } from 'react-router-dom';

function PerfilTienda() {
  // Obtenemos los datos del usuario del localStorage
  const usuario = JSON.parse(
    localStorage.getItem('usuario')
  ); // Deserializa los datos de autenticación del usuario administrador del comercio

  // Obtenemos los datos específicos de la tienda del localStorage
  const tienda = JSON.parse(
    localStorage.getItem('tienda')
  ); // Deserializa el perfil comercial independiente que contiene el logo, horario y teléfono

  // CONFIGURAR RUTA DEL LOGO REAL
  let fotoAMostrar = 'https://via.placeholder.com/150'; // Imagen de respaldo por defecto si el comercio no registra logo aún

  if (tienda && tienda.logo_url) {
    if (tienda.logo_url.startsWith('http')) {
      fotoAMostrar = tienda.logo_url; // Si el string es una URL externa directa, la asigna de inmediato
    } else {
      fotoAMostrar = `http://localhost:3000${tienda.logo_url}`; // Si es una ruta interna del backend, concatena la dirección estática del servidor
    }
  }

  return (
    <div className="container text-center my-5">
      <h2 className="fw-bold text-success mb-4">
        Perfil de la Tienda
      </h2>

      <div
        className="card mx-auto p-4 border-0 shadow-sm"
        style={{ maxWidth: '420px' }}
      >
        {/* REEMPLAZADA LA IMAGEN DE SOFIA POR EL LOGO REAL */}
        <img
          src={fotoAMostrar}
          className="rounded-circle mx-auto mb-3 shadow-sm"
          alt="Logo Tienda Real"
          width="150"
          height="150"
          style={{ objectFit: 'cover' }} // Recorta y ajusta el logo dentro del círculo sin importar sus dimensiones originales para evitar distorsiones
        />

        {/* Mostramos el nombre de la tienda si existe, si no, el del usuario */}
        <h3 className="fw-semibold mb-2">
          {tienda?.nombre_tienda || usuario?.nombre || 'Mi Tienda'} {/* Renderizado controlado: prioriza el nombre comercial antes que el personal */}
        </h3>

        <p className="text-muted mb-4">
          Cuenta de tienda
        </p>

        <div className="d-grid gap-3">
          <Link
            to="/gestionar-productos"
            className="btn btn-success"
          >
            Gestionar Productos
          </Link>

          <Link
            to="/configuracion-tienda"
            className="btn btn-outline-success"
          >
            Configuración de la Tienda
          </Link>

          <Link
            to="/productos"
            className="btn btn-dark"
          >
            Ver Productos
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PerfilTienda;