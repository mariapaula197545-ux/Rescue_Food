function NuestrosServicios() {
  return (
    <main className="container py-5">

      <h3 className="text-center text-success fw-bold mb-5">
        Nuestros Servicios
      </h3>

      <div className="row align-items-center">

        <div className="col-md-6">

          <h2 className="fw-bold mb-3">
            Salva Alimentos, <br />
            Ahorra Dinero, Cuida el Planeta.
          </h2>

          <p className="text-muted mb-4">
            En <strong>RescueFood</strong>, conectamos tu hogar con productos de supermercado
            cercanos a su fecha de caducidad, ofreciéndolos a precios increíbles.
            Juntos, reducimos el desperdicio de alimentos y promovemos un consumo consciente.
          </p>

          <a
            href="/nosotros"
            className="btn btn-success px-4 py-2"
          >
            Explora Nuestros Servicios
          </a>

        </div>

        <div className="col-md-6 text-center mt-4 mt-md-0">

          <img
            src="/img/salva.jpg"
            alt="Salvar alimentos"
            className="img-fluid rounded-4 shadow-lg"
            style={{ maxWidth: "400px" }}
          />

        </div>

      </div>

    </main>
  );
}

export default NuestrosServicios;