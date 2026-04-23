const API_URL = 'http://127.0.0.1:3000/api';

document.addEventListener('DOMContentLoaded', () => {
  cargarCategorias();
  cargarProductos();
});

async function cargarCategorias() {
  try {
    const res = await fetch(`${API_URL}/categorias`);
    const data = await res.json();

    const select = document.getElementById('filtroCategoria');
    if (!select) return;

    select.innerHTML = `<option value="">Todas</option>`;

    if (data.ok && data.data) {
      data.data.forEach(cat => {
        select.innerHTML += `<option value="${cat.id}">${cat.nombre}</option>`;
      });
    }
  } catch (err) {
    console.error('Error cargando categorías:', err);
  }
}

async function cargarProductos() {
  try {
    const categoria = document.getElementById('filtroCategoria')?.value || '';
    const search = document.getElementById('busqueda')?.value || '';

    let url = `${API_URL}/productos?`;

    if (categoria) url += `categoriaId=${categoria}&`;
    if (search) url += `search=${encodeURIComponent(search)}`;

    const res = await fetch(url);
    const data = await res.json();

    const contenedor = document.getElementById('listaProductos');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (!data.ok || !data.data || data.data.length === 0) {
      contenedor.innerHTML = `
        <div class="col-12">
          <div class="alert alert-warning text-center">
            No hay productos disponibles.
          </div>
        </div>
      `;
      return;
    }

    data.data.forEach(p => {
      contenedor.innerHTML += `
        <div class="col-12 col-md-6 col-lg-4">
          <div class="card h-100 shadow-sm text-center">
            <img
              src="${p.imagen_url || 'https://via.placeholder.com/300x200?text=Producto'}"
              class="card-img-top"
              alt="${p.nombre}"
              style="height: 220px; object-fit: cover;"
            >
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${p.nombre}</h5>
              <p class="card-text">${p.descripcion || 'Sin descripción'}</p>
              <p class="text-muted mb-1"><strong>Categoría:</strong> ${p.categoria_nombre}</p>
              <p class="text-success fw-bold fs-5">$${Number(p.precio).toLocaleString('es-CO')}</p>
              <p class="text-secondary">Stock: ${p.stock}</p>
              <button
                class="btn btn-success mt-auto"
                onclick='agregarAlCarrito(${JSON.stringify({
                  id: null,
                  nombre: ''
                }).replace(/"/g, '&quot;')})'
                data-id="${p.id}"
                data-nombre="${p.nombre}"
                data-precio="${p.precio}"
                data-img="${p.imagen_url || ''}"
              >
                Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      `;
    });

    activarBotonesCarrito();
  } catch (err) {
    console.error('Error cargando productos:', err);
  }
}

function aplicarFiltros() {
  cargarProductos();
}

function activarBotonesCarrito() {
  const botones = document.querySelectorAll('#listaProductos .btn-success');

  botones.forEach(boton => {
    boton.addEventListener('click', () => {
      const producto = {
        id: boton.dataset.id,
        nombre: boton.dataset.nombre,
        precio: boton.dataset.precio,
        img: boton.dataset.img,
        cantidad: 1
      };

      let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      const index = carrito.findIndex(item => item.nombre === producto.nombre);

      if (index !== -1) {
        carrito[index].cantidad += 1;
      } else {
        carrito.push(producto);
      }

      localStorage.setItem('carrito', JSON.stringify(carrito));
      actualizarContadorCarrito();
      alert(producto.nombre + ' se ha añadido al carrito.');
    });
  });
}

function actualizarContadorCarrito() {
  const cartCountSpan = document.getElementById('cartCount');
  let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  if (cartCountSpan) {
    cartCountSpan.innerText = totalItems;
  }
}