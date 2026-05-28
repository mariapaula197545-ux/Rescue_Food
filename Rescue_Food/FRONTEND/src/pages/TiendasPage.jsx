function Tiendas() {

  return (

    <div className="py-5 bg-light text-center">

      <div className="container">

        <h1 className="fw-bold text-success mb-5">
          Tiendas Aliadas
        </h1>

        <div className="row g-4 justify-content-center">

          {/* MERCACENTRO */}
          <div className="col-12 col-md-4">

            <a
              href="https://www.mercacentro.com"
              target="_blank"
              rel="noreferrer"
              className="card border-0 shadow-sm p-4 text-decoration-none hover-card"
            >

              <img
                src="/img/mercacentro.png"
                alt="Mercacentro"
                className="img-fluid mx-auto d-block"
                style={{ width: '150px', height: '150px' }}
              />

            </a>

          </div>

          {/* ARA */}
          <div className="col-12 col-md-4">

            <a
              href="https://aratiendas.com/"
              target="_blank"
              rel="noreferrer"
              className="card border-0 shadow-sm p-4 text-decoration-none hover-card"
            >

              <img
                src="/img/ara.webp"
                alt="Ara"
                className="img-fluid mx-auto d-block"
                style={{ width: '150px', height: '150px' }}
              />

            </a>

          </div>

          {/* D1 */}
          <div className="col-12 col-md-4">

            <a
              href="https://d1.com.co/"
              target="_blank"
              rel="noreferrer"
              className="card border-0 shadow-sm p-4 text-decoration-none hover-card"
            >

              <img
                src="/img/d1.webp"
                alt="D1"
                className="img-fluid mx-auto d-block"
                style={{ width: '150px', height: '150px' }}
              />

            </a>

          </div>

          {/* ISIMO */}
          <div className="col-12 col-md-4">

            <a
              href="https://tiendasisimo.com/somo-isimo/"
              target="_blank"
              rel="noreferrer"
              className="card border-0 shadow-sm p-4 text-decoration-none hover-card"
            >

              <img
                src="/img/isimo.webp"
                alt="Isimo"
                className="img-fluid mx-auto d-block"
                style={{ width: '150px', height: '150px' }}
              />

            </a>

          </div>

          {/* SURTIPLAZA */}
          <div className="col-12 col-md-4">

            <a
              href="https://www.surtiplaza.co"
              target="_blank"
              rel="noreferrer"
              className="card border-0 shadow-sm p-4 text-decoration-none hover-card"
            >

              <img
                src="/img/surti.png"
                alt="Surtiplaza"
                className="img-fluid mx-auto d-block"
                style={{ width: '150px', height: '150px' }}
              />

            </a>

          </div>

          {/* EXITO */}
          <div className="col-12 col-md-4">

            <a
              href="https://www.exito.com/"
              target="_blank"
              rel="noreferrer"
              className="card border-0 shadow-sm p-4 text-decoration-none hover-card"
            >

              <img
                src="/img/exito.webp"
                alt="Éxito"
                className="img-fluid mx-auto d-block"
                style={{ width: '150px', height: '150px' }}
              />

            </a>

          </div>

        </div>

      </div>

    </div>

  );
}

export default Tiendas;