function PoliticasPrivacidad() {
  return (
    <div className="container py-5">

      <div className="card shadow-lg border-0 rounded-4 p-4">

        <h2 className="text-center text-success fw-bold mb-4">
          Política de Privacidad
        </h2>

        <p className="text-muted">
          En <strong>RescueFood</strong>, valoramos su privacidad y nos comprometemos a proteger su información personal.
          Esta política describe cómo recopilamos, usamos y divulgamos su información cuando utiliza nuestra plataforma.
        </p>

        <h3 className="text-success mt-4 mb-2">
          Recopilación de Datos
        </h3>

        <p className="text-muted">
          Recopilamos información que usted nos proporciona directamente, como nombre, correo electrónico,
          ubicación y detalles de pago. También datos técnicos como IP o dispositivo.
        </p>

        <h3 className="text-success mt-4 mb-2">
          Uso de la Información
        </h3>

        <p className="text-muted mb-2">
          Utilizamos su información para:
        </p>

        <ul className="text-muted">
          <li>Proporcionar y mejorar nuestros servicios.</li>
          <li>Procesar pagos y transacciones.</li>
          <li>Comunicarnos con usted sobre su cuenta y ofertas.</li>
          <li>Garantizar la seguridad de la plataforma.</li>
        </ul>

        <h3 className="text-success mt-4 mb-2">
          Protección de Datos
        </h3>

        <p className="text-muted">
          Implementamos medidas de seguridad como cifrado y controles de acceso
          para proteger su información contra accesos no autorizados.
        </p>

        <h3 className="text-success mt-4 mb-2">
          Sus Derechos
        </h3>

        <p className="text-muted">
          Puede acceder, corregir o eliminar sus datos personales. Para más información contáctenos en:
          {" "}
          <a
            href="mailto:privacidad@rescuefood.com"
            className="text-success fw-semibold"
          >
            privacidad@rescuefood.com
          </a>
        </p>

      </div>

    </div>
  );
}

export default PoliticasPrivacidad;