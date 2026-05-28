import { useEffect, useState } from 'react';

function PedidosPage() {

  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {

    // 🔥 AQUÍ luego lo conectas a tu API REST
    const pedidosMock = [
      {
        id: 1001,
        fecha: '15/09/2025',
        precio: 80000,
        direccion: 'Calle 123, Ibagué',
        estado: 'Completado'
      },
      {
        id: 1002,
        fecha: '10/09/2025',
        precio: 50000,
        direccion: 'Carrera 45, Ibagué',
        estado: 'Pendiente'
      },
      {
        id: 1003,
        fecha: '05/09/2025',
        precio: 65000,
        direccion: 'Av. Principal, Ibagué',
        estado: 'En Proceso'
      },
      {
        id: 1004,
        fecha: '02/09/2025',
        precio: 40000,
        direccion: 'Calle 10 #5-22, Ibagué',
        estado: 'Cancelado'
      }
    ];

    setPedidos(pedidosMock);

  }, []);

  const getEstadoBadge = (estado) => {

    switch (estado) {

      case 'Completado':
        return 'bg-success';

      case 'Pendiente':
        return 'bg-warning text-dark';

      case 'En Proceso':
        return 'bg-info text-dark';

      case 'Cancelado':
        return 'bg-danger';

      default:
        return 'bg-secondary';
    }

  };

  return (

    <div className="container my-5">

      <h2 className="text-center fw-bold mb-5 text-success">
        Mis Pedidos
      </h2>

      <div className="row g-4">

        {pedidos.map((pedido) => (

          <div className="col-12 col-md-6" key={pedido.id}>

            <div className="card shadow-sm border-0 h-100">

              <div className="card-body">

                <h5 className="card-title fw-bold">
                  Pedido #{pedido.id}
                </h5>

                <p className="mb-1">
                  📅 <strong>Fecha:</strong> {pedido.fecha}
                </p>

                <p className="mb-1">
                  💰 <strong>Precio:</strong> ${pedido.precio.toLocaleString()}
                </p>

                <p className="mb-1">
                  📍 <strong>Dirección:</strong> {pedido.direccion}
                </p>

                <p className="mb-3">
                  <strong>Estado:</strong>{' '}
                  <span className={`badge ${getEstadoBadge(pedido.estado)}`}>
                    {pedido.estado}
                  </span>
                </p>

                <button className="btn btn-success w-100">
                  Ver Detalles
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );
}

export default PedidosPage;