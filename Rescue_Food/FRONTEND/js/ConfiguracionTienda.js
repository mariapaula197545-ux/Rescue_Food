const API_BASE = 'http://127.0.0.1:3000/api';

const getStoreSession = () => {
  try {
    return JSON.parse(localStorage.getItem('rescueFoodSession') || 'null');
  } catch {
    return null;
  }
};

const setStoreSession = (session) => {
  localStorage.setItem('rescueFoodSession', JSON.stringify(session));
};

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('formConfiguracionTienda');
  const message = document.getElementById('mensajeConfiguracionTienda');
  const session = getStoreSession();

  if (!form || !message) return;

  if (!session || !session.id) {
    message.textContent = 'Debes iniciar sesión como tienda para editar esta información.';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/tiendas/usuario/${session.id}`);
    const result = await response.json();

    if (!response.ok) {
      message.textContent = `❌ ${result.msg || 'No se pudo cargar la tienda'}`;
      return;
    }

    document.getElementById('nombre').value = result.data.nombre || '';
    document.getElementById('nombre_tienda').value = result.data.nombre_tienda || '';
    document.getElementById('email').value = result.data.email || '';
    document.getElementById('telefono').value = result.data.telefono || '';
    document.getElementById('direccion').value = result.data.direccion || '';
    document.getElementById('horario').value = result.data.horario || '';
    document.getElementById('logo_url').value = result.data.logo_url || '';
  } catch (error) {
    message.textContent = `⚠️ Error de conexión: ${error.message}`;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const payload = {
      nombre: document.getElementById('nombre').value.trim(),
      nombre_tienda: document.getElementById('nombre_tienda').value.trim(),
      email: document.getElementById('email').value.trim(),
      telefono: document.getElementById('telefono').value.trim(),
      direccion: document.getElementById('direccion').value.trim(),
      horario: document.getElementById('horario').value.trim(),
      logo_url: document.getElementById('logo_url').value.trim() || null
    };

    message.textContent = 'Guardando cambios...';

    try {
      const response = await fetch(`${API_BASE}/tiendas/usuario/${session.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (!response.ok) {
        message.textContent = `❌ ${result.msg || 'No se pudo actualizar la tienda'}`;
        return;
      }

      setStoreSession({
        ...session,
        nombre: result.data.nombre,
        email: result.data.email,
        tienda: {
          ...(session.tienda || {}),
          id: result.data.id,
          nombre_tienda: result.data.nombre_tienda,
          telefono: result.data.telefono,
          horario: result.data.horario,
          logo_url: result.data.logo_url
        }
      });

      message.textContent = `✅ ${result.msg}`;
    } catch (error) {
      message.textContent = `⚠️ Error de conexión: ${error.message}`;
    }
  });
});
