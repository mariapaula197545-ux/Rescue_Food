const API_URL = 'http://127.0.0.1:3000/api';
const usuarioId = localStorage.getItem('usuarioId');

document.addEventListener('DOMContentLoaded', () => {
  if (!usuarioId) {
    alert('Debes iniciar sesión como tienda');
    return;
  }

  cargarCategorias();
  cargarMisProductos();
});

async function cargarCategorias() {
  try {
    const res = await fetch(`${API_URL}/categorias`);
    const data = await res.json();

    const select = document.getElementById('categoria');
    if (!select) return;

    select.innerHTML = '<option value="">Seleccione una categoría</option>';

    if (data.ok && data.data) {
      data.data.forEach(cat => {
        select.innerHTML += `
          <option value="${cat.id}">${cat.nombre}</option>
        `;
      });
    }
  } catch (err) {
    console.error('Error cargando categorías:', err);
  }
}

async function cargarMisProductos() {
  try {
    const res = await fetch(`${API_URL}/productos/tienda/${usuarioId}/mis-productos`);
    const data = await res.json();

    const contenedor = document.getElementById('misProductos');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (!data.ok || !data.data || data.data.length === 0) {
      contenedor.innerHTML = `
        <div class="col-12">
          <div class="alert alert-warning text-center">
            No has registrado productos todavía.
          </div>
        </div>
      `;
      return;
    }

    data.data.forEach(p => {
      contenedor.innerHTML += `
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm">
            <img
              src="${p.imagen_url || 'https://via.placeholder.com/300x200?text=Producto'}"
              class="card-img-top"
              alt="${p.nombre}"
              style="height: 220px; object-fit: cover;"
            >
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${p.nombre}</h5>
              <p class="card-text">${p.descripcion || 'Sin descripción'}</p>
              <p class="mb-1"><strong>Categoría:</strong> ${p.categoria_nombre}</p>
              <p class="mb-1"><strong>Precio:</strong> $${Number(p.precio).toLocaleString('es-CO')}</p>
              <p class="mb-3"><strong>Stock:</strong> ${p.stock}</p>
              <button class="btn btn-danger mt-auto" onclick="eliminarProducto(${p.id})">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      `;
    });
  } catch (err) {
    console.error('Error cargando productos de la tienda:', err);
  }
}

async function crearProducto(event) {
  event.preventDefault();

  const payload = {
    categoria_id: document.getElementById('categoria').value,
    nombre: document.getElementById('nombre').value.trim(),
    descripcion: document.getElementById('descripcion').value.trim(),
    precio: document.getElementById('precio').value,
    stock: document.getElementById('stock').value,
    imagen_url: document.getElementById('imagen').value.trim(),
    disponible: 1
  };

  ocultarMensajes();

  try {
    const res = await fetch(`${API_URL}/productos/tienda/${usuarioId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const result = await res.json();

    if (!result.ok) {
      mostrarError(result.msg || 'No se pudo registrar el producto');
      return;
    }

    mostrarExito('Producto registrado con éxito');
    document.getElementById('formProducto').reset();
    cargarMisProductos();
  } catch (err) {
    console.error('Error creando producto:', err);
    mostrarError('Ocurrió un error al guardar el producto');
  }
}

async function eliminarProducto(id) {
  const confirmar = confirm('¿Seguro que quieres eliminar este producto?');
  if (!confirmar) return;

  try {
    const res = await fetch(`${API_URL}/productos/tienda/${usuarioId}/${id}`, {
      method: 'DELETE'
    });

    const result = await res.json();

    if (!result.ok) {
      alert(result.msg || 'No se pudo eliminar el producto');
      return;
    }

    cargarMisProductos();
  } catch (err) {
    console.error('Error eliminando producto:', err);
  }
}

function mostrarExito(msg) {
  const div = document.getElementById('mensajeExito');
  const errorDiv = document.getElementById('mensajeError');

  if (errorDiv) errorDiv.style.display = 'none';
  if (div) {
    div.innerText = msg;
    div.style.display = 'block';
    setTimeout(() => {
      div.style.display = 'none';
    }, 3000);
  }
}

function mostrarError(msg) {
  const div = document.getElementById('mensajeError');
  const okDiv = document.getElementById('mensajeExito');

  if (okDiv) okDiv.style.display = 'none';
  if (div) {
    div.innerText = msg;
    div.style.display = 'block';
    setTimeout(() => {
      div.style.display = 'none';
    }, 4000);
  }
}

function ocultarMensajes() {
  const okDiv = document.getElementById('mensajeExito');
  const errorDiv = document.getElementById('mensajeError');

  if (okDiv) okDiv.style.display = 'none';
  if (errorDiv) errorDiv.style.display = 'none';
}