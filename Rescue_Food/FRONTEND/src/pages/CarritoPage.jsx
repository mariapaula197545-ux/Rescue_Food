
import { useEffect, useState } from 'react';
import { getCarrito, removeItemCarrito } from '../services/carrito.service';

function CarritoPage() {
  const [carrito, setCarrito] = useState([]); // Estado para renderizar los productos agregados al carrito
  const [cargando, setCargando] = useState(true); // Estado de control para mostrar el spinner visual de carga

  useEffect(() => {
    cargarCarrito();
  }, []); // Hook de ciclo de vida que se ejecuta automáticamente al montar la vista en la pantalla

  // CARGAR ITEMS (NUBE O LOCALSTORAGE)
  const cargarCarrito = async () => {
    try {
      setCargando(true);
      const usuario = JSON.parse(localStorage.getItem('usuario')); // Intenta leer si hay datos de sesión en el navegador

      // CASO A: USUARIO LOGUEADO -> CONSUMIR BACKEND
      if (usuario) {
        const response = await getCarrito(usuario.id); // Pide los ítems llamando a la API del servidor por medio del servicio
        
        // Ajustamos al formato que entrega tu carrito.controller ({ data: { items: [...] } })
        const itemsBackend = response?.data?.items || response?.items || [];
        setCarrito(itemsBackend);
      } else {
        // CASO B: INVITADO -> CONSUMIR LOCALSTORAGE
        const itemsLocales = JSON.parse(localStorage.getItem('carrito_invitado')) || []; // Carga los productos locales si el usuario es un visitante anónimo
        setCarrito(itemsLocales);
      }
    } catch (error) {
      console.error("Error al cargar carrito:", error);
      setCarrito([]);
    } finally {
      setCargando(false); // Apaga el spinner de carga sin importar si la petición fue exitosa o falló
    }
  };

  // ELIMINAR ITEM
  const eliminar = async (productoId) => {
    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));

      // CASO A: USUARIO LOGUEADO -> AFECTAR BD
      if (usuario) {
        await removeItemCarrito(usuario.id, productoId); // Envía la petición HTTP DELETE para removerlo de la base de datos
        await cargarCarrito(); // Recargar datos frescos
      } else {
        // CASO B: INVITADO -> AFECTAR LOCALSTORAGE
        let itemsLocales = JSON.parse(localStorage.getItem('carrito_invitado')) || [];
        
        // Filtramos para quitar el producto seleccionado
        itemsLocales = itemsLocales.filter(item => item.producto_id !== productoId); // Usa un filter para excluir del arreglo local el ID del producto eliminado
        
        localStorage.setItem('carrito_invitado', JSON.stringify(itemsLocales));
        setCarrito(itemsLocales); // Actualiza el estado local de React para redibujar la interfaz de inmediato
      }

      // Notificar al Navbar para que actualice el número rojo del carrito en vivo
      window.dispatchEvent(new Event('carrito-actualizado')); // Despacha un evento global personalizado para que otros componentes reaccionen en tiempo real

    } catch (error) {
      console.error("Error al eliminar item:", error);
    }
  };

  // CÁLCULO DEL TOTAL
  const total = carrito.reduce((acc, item) => {
    return acc + Number(item.precio) * Number(item.cantidad);
  }, 0); // Recorre secuencialmente el estado acumulando matemáticamente el costo total de la compra

  if (cargando) {
    return (
      <div className="container text-center my-5 py-5">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando carrito...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5 min-vh-100">
      <h2 className="fw-bold text-success mb-4 text-center">
        <i className="bi bi-cart3 me-2"></i>Mi Carrito de Compras
      </h2>

      <div className="row g-4">
        {/* COLUMNA DE PRODUCTOS */}
        <div className="col-lg-8">
          {carrito.length === 0 ? (
            <div className="card text-center p-5 border-0 shadow-sm rounded-4">
              <i className="bi bi-cart-x display-1 text-muted mb-3"></i>
              <h4 className="fw-semibold text-secondary">Tu carrito está vacío</h4>
              <p className="text-muted">¡Date una vuelta por la pestaña de productos y rescata algo delicioso!</p>
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {carrito.map((item) => (
                <div 
                  className="card p-3 border-0 shadow-sm rounded-4 d-flex flex-row align-items-center" 
                  key={item.id || item.producto_id} // Clave única requerida por React para optimizar el renderizado de listas
                >
                  {/* IMAGEN DE SOPORTE */}
                  <img
                    src={
                      item.imagen_url
                        ? item.imagen_url.startsWith('http')
                          ? item.imagen_url
                          : `http://localhost:3000${item.imagen_url}`
                        : 'https://via.placeholder.com/100'
                    }
                    alt={item.nombre}
                    className="rounded-3 me-3"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />

                  {/* INFORMACIÓN DEL PRODUCTO */}
                  <div className="flex-grow-1">
                    <h5 className="fw-bold mb-1 text-dark">{item.nombre}</h5>
                    <p className="text-success fw-semibold mb-0">${Number(item.precio).toLocaleString()} c/u</p>
                    <small className="text-muted">Cantidad: {item.cantidad}</small>
                  </div>

                  {/* SUBTOTAL Y ACCIÓN */}
                  <div className="text-end ms-3">
                    <span className="d-block fw-bold fs-5 text-dark mb-2">
                      ${(Number(item.precio) * Number(item.cantidad)).toLocaleString()}
                    </span>
                    <button
                      className="btn btn-outline-danger btn-sm rounded-pill px-3"
                      onClick={() => eliminar(item.producto_id)}
                    >
                      <i className="bi bi-trash me-1"></i>Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLUMNA DE RESUMEN DE COMPRA */}
        <div className="col-lg-4">
          <div className="card p-4 border-0 shadow-sm rounded-4 bg-white">
            <h4 className="fw-bold text-dark mb-4 border-bottom pb-2">Resumen</h4>
            
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted">Productos elegidos:</span>
              <span className="fw-semibold text-dark">
                {carrito.reduce((sum, i) => sum + Number(i.cantidad), 0)}
              </span>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4 border-top pt-3">
              <span className="fs-5 fw-bold text-dark">Total a pagar:</span>
              <span className="fs-4 fw-black text-success fw-bold">
                ${total.toLocaleString()}
              </span>
            </div>

            {/* BOTÓN FINAL DE TRANSACCIÓN */}
            <button 
              className="btn btn-success w-100 py-2 fs-5 fw-semibold rounded-pill shadow-sm"
              disabled={carrito.length === 0}
              onClick={() => {
                const usuarioLogueado = localStorage.getItem('usuario');
                if (!usuarioLogueado) {
                  alert('Para finalizar tu compra y rescatar estos alimentos, por favor inicia sesión o crea una cuenta.');
                } else {
                  alert('¡Procesando pedido en la base de datos!');
                }
              }}
            >
              Finalizar Compra
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CarritoPage;