// ProductosPage.jsx
import { useEffect, useState } from 'react';
import { getProductos } from '../services/productos.service';
import { addToCarrito } from '../services/carrito.service';
import axios from 'axios'; // Importamos axios para traer las categorías dinámicas

function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [categorias, setCategorias] = useState([]); // 🔥 ESTADO DINÁMICO PARA LAS CATEGORÍAS
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');

  // =====================================
  // CARGAR PRODUCTOS Y CATEGORÍAS
  // =====================================
  const cargarDatosIniciales = async () => {
    try {
      // 1. Traer Productos
      const responseProd = await getProductos();
      const lista = responseProd?.data || responseProd || [];
      const productosArray = Array.isArray(lista) ? lista : [];
      setProductos(productosArray);
      setProductosFiltrados(productosArray);

      // 2. 🔥 TRAER CATEGORÍAS REALES DEL BACKEND
      // Ajusta esta URL a tu endpoint real de categorías (ej: /api/categorias)
      const responseCat = await axios.get('http://localhost:3000/api/categorias');
      const listaCat = responseCat.data?.data || responseCat.data || [];
      setCategorias(listaCat);

    } catch (error) {
      console.error("Error al cargar datos del catálogo:", error);
      // Si falla el backend de categorías, ponemos unas por defecto para que no se rompa la app
      setCategorias([
        { id: 1, nombre: 'Panadería' },
        { id: 2, nombre: 'Frutas' },
        { id: 3, nombre: 'Verduras' },
        { id: 4, nombre: 'Lácteos' },
        { id: 5, nombre: 'Bebidas' }
      ]);
    }
  };

  // =====================================
  // USE EFFECT
  // =====================================
  useEffect(() => {
    cargarDatosIniciales();

    const recargar = () => cargarDatosIniciales();
    window.addEventListener('productos-actualizados', recargar);

    return () => {
      window.removeEventListener('productos-actualizados', recargar);
    };
  }, []);

  // =====================================
  // FILTROS
  // =====================================
  const aplicarFiltros = (texto, categoriaSeleccionada) => {
    let resultado = [...productos];

    if (texto) {
      resultado = resultado.filter((p) =>
        p.nombre?.toLowerCase().includes(texto.toLowerCase())
      );
    }

    if (categoriaSeleccionada) {
      resultado = resultado.filter(
        (p) => String(p.categoria_id) === String(categoriaSeleccionada)
      );
    }

    setProductosFiltrados(resultado);
  };

  const handleBusqueda = (e) => {
    const valor = e.target.value;
    setBusqueda(valor);
    aplicarFiltros(valor, categoria);
  };

  const handleCategoria = (e) => {
    const valor = e.target.value;
    setCategoria(valor);
    aplicarFiltros(busqueda, valor);
  };

  // =====================================
  // CARRITO DINÁMICO
  // =====================================
  const agregar = async (producto) => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));

      if (usuario) {
        await addToCarrito(usuario.id, producto.id);
        alert('Producto agregado al carrito');
        return;
      }

      let carritoInvitado = JSON.parse(localStorage.getItem('carrito_invitado')) || [];
      const itemExistenteIndex = carritoInvitado.findIndex(item => item.producto_id === producto.id);

      if (itemExistenteIndex !== -1) {
        carritoInvitado[itemExistenteIndex].cantidad += 1;
      } else {
        carritoInvitado.push({
          producto_id: producto.id,
          nombre: producto.nombre,
          precio: Number(producto.precio),
          descripcion: producto.descripcion,
          imagen_url: producto.imagen_url,
          cantidad: 1
        });
      }

      localStorage.setItem('carrito_invitado', JSON.stringify(carritoInvitado));
      window.dispatchEvent(new Event('carrito-actualizado'));
      alert('Producto agregado al carrito local');
    } catch (error) {
      console.log(error);
      alert('Error al agregar al carrito');
    }
  };

  return (
    <section className="py-5 bg-light min-vh-100">
      <div className="container">
        <h2 className="text-center fw-bold text-success mb-5">
          Productos Disponibles
        </h2>

        {/* FILTROS */}
        <div className="row mb-4 g-3">
          <div className="col-12 col-md-4">
            
            {/* ✅ SELECTOR 100% DINÁMICO: Recorre las categorías de la base de datos */}
            <select
              className="form-select"
              value={categoria}
              onChange={handleCategoria}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre}
                </option>
              ))}
            </select>

          </div>

          <div className="col-12 col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={handleBusqueda}
            />
          </div>
        </div>

        {/* PRODUCTOS */}
        <div className="row g-4">
          {productosFiltrados.map((producto) => (
            <div className="col-12 col-md-6 col-lg-4" key={producto.id}>
              <div className="card h-100 shadow border-0">
                <img
                  src={
                    producto.imagen_url?.startsWith('http')
                      ? producto.imagen_url
                      : `http://localhost:3000${producto.imagen_url}`
                  }
                  className="card-img-top"
                  style={{ height: '250px', objectFit: 'cover' }}
                  alt={producto.nombre}
                />

                <div className="card-body d-flex flex-column">
                  <h5 className="fw-bold mb-1">{producto.nombre}</h5>
                  
                  <p className="text-muted small mb-2">
                    <i className="bi bi-shop text-success me-1"></i>
                    Ofrecido por: <span className="fw-semibold text-dark">{producto.nombre_tienda || 'Tienda Local'}</span>
                  </p>

                  <p className="text-secondary card-text flex-grow-1">
                    {producto.descripcion}
                  </p>

                  <div className="mb-3 p-2 bg-light rounded border-start border-warning border-3">
                    <small className="text-dark d-block fw-medium">
                      <i className="bi bi-clock-history text-warning me-1"></i>
                      Vence en: {producto.vence_en} {Number(producto.vence_en) === 7 ? 'Semana (7 días)' : Number(producto.vence_en) === 1 ? 'Día' : 'Días'}
                    </small>
                  </div>

                  <h4 className="text-success fw-bold mb-3">
                    ${producto.precio}
                  </h4>

                  <button
                    className="btn btn-success w-100 py-2 mt-auto fw-medium"
                    onClick={() => agregar(producto)}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ProductosPage;