const API_BASE = 'http://127.0.0.1:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formTienda');
  const outputMessage = document.getElementById('mensajeRespuestaTienda');

  if (!form || !outputMessage) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = {
      nombre: document.getElementById('nombre')?.value.trim(),
      email: document.getElementById('email')?.value.trim(),
      telefono: document.getElementById('telefono')?.value.trim(),
      direccion: document.getElementById('direccion')?.value.trim(),
      horario: document.getElementById('horario')?.value,
      password: document.getElementById('password')?.value.trim()
    };

    outputMessage.textContent = 'Enviando...';

    try {
      const response = await fetch(`${API_BASE}/auth/register/tienda`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        outputMessage.textContent = `❌ ${result.msg || 'No se pudo registrar la tienda'}`;
        return;
      }

      outputMessage.textContent = `✅ ${result.msg}`;
      form.reset();
      setTimeout(() => {
        window.location.href = 'IniciarSesionTienda.html';
      }, 1200);
    } catch (error) {
      outputMessage.textContent = `⚠️ Error de conexión: ${error.message}`;
    }
  });
});
