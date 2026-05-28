// GestionarProductos.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';

function GestionarProductos() {
  const token = localStorage.getItem('token'); // Recupera el token para autenticar las peticiones de administración

  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [mensajeExito, setMensajeExito] = useState(false);
  const [mensajeError, setMensajeError] = useState(false);
  const [editando, setEditando] = useState(false); // Estado de control para alternar entre el modo de creación y edición
  const [idEditar, setIdEditar] = useState(null); // Almacena el ID del producto que se está modificando

  // ESTADO ACTUALIZADO (Con vence_en)
  const [form, setForm] = useState({
    categoria_id: '',
    nombre: '',
    precio: '',
    stock: 0,
    descripcion: '',
    imagen_url: null,
    disponible: 1,
    vence_en: '1' // Valor por defecto: 1 día
  });

  // USE EFFECT
  useEffect(() => {
    obtenerProductos();
    obtenerCategorias();
  }, []); // Hook de ciclo de vida que inicializa la vista cargando las categorías fijas y el catálogo del comercio

  // OBTENER PRODUCTOS
  const obtenerProductos = async () => {
    try {
      const response = await axios.get(
        'http://localhost:3000/api/productos/mis-productos',
        {
          headers: {
            Authorization: `Bearer ${token}` // Adjunta el token Bearer para pasar el filtro del middleware en el backend
          }
        }
      );

      const lista = Array.isArray(response.data)
        ? response.data
        : response.data?.data;

      setProductos(Array.isArray(lista) ? lista : []); // Valida la estructura de los datos antes de guardarla en el estado
    } catch (error) {
      console.log(error);
      setProductos([]);
    }
  };

  // CATEGORIAS
  const obtenerCategorias = async () => {
    setCategorias([
      { id: 1, nombre: 'Panadería' },
      { id: 2, nombre: 'Frutas' },
      { id: 3, nombre: 'Verduras' },
      { id: 4, nombre: 'Lácteos' },
      { id: 5, nombre: 'Bebidas' }
    ]); // Setea la lista estática local que alimenta el menú desplegable del formulario
  };

  // HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    }); // Actualiza de forma dinámica las propiedades del formulario usando el nombre del input como clave
  };

  // CREAR / EDITAR
  const crearProducto = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData(); // Instancia FormData para dar soporte a la subida binaria de la imagen
      formData.append('categoria_id', form.categoria_id);
      formData.append('nombre', form.nombre);
      formData.append('precio', form.precio);
      formData.append('stock', form.stock);
      formData.append('descripcion', form.descripcion);
      formData.append('disponible', form.disponible);
      
      // Enviar el número de días al Backend
      formData.append('vence_en', form.vence_en);

      if (form.imagen_url) {
        formData.append('imagen', form.imagen_url); // Adjunta el archivo de imagen capturado en el estado
      }

      if (editando) {
        await axios.put(
          `http://localhost:3000/api/productos/${idEditar}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        ); // Envía una petición PUT si el estado 'editando' es verdadero
      } else {
        await axios.post(
          'http://localhost:3000/api/productos',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        ); // Envía una petición POST convencional si se está registrando un ítem nuevo
      }

      obtenerProductos(); // Recarga el listado de productos directo de la base de datos para reflejar los cambios
      window.dispatchEvent(new Event('productos-actualizados')); // Notifica el cambio mediante un evento global

      setMensajeExito(true);
      setMensajeError(false);

      // Limpieza del Formulario reseteando vence_en a su estado base
      setForm({
        categoria_id: '',
        nombre: '',
        precio: '',
        stock: 0,
        descripcion: '',
        imagen_url: null,
        disponible: 1,
        vence_en: '1'
      });

      setEditando(false);
      setIdEditar(null);
      setTimeout(() => setMensajeExito(false), 3000); // Remueve de pantalla el aviso visual de éxito tras 3 segundos

    } catch (error) {
      console.log(error);
      setMensajeError(true);
    }
  };

  // ELIMINAR
  const eliminarProducto = async (id) => {
    const confirmar = window.confirm('¿Eliminar producto?'); // Lanza un cuadro de diálogo de confirmación nativo antes de borrar
    if (!confirmar) return;

    try {
      await axios.delete(
        `http://localhost:3000/api/productos/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      ); // Envía la solicitud DELETE acoplando el ID del producto en la URL
      obtenerProductos();
      window.dispatchEvent(new Event('productos-actualizados'));
    } catch (error) {
      console.log(error);
    }
  };

  // EDITAR (Carga el valor vence_en del producto)
  const editarProducto = (producto) => {
    setForm({
      categoria_id: producto.categoria_id,
      nombre: producto.nombre,
      precio: producto.precio,
      stock: producto.stock,
      descripcion: producto.descripcion,
      imagen_url: null,
      disponible: producto.disponible,
      vence_en: producto.vence_en ? String(producto.vence_en) : '1'
    }); // Rellena los campos del formulario con los valores actuales del producto seleccionado

    setEditando(true);
    setIdEditar(producto.id);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Desplaza la pantalla suavemente hacia arriba para facilitar la edición
  };

  return (
    <div className="container my-5">
      <h2 className="fw-bold text-success text-center mb-4">
        Gestionar Productos
      </h2>

      {/* FORMULARIO */}
      <div className="card p-4 mb-5 shadow-sm border-0">
        <form onSubmit={crearProducto}>
          
          <label className="form-label fw-semibold">Categoría</label>
          <select
            className="form-select mb-3"
            name="categoria_id"
            value={form.categoria_id}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona categoría</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>
                {c.nombre}
              </option>
            ))}
          </select>

          <label className="form-label fw-semibold">Nombre del Producto</label>
          <input
            className="form-control mb-3"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ej. Pan de trenza"
            required
          />

          <label className="form-label fw-semibold">Precio ($)</label>
          <input
            className="form-control mb-3"
            name="precio"
            value={form.precio}
            onChange={handleChange}
            placeholder="Precio"
            type="number"
            required
          />

          <label className="form-label fw-semibold">Cantidad en Stock</label>
          <input
            className="form-control mb-3"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            type="number"
            required
          />

          <label className="form-label fw-semibold text-success">Tiempo de Vencimiento</label>
          <select
            className="form-select mb-3 border-success"
            name="vence_en"
            value={form.vence_en}
            onChange={handleChange}
            required
          >
            <option value="1">1 Día</option>
            <option value="2">2 Días</option>
            <option value="3">3 Días</option>
            <option value="7">1 Semana (7 Días)</option>
          </select>

          <label className="form-label fw-semibold">Descripción</label>
          <textarea
            className="form-control mb-3"
            name="descripcion"
            value={form.descripcion}
            onChange={handleChange}
            placeholder="Detalles sobre el producto..."
          />

          <label className="form-label fw-semibold">Imagen del Producto</label>
          <input
            type="file"
            className="form-control mb-3"
            onChange={(e) =>
              setForm({ ...form, imagen_url: e.target.files[0] }) // Mapea directamente el archivo binario capturado
            }
          />

          <button className="btn btn-success w-100 py-2 fw-semibold">
            {editando ? 'Actualizar Producto' : 'Guardar Producto'}
          </button>
        </form>

        {mensajeExito && (
          <div className="alert alert-success mt-3 text-center">
            ¡Producto guardado correctamente!
          </div>
        )}

        {mensajeError && (
          <div className="alert alert-danger mt-3 text-center">
            Error al intentar guardar el producto.
          </div>
        )}
      </div>

      {/* RENDERIZADO DE LA LISTA */}
      <div className="row g-4">
        {productos.map(p => (
          <div className="col-md-4" key={p.id}>
            <div className="card h-100 shadow-sm border-0">
              <img
                src={
                  p.imagen_url
                    ? p.imagen_url.startsWith('http')
                      ? p.imagen_url
                      : `http://localhost:3000${p.imagen_url}`
                    : 'https://via.placeholder.com/300'
                }
                className="card-img-top"
                style={{ height: '200px', objectFit: 'cover' }}
                alt={p.nombre}
              />

              <div className="card-body d-flex flex-column">
                <h5 className="fw-bold">{p.nombre}</h5>
                <p className="text-success fw-semibold mb-1">${p.precio}</p>
                
                {p.vence_en && (
                  <p className="text-muted small mb-3">
                    <i className="bi bi-clock-history"></i> Vence en: {p.vence_en} {p.vence_en === 7 ? 'semana' : 'días'}
                  </p>
                )}

                <div className="mt-auto">
                  <button
                    className="btn btn-warning w-100 mb-2 fw-semibold"
                    onClick={() => editarProducto(p)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger w-100 fw-semibold"
                    onClick={() => eliminarProducto(p.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GestionarProductos;