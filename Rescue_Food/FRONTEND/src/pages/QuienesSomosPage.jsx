import { useEffect } from 'react';

function QuienesSomos() {

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

      {/* TITULO */}
      <h2 className="text-center text-success fw-bold mb-4">
        Quiénes Somos
      </h2>

      <p className="text-center mb-5">
        Conoce la historia, la misión y los valores que nos impulsan
        a construir un futuro más sostenible.
      </p>

      <div className="row align-items-center">

        {/* TEXTO */}
        <div className="col-md-7">

          <h3 className="text-success fw-semibold mb-3">
            Nuestra Historia: De Ibagué al Mundo
          </h3>

          <p>
            <b>RescueFood</b> nació en Ibagué con una visión clara:
            combatir el desperdicio de alimentos y hacer que la comida
            de calidad sea accesible para todos.
            Lo que comenzó como una pequeña iniciativa local
            rápidamente se convirtió en una plataforma digital
            que hoy impacta a miles.
          </p>

          <p>
            Desde nuestros comienzos, hemos crecido de la mano con la comunidad,
            fomentando un consumo consciente y responsable.
          </p>

        </div>

        {/* IMAGEN */}
        <div className="col-md-5 text-center">

          <img
            src="/img/iba.jpg"
            alt="Ibagué"
            className="img-fluid rounded shadow-sm"
          />

        </div>

      </div>

    </div>

  );
}

export default QuienesSomos;