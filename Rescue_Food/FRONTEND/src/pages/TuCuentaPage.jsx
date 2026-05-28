import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function TuCuenta() {

  const navigate = useNavigate();

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

    <div className="container text-center my-5">

      <h2 className="fw-bold text-success mb-5">
        Selecciona tu rol
      </h2>

      <div className="row justify-content-center g-4">

        {/* COMPRADOR */}
        <div className="col-12 col-md-5">

          <div className="card shadow-lg border-0 rounded-4 h-100">

            <div className="card-body d-flex flex-column align-items-center p-4">

              <img
                src="/img/Usuario.png"
                alt="Comprador"
                className="img-fluid mb-3"
                style={{ width: '120px' }}
              />

              <h3 className="fw-bold mb-4 text-success">
                Comprador
              </h3>

              <div className="d-grid gap-2 w-100">

                <button
                  className="btn btn-outline-success fw-semibold"
                  onClick={() => navigate('/login-comprador')}
                >
                  Iniciar Sesión
                </button>

                <button
                  className="btn btn-success fw-semibold"
                  onClick={() => navigate('/registro-comprador')}
                >
                  Registrarse
                </button>

              </div>

            </div>

          </div>

        </div>

        {/* TIENDA */}
        <div className="col-12 col-md-5">

          <div className="card shadow-lg border-0 rounded-4 h-100">

            <div className="card-body d-flex flex-column align-items-center p-4">

              <img
                src="/img/Tienda.png"
                alt="Tienda"
                className="img-fluid mb-3"
                style={{ width: '120px' }}
              />

              <h3 className="fw-bold mb-4 text-success">
                Tienda
              </h3>

              <div className="d-grid gap-2 w-100">

                <button
                  className="btn btn-outline-success fw-semibold"
                  onClick={() => navigate('/login-tienda')}
                >
                  Iniciar Sesión
                </button>

                <button
                  className="btn btn-success fw-semibold"
                  onClick={() => navigate('/registro-tienda')}
                >
                  Registrarse
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default TuCuenta;