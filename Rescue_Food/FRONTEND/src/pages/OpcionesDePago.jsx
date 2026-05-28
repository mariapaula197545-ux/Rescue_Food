function OpcionesPago() {
  return (
    <div className="container py-5">

      <h2 className="text-center text-success fw-bold mb-5">
        Opciones de Pago
      </h2>

      <div className="row g-4">

        <div className="col-md-4 text-center">
          <div className="card h-100 shadow-sm border-success">
            <div className="card-body">
              <img
                src="/img/credito.jpg"
                alt="Tarjetas"
                className="mb-3"
                width="120"
              />
              <h5 className="fw-bold text-success">
                Tarjetas de Crédito/Débito
              </h5>
              <p>
                Aceptamos las principales tarjetas para pagos rápidos y seguros.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 text-center">
          <div className="card h-100 shadow-sm border-success">
            <div className="card-body">
              <img
                src="/img/pse.png"
                alt="PSE"
                className="mb-3"
                width="120"
              />
              <h5 className="fw-bold text-success">
                PSE (Pagos en línea)
              </h5>
              <p>
                Realiza pagos directos desde tu cuenta bancaria.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 text-center">
          <div className="card h-100 shadow-sm border-success">
            <div className="card-body">
              <img
                src="/img/tra.jpg"
                alt="Transferencias"
                className="mb-3"
                width="120"
              />
              <h5 className="fw-bold text-success">
                Transferencias Electrónicas
              </h5>
              <p>
                Transferencias bancarias directas y seguras.
              </p>
            </div>
          </div>
        </div>

      </div>

      <div className="row g-4 mt-3">

        <div className="col-md-4 text-center">
          <div className="card h-100 shadow-sm border-success">
            <div className="card-body">
              <img
                src="/img/nequi.webp"
                alt="Nequi"
                className="mb-3"
                width="120"
              />
              <h5 className="fw-bold text-success">Nequi</h5>
              <p>
                Paga fácil desde tu celular con Nequi.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 text-center">
          <div className="card h-100 shadow-sm border-success">
            <div className="card-body">
              <img
                src="/img/davi.jpg"
                alt="Daviplata"
                className="mb-3"
                width="120"
              />
              <h5 className="fw-bold text-success">Daviplata</h5>
              <p>
                Pagos móviles rápidos y seguros.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 text-center">
          <div className="card h-100 shadow-sm border-success">
            <div className="card-body">
              <img
                src="/img/pago.webp"
                alt="Contra entrega"
                className="mb-3"
                width="120"
              />
              <h5 className="fw-bold text-success">
                Pago Contra Entrega
              </h5>
              <p>
                Paga en efectivo cuando recibas tu pedido.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default OpcionesPago;