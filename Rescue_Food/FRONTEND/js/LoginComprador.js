const API_BASE = 'http://127.0.0.1:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formLoginComprador');
  const outputMessage = document.getElementById('mensajeRespuestaComprador');

  if (!form || !outputMessage) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const data = {
      email: document.getElementById('emailComprador')?.value.trim(),
      password: document.getElementById('passwordComprador')?.value.trim()
    };

    outputMessage.textContent = 'Verificando...';

    try {
      const response = await fetch(`${API_BASE}/auth/login/comprador`, {
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
      window.location.href = 'PerfilComprador.html';
    } catch (error) {
      outputMessage.textContent = `⚠️ Error de conexión: ${error.message}`;
    }
  });
});
