function NuestraEmpresa() {
  return (
    <div className="container my-5">

      <h2 className="text-success text-center mb-4">
        Nuestra Empresa
      </h2>

      <p className="text-center mb-5">
        <b>RescueFood SAS</b> se dedica a reducir el desperdicio de alimentos conectando supermercados con consumidores
        a través de una plataforma sostenible y accesible. Conoce más sobre nuestra misión y cómo contribuimos a un futuro más verde.
      </p>

      <h3 className="text-success text-center mb-4">
        Nuestra Oficina y Contacto
      </h3>

      <div className="row row-cols-1 row-cols-md-2 g-4">

        <div className="col">

          <div className="card border-success h-100 text-center shadow-sm">

            <div className="card-body">

              <img
                src="/img/Ubicacion.png"
                alt="Ubicación"
                width="60"
                className="mb-3"
              />

              <h5 className="text-success">
                Nuestra Ubicación
              </h5>

              <p>
                Carrera 5 # 30-50 <br />
                Ibagué, Tolima <br />
                Colombia
              </p>

            </div>

          </div>

        </div>

        <div className="col">

          <div className="card border-success h-100 text-center shadow-sm">

            <div className="card-body">

              <img
                src="/img/Mensaje.png"
                alt="Contacto"
                width="60"
                className="mb-3"
              />

              <h5 className="text-success">
                Contáctanos
              </h5>

              <p>
                <a
                  href="mailto:info@rescuefood.co"
                  className="text-success text-decoration-none"
                >
                  info@rescuefood.co
                </a>
                <br />
                +57 (608) 265-4321
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default NuestraEmpresa;