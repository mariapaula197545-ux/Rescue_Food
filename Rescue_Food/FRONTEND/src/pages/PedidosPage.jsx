import { useEffect, useState } from 'react';

import {
  getPedidos
} from '../services/pedidos.service';

function PedidosPage() {

  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {

    cargarPedidos();

  }, []);

  const cargarPedidos = async () => {

    try {

      const usuario = JSON.parse(
        localStorage.getItem('usuario')
      );

      const response = await getPedidos(
        usuario.id
      );

      setPedidos(response.data);

    } catch (error) {

      console.log(error);
    }
  };

  return (

    <div>

      <h1>
        Mis pedidos
      </h1>

      {
        pedidos.map((pedido) => (

          <div key={pedido.id}>

            <h3>
              Pedido #{pedido.id}
            </h3>

            <p>
              Total: ${pedido.total}
            </p>

            <p>
              Estado: {pedido.estado}
            </p>

            <hr />

          </div>

        ))
      }

    </div>
  );
}

export default PedidosPage;