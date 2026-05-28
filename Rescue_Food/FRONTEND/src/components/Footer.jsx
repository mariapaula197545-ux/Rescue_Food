import { Link } from 'react-router-dom';

function Footer() {

  return (

    <footer className="bg-success text-white pt-5 pb-5 mt-5">

      <div className="container">

        <div className="row">

          {/* RESCUE FOOD */}
          <div className="col-md-3 col-sm-6 mb-3">

            <h3>
              Rescue Food
            </h3>

            <ul className="list-unstyled">

              <li>

                <Link
                  to="/servicios"
                  className="text-white text-decoration-none"
                >
                  Nuestros Servicios
                </Link>

              </li>

              <li>

                <Link
                  to="/politicas"
                  className="text-white text-decoration-none"
                >
                  Políticas
                </Link>

              </li>

            </ul>

          </div>

          {/* AYUDA */}
          <div className="col-md-3 col-sm-6 mb-3">

            <h3>
              Ayuda
            </h3>

            <ul className="list-unstyled">

              <li>

                <Link
                  to="/preguntas"
                  className="text-white text-decoration-none"
                >
                  Preguntas Frecuentes
                </Link>

              </li>

              <li>

                <Link
                  to="/pagos"
                  className="text-white text-decoration-none"
                >
                  Opciones De Pago
                </Link>

              </li>

            </ul>

          </div>

          {/* NOSOTROS */}
          <div className="col-md-3 col-sm-6 mb-3">

            <h3>
              Sobre Nosotros
            </h3>

            <ul className="list-unstyled">

              <li>

                <Link
                  to="/quienes-somos"
                  className="text-white text-decoration-none"
                >
                  Quiénes Somos
                </Link>

              </li>

              <li>

                <Link
                  to="/empresa"
                  className="text-white text-decoration-none"
                >
                  Nuestra Empresa
                </Link>

              </li>

            </ul>

          </div>

          {/* REDES */}
          <div className="col-md-3 col-sm-6 mb-3">

            <h3>
              Redes Sociales
            </h3>

            <div className="d-flex gap-3">

              <a
                href="https://facebook.com"
                className="text-white fs-3"
                target="_blank"
              >
                <i className="bi bi-facebook"></i>
              </a>

              <a
                href="https://github.com"
                className="text-white fs-3"
                target="_blank"
              >
                <i className="bi bi-github"></i>
              </a>

              <a
                href="https://instagram.com"
                className="text-white fs-3"
                target="_blank"
              >
                <i className="bi bi-instagram"></i>
              </a>

              <a
                href="mailto:correo@ejemplo.com"
                className="text-white fs-3"
              >
                <i className="bi bi-envelope-fill"></i>
              </a>

              <a
                href="https://tiktok.com"
                className="text-white fs-3"
                target="_blank"
              >
                <i className="bi bi-tiktok"></i>
              </a>

            </div>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;