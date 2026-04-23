document.addEventListener('DOMContentLoaded', () => {
  const session = JSON.parse(localStorage.getItem('rescueFoodSession') || 'null');
  if (!session) return;

  const nombreTienda = document.getElementById('nombreTiendaPerfil');
  if (nombreTienda) {
    nombreTienda.textContent = session.tienda?.nombre_tienda || session.nombre || 'Mi Tienda';
  }

  const nombreCuenta = document.getElementById('nombreCuentaTienda');
  if (nombreCuenta) {
    nombreCuenta.textContent = session.nombre || 'Cuenta de tienda';
  }

  const logo = document.getElementById('logoTiendaPerfil');
  if (logo && session.tienda?.logo_url) {
    logo.src = session.tienda.logo_url;
  }
});
