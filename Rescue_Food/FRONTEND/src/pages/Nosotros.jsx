import { useEffect } from 'react';

function Nosotros() {
  useEffect(() => {
    // actualizar carrito
    const cartCountSpan = document.getElementById('cartCount');

    const updateCartCount = () => {
      let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);

      if (cartCountSpan) {
        cartCountSpan.innerText = totalItems;
      }
    };

    updateCartCount();
  }, []);

  return (
    <section className="py-5 bg-light text-center">
      <div className="container">

        <h2 className="fw-bold text-dark mb-3">
          Nuestro Impacto Social
        </h2>

        <p className="text-secondary fs-5 mb-5">
          Descubre cómo, juntos, estamos marcando la diferencia.
        </p>

        <h2 className="fw-bold text-dark mb-4">
          Estadísticas Claves
        </h2>

        <div className="row g-4 justify-content-center">

          {/* CARD 1 */}
          <div className="col-12 col-md-4">
            <div className="card shadow rounded p-4 h-100 text-center">
              <img
                src="/img/cuchara.png"
                alt="Alimentos Salvados"
                className="mx-auto mb-3"
                style={{ width: '60px', height: '60px' }}
              />
              <h3 className="fw-bold text-dark mb-2">+500.000 kg</h3>
              <p className="text-secondary mb-0">Alimentos Salvados</p>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="col-12 col-md-4">
            <div className="card shadow rounded p-4 h-100 text-center">
              <img
                src="/img/usuarios.png"
                alt="Comidas Servidas"
                className="mx-auto mb-3"
                style={{ width: '60px', height: '60px' }}
              />
              <h3 className="fw-bold text-dark mb-2">+150.000</h3>
              <p className="text-secondary mb-0">Comidas Servidas</p>
            </div>
          </div>

          {/* CARD 3 */}
          <div className="col-12 col-md-4">
            <div className="card shadow rounded p-4 h-100 text-center">
              <img
                src="/img/hoja.png"
                alt="CO₂ Reducido"
                className="mx-auto mb-3"
                style={{ width: '60px', height: '60px' }}
              />
              <h3 className="fw-bold text-dark mb-2">-800.000 kg</h3>
              <p className="text-secondary mb-0">CO₂ Reducido</p>
            </div>
          </div>

        </div>

        {/* HISTORIAS */}
        <h2 className="fw-bold text-dark mt-5 mb-4">
          Historias de impacto
        </h2>

        <div className="row g-4 justify-content-center">

          <div className="col-12 col-md-6">
            <div className="card shadow rounded p-4 h-100">
              <p className="text-secondary mb-3">
                "Gracias a RescueFood, mi familia ha podido acceder a alimentos frescos y de calidad a precios que podemos pagar. Es una bendición."
              </p>
              <div className="fw-bold text-dark">María G.</div>
              <div className="text-secondary">Beneficiaria de la comunidad</div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card shadow rounded p-4 h-100">
              <p className="text-secondary mb-3">
                "Como dueño de una panadería, me dolía tirar los productos del día. RescueFood nos permite reducir el desperdicio y llegar a más clientes."
              </p>
              <div className="fw-bold text-dark">Javier R.</div>
              <div className="text-secondary">Propietario de Panadería 'El Horno'</div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card shadow rounded p-4 h-100">
              <p className="text-secondary mb-3">
                "Es increíble cómo algo tan simple puede tener un impacto tan grande. Me siento bien sabiendo que mis compras ayudan al planeta."
              </p>
              <div className="fw-bold text-dark">Cliente satisfecho</div>
              <div className="text-secondary">Consumidor responsable</div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default Nosotros;