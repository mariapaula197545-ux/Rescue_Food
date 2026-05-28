// PerfilComprador.jsx
import { Link } from 'react-router-dom';

function PerfilComprador() {
  // Extraemos el usuario guardado en el localStorage por ConfiguracionComprador
  const usuario = JSON.parse(
    localStorage.getItem('usuario')
  ); // Deserializa los datos de sesión almacenados localmente en el navegador para renderizar el perfil dinámico

  // CONFIGURAR RUTA DE LA FOTO DE PERFIL
  let fotoAMostrar = 'https://via.placeholder.com/150'; // Imagen de respaldo por defecto si el usuario no tiene una foto registrada

  if (usuario && usuario.foto_perfil) {
    if (usuario.foto_perfil.startsWith('http')) {
      fotoAMostrar = usuario.foto_perfil; // Si la ruta ya es una URL absoluta externa, la asigna directamente
    } else {
      fotoAMostrar = `http://localhost:3000${usuario.foto_perfil}`; // Si es una ruta relativa local, concatena el host estático de la API
    }
  }

  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-3 text-success">
        Tu Cuenta
      </h2>

      {/* FOTO DE PERFIL DEL COMPRADOR COPIADA EN EL ENCABEZADO */}
      <div className="text-center mb-3">
        <img
          src={fotoAMostrar}
          className="rounded-circle shadow-sm"
          alt="Foto de Perfil"
          width="130"
          height="130"
          style={{ objectFit: 'cover' }} // Propiedad CSS que recorta y encaja la imagen en el círculo sin estirar ni deformar
        />
      </div>

      <p className="text-center text-muted mb-5">
        Bienvenido, {usuario?.nombre || 'Comprador'} {/* Uso de encadenamiento opcional para evitar rupturas si la variable usuario es nula */}
      </p>

      <div className="row g-4 justify-content-center">

        {/* PERFIL */}
        <div className="col-md-4">
          <div className="card text-center border-0 shadow-lg h-100">
            <div className="card-body">
              <i className="bi bi-person-circle text-success display-4 mb-3"></i>
              <h4 className="card-title fw-semibold">
                Perfil
              </h4>
              <p className="card-text">
                Gestiona tu información personal,
                dirección y preferencias.
              </p>
              <Link
                to="/configuracion-comprador"
                className="btn btn-success w-100"
              >
                Ir a Perfil
              </Link>
            </div>
          </div>
        </div>

        {/* PEDIDOS */}
        <div className="col-md-4">
          <div className="card text-center border-0 shadow-lg h-100">
            <div className="card-body">
              <i className="bi bi-bag-check-fill text-success display-4 mb-3"></i>
              <h4 className="card-title fw-semibold">
                Mis Pedidos
              </h4>
              <p className="card-text">
                Revisa el historial de tus compras,
                estados y entregas.
              </p>
              <Link
                to="/mis-pedidos"
                className="btn btn-success w-100"
              >
                Ver Pedidos
              </Link>
            </div>
          </div>
        </div>

        {/* CONFIGURACIÓN */}
        <div className="col-md-4">
          <div className="card text-center border-0 shadow-lg h-100">
            <div className="card-body">
              <i className="bi bi-gear-fill text-success display-4 mb-3"></i>
              <h4 className="card-title fw-semibold">
                Configuración
              </h4>
              <p className="card-text">
                Ajusta preferencias, seguridad
                y notificaciones.
              </p>
              <Link
                to="/configuracion-comprador"
                className="btn btn-success w-100"
              >
                Configuración
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PerfilComprador;