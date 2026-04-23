const API_BASE = 'http://127.0.0.1:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formLoginTienda');
  if (!form) return;

  let outputMessage = document.getElementById('mensajeRespuestaTienda');
  if (!outputMessage) {
    outputMessage = document.createElement('div');
    outputMessage.id = 'mensajeRespuestaTienda';
    outputMessage.classList.add('mt-3');
    form.appendChild(outputMessage);
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = {
      email: document.getElementById('email')?.value.trim(),
      password: document.getElementById('password')?.value.trim()
    };

    outputMessage.textContent = 'Verificando...';

    try {
      const response = await fetch(`${API_BASE}/auth/login/tienda`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (!response.ok) {
        outputMessage.textContent = `❌ ${result.msg || 'No fue posible iniciar sesión'}`;
        return;
      }

      localStorage.setItem('rescueFoodSession', JSON.stringify(result.data));
      outputMessage.textContent = `✅ ${result.msg}`;
      window.location.href = 'PerfilTienda.html';
    } catch (error) {
      outputMessage.textContent = `⚠️ Error de conexión: ${error.message}`;
    }
  });
});
