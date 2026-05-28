import api from '../api/axiosConfig'; // Importa la instancia configurada de Axios que maneja la URL base global de la API

// OBTENER CARRITO
export const getCarrito = async (
  usuarioId
) => {

  const response = await api.get(
    `/carrito/${usuarioId}`
  ); // Envía una petición HTTP GET para consultar el estado actual del carrito enlazado a este ID de usuario

  return response.data; // Devuelve los ítems cruzados, subtotales y el costo total calculado por el backend
};

// AGREGAR PRODUCTO
export const addToCarrito = async (
  usuarioId,
  producto_id
) => {

  const response = await api.post(
    `/carrito/${usuarioId}/items`,
    {
      producto_id,
      cantidad: 1
    }
  ); // Ejecuta una llamada POST enviando el ID del producto y forzando una cantidad inicial de 1 al añadirlo

  return response.data; // Retorna el carrito actualizado para refrescar el estado del frontend de inmediato
};

// ELIMINAR PRODUCTO
export const removeItemCarrito = async (
  usuarioId,
  productoId
) => {

  const response = await api.delete(
    `/carrito/${usuarioId}/items/${productoId}`
  ); // Envía una petición DELETE inyectando de forma dinámica las variables en la URL para identificar el registro exacto a borrar

  return response.data; // Retorna el resultado de la operación para confirmar que se removió con éxito de la BD
};