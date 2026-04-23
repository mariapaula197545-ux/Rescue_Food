document.addEventListener('DOMContentLoaded', () => {
  const session = JSON.parse(localStorage.getItem('rescueFoodSession') || 'null');
  if (!session) return;

  const saludo = document.getElementById('saludoComprador');
  if (saludo) {
    saludo.textContent = `Bienvenido, ${session.nombre || 'Comprador'}`;
  }
});
