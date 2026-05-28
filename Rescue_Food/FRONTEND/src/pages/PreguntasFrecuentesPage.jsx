import { useEffect } from 'react';

function PreguntasFrecuentes() {

  useEffect(() => {

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

    <div className="container py-5">

      <div className="card shadow-lg border-0 rounded-4 p-4">

        <h2 className="text-center text-success fw-bold mb-4">
          Preguntas Frecuentes
        </h2>

        {/* ACCORDION */}
        <div className="accordion" id="faqAccordion">

          {/* 1 */}
          <div className="accordion-item">

            <h2 className="accordion-header" id="q1">

              <button
                className="accordion-button fw-semibold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#a1"
              >
                ¿Cómo me registro en RescueFood?
              </button>

            </h2>

            <div
              id="a1"
              className="accordion-collapse collapse show"
              data-bs-parent="#faqAccordion"
            >

              <div className="accordion-body text-muted">
                Puedes registrarte con tu correo y contraseña
                o mediante redes sociales disponibles.
              </div>

            </div>

          </div>

          {/* 2 */}
          <div className="accordion-item">

            <h2 className="accordion-header" id="q2">

              <button
                className="accordion-button collapsed fw-semibold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#a2"
              >
                ¿Es obligatorio registrarme para ver las ofertas?
              </button>

            </h2>

            <div
              id="a2"
              className="accordion-collapse collapse"
              data-bs-parent="#faqAccordion"
            >

              <div className="accordion-body text-muted">
                No, puedes navegar sin registrarte,
                pero para comprar sí necesitas una cuenta.
              </div>

            </div>

          </div>

          {/* 3 */}
          <div className="accordion-item">

            <h2 className="accordion-header" id="q3">

              <button
                className="accordion-button collapsed fw-semibold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#a3"
              >
                ¿Qué tipo de productos puedo encontrar?
              </button>

            </h2>

            <div
              id="a3"
              className="accordion-collapse collapse"
              data-bs-parent="#faqAccordion"
            >

              <div className="accordion-body text-muted">
                Productos de supermercado cercanos a su vencimiento:
                alimentos frescos, enlatados y bebidas.
              </div>

            </div>

          </div>

          {/* 4 */}
          <div className="accordion-item">

            <h2 className="accordion-header" id="q4">

              <button
                className="accordion-button collapsed fw-semibold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#a4"
              >
                ¿Cómo sé la fecha de vencimiento?
              </button>

            </h2>

            <div
              id="a4"
              className="accordion-collapse collapse"
              data-bs-parent="#faqAccordion"
            >

              <div className="accordion-body text-muted">
                Cada producto muestra claramente su fecha de caducidad.
              </div>

            </div>

          </div>

          {/* 5 */}
          <div className="accordion-item">

            <h2 className="accordion-header" id="q5">

              <button
                className="accordion-button collapsed fw-semibold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#a5"
              >
                ¿Son seguros los productos próximos a vencer?
              </button>

            </h2>

            <div
              id="a5"
              className="accordion-collapse collapse"
              data-bs-parent="#faqAccordion"
            >

              <div className="accordion-body text-muted">
                Sí, son seguros hasta la fecha indicada en el empaque.
              </div>

            </div>

          </div>

          {/* 6 */}
          <div className="accordion-item">

            <h2 className="accordion-header" id="q6">

              <button
                className="accordion-button collapsed fw-semibold"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#a6"
              >
                ¿Qué garantía tengo sobre la calidad?
              </button>

            </h2>

            <div
              id="a6"
              className="accordion-collapse collapse"
              data-bs-parent="#faqAccordion"
            >

              <div className="accordion-body text-muted">
                Trabajamos con supermercados confiables
                que garantizan la calidad del producto.
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default PreguntasFrecuentes;