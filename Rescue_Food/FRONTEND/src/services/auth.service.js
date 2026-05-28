import api from '../api/axiosConfig'; // Importa la instancia centralizada de Axios que inyecta automáticamente las cabeceras y la URL base

// LOGIN COMPRADOR
export const loginComprador = async (data) => {

  const response = await api.post(
    '/auth/login/comprador',
    data
  ); // Envía una petición HTTP POST con el objeto de credenciales del comprador (email y password)

  return response.data; // Retorna la propiedad 'data' de la respuesta, que contiene el token JWT y el perfil del usuario
};

// LOGIN TIENDA
export const loginTienda = async (data) => {

  const response = await api.post(
    '/auth/login/tienda',
    data
  ); // Ejecuta una llamada POST hacia el endpoint especializado en la verificación de cuentas comerciales

  return response.data; // Envía los datos resueltos de vuelta al componente que invocó el servicio
};