import api from '../api/axiosConfig';

// CREAR PEDIDO
export const createPedido = async (
  usuarioId
) => {

  const response = await api.post(
    `/pedidos/${usuarioId}`
  );

  return response.data;
};

// OBTENER PEDIDOS
export const getPedidos = async (
  usuarioId
) => {

  const response = await api.get(
    `/pedidos/${usuarioId}`
  );

  return response.data;
};