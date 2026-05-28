import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api", // Define la URL base global de la API para no tener que repetirla en cada petición
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 interceptor automático de token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Recupera el token JWT almacenado de forma segura en el navegador

  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Si el token existe, lo inyecta automáticamente en la cabecera de la petición
  }

  return config; // Retorna la configuración modificada para que la petición continúe su viaje hacia el backend
});

export default api; // Exporta la instancia personalizada para realizar consultas HTTP (get, post, etc.) en todo el frontend