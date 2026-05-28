import { useEffect } from 'react';

function ContactPage() {

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

    <div className="container my-5">

      <h1 className="text-center text-success fw-bold mb-5">
        Contáctanos
      </h1>

      <div className="row align-items-center g-4">

        {/* MAPA */}
        <div className="col-12 col-md-6">

          <div className="ratio ratio-4x3 shadow rounded-4 overflow-hidden">

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.238346344861!2d-75.19666458464594!3d4.438889843053537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e38850f546a7b33%3A0x5e8c4231b8e5a0f7!2sCalle%2014%20%237-77%2C%20Ibagu%C3%A9%2C%20Tolima%2C%20Colombia!5e0!3m2!1ses!2ses!4v1694858100000!5m2!1ses!2ses"
              loading="lazy"
              title="Mapa"
            />

          </div>

        </div>

        {/* INFO */}
        <div className="col-12 col-md-6">

          <div className="p-4 bg-white rounded-4 shadow-sm">

            <h2 className="text-success fw-bold mb-3">
              Visítanos
            </h2>

            <p className="text-secondary mb-4">
              ¿Tienes preguntas, sugerencias o quieres unirte como tienda aliada?
              Estamos aquí para escucharte y ayudarte.
            </p>

            <p className="mb-3">
              📍 <strong>Ibagué, Tolima</strong><br />
              Calle 14 #7-77, Centro
            </p>

            <p className="mb-3">
              📞 <strong>Tel:</strong> +57 300 000 0000<br />
              ✉ <strong>Email:</strong>{' '}
              <a
                href="mailto:contacto@rescuefood.com"
                className="text-success text-decoration-none"
              >
                contacto@rescuefood.com
              </a>
            </p>

            <p>
              🕒 <strong>Horario:</strong><br />
              Lunes a Viernes 8:00 a.m. – 6:00 p.m.
            </p>

          </div>

        </div>

      </div>

    </div>

  );
}

export default ContactPage;