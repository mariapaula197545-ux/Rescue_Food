import { useEffect } from 'react';
import { Link } from 'react-router-dom';

function Inicio() {

  useEffect(() => {

    // activar contador carrito
    const cartCountSpan = document.getElementById('cartCount');

    const updateCartCount = () => {
      const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      const totalItems = carrito.reduce(
        (acc, item) => acc + item.cantidad,
        0
      );

      if (cartCountSpan) {
        cartCountSpan.innerText = totalItems;
      }
    };

    updateCartCount();

  }, []);

  return (

    <div>

      {/* HERO PRINCIPAL */}
      <section className="text-center py-5 bg-light text-success">

        <div className="container">

          <h1 className="fw-bold mb-3">
            ¡Empieza a salvar comida!
          </h1>

          <p
            className="fs-5 mx-auto mb-4"
            style={{ maxWidth: '700px' }}
          >
            Rescata productos próximos a vencer.
            Conéctate con tiendas locales,
            encuentra alimentos de calidad a precios reducidos
            y ayuda a combatir el desperdicio de alimentos.
          </p>

          <div>

            <Link
              to="/tiendas"
              className="btn btn-success btn-lg me-2"
            >
              Ver Tiendas
            </Link>

            <Link
              to="/productos"
              className="btn btn-outline-success btn-lg"
            >
              Explorar Productos
            </Link>

          </div>

        </div>

      </section>

      {/* COMO FUNCIONA */}
      <section className="py-5 bg-white text-center">

        <div className="container">

          <h2 className="text-success fw-bold mb-5">
            ¿Cómo funciona?
          </h2>

          <div className="row g-4 justify-content-center">

            {/* TARJETA 1 */}
            <div className="col-12 col-md-4">

              <div className="card border-0 shadow h-100 p-4">

                <img
                  src="/img/lupa.webp"
                  alt="Ofertas"
                  style={{ width: '100px', height: '100px' }}
                  className="mx-auto mb-3"
                />

                <div className="card-body">

                  <h5 className="card-title text-success fw-bold">
                    Descubre Ofertas
                  </h5>

                  <p className="card-text text-secondary">
                    Encuentra productos frescos cercanos con grandes descuentos.
                  </p>

                </div>

              </div>

            </div>

            {/* TARJETA 2 */}
            <div className="col-12 col-md-4">

              <div className="card border-0 shadow h-100 p-4">

                <img
                  src="/img/bolsa.webp"
                  alt="Reserva"
                  style={{ width: '100px', height: '100px' }}
                  className="mx-auto mb-3"
                />

                <div className="card-body">

                  <h5 className="card-title text-success fw-bold">
                    Elige y Reserva
                  </h5>

                  <p className="card-text text-secondary">
                    Selecciona productos y agrégalos al carrito fácilmente.
                  </p>

                </div>

              </div>

            </div>

            {/* TARJETA 3 */}
            <div className="col-12 col-md-4">

              <div className="card border-0 shadow h-100 p-4">

                <img
                  src="/img/ahorra.png"
                  alt="Ahorra"
                  style={{ width: '100px', height: '100px' }}
                  className="mx-auto mb-3"
                />

                <div className="card-body">

                  <h5 className="card-title text-success fw-bold">
                    Ahorra y Recoge
                  </h5>

                  <p className="card-text text-secondary">
                    Paga seguro y recoge en tienda.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Inicio;