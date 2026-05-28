import api from '../api/axiosConfig'; // Importa la instancia centralizada de Axios que gestiona la URL base y el token JWT de sesión

// OBTENER PRODUCTOS
export const getProductos = async () => {
  const response = await api.get('/productos');
  return response.data; // Retorna directamente la lista completa de productos mapeados desde la base de datos
};

// OBTENER PRODUCTO POR ID
export const getProductoById = async (id) => {
  const response = await api.get(`/productos/${id}`);
  return response.data; // Consume la ruta parametrizada para traer la ficha técnica de un único ítem seleccionado
};

// CREAR PRODUCTO
export const createProducto = async (data) => {
  const response = await api.post('/productos', data);
  return response.data; // Envía el paquete de datos del nuevo producto (incluyendo FormData para imágenes) mediante un método POST
};

// ACTUALIZAR
export const updateProducto = async (id, data) => {
  const response = await api.put(`/productos/${id}`, data);
  return response.data; // Ejecuta un método PUT enviando el ID en la URL para aplicar modificaciones parciales o completas
};

// ELIMINAR
export const deleteProducto = async (id) => {
  const response = await api.delete(`/productos/${id}`);
  return response.data; // Llama al verbo HTTP DELETE pasándole la clave primaria del producto para removerlo físicamente de la BD
};