const API_BASE = 'http://127.0.0.1:3000/api';

const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem('rescueFoodSession') || 'null');
  } catch {
    return null;
  }
};

const setSession = (session) => {
  localStorage.setItem('rescueFoodSession', JSON.stringify(session));
};

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('formConfiguracionComprador');
  const message = document.getElementById('mensajePerfilComprador');
  const session = getSession();

  if (!form || !message) return;

  if (!session || !session.id) {
    message.textContent = 'Debes iniciar sesión como comprador para editar tu perfil.';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/usuarios/${session.id}`);
    const result = await response.json();

    if (!response.ok) {
      message.textContent = `❌ ${result.msg || 'No se pudo cargar el perfil'}`;
      return;
    }

    document.getElementById('nombre').value = result.data.nombre || '';
    document.getElementById('email').value = result.data.email || '';
    document.getElementById('direccion').value = result.data.direccion || '';
    document.getElementById('foto_perfil').value = result.data.foto_perfil || '';
  } catch (error) {
    message.textContent = `⚠️ Error de conexión: ${error.message}`;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      nombre: document.getElementById('nombre').value.trim(),
      email: document.getElementById('email').value.trim(),
      direccion: document.getElementById('direccion').value.trim(),
      foto_perfil: document.getElementById('foto_perfil').value.trim() || null
    };

    message.textContent = 'Guardando cambios...';

    try {
      const response = await fetch(`${API_BASE}/usuarios/${session.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) {
        message.textContent = `❌ ${result.msg || 'No se pudo actualizar el perfil'}`;
        return;
      }

      setSession({
        ...session,
        nombre: result.data.nombre,
        email: result.data.email,
        direccion: result.data.direccion,
        foto_perfil: result.data.foto_perfil
      });

      message.textContent = `✅ ${result.msg}`;
    } catch (error) {
      message.textContent = `⚠️ Error de conexión: ${error.message}`;
    }
  });
});
