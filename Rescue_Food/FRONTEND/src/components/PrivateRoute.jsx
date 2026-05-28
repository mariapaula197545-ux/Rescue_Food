import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) { // Recibe por props los componentes hijos (las páginas) que se intentan proteger

  const token = localStorage.getItem('token'); // Revisa si el token del usuario está guardado en el almacenamiento del navegador

  if (!token) {

    return <Navigate to="/login" />; // Si no hay sesión activa, redirige de forma automática al usuario hacia la pantalla de login
  }

  return children; // Si el token existe, renderiza los componentes internos con total normalidad
}

export default PrivateRoute; // Exporta este componente guardián para envolver las rutas privadas en el archivo App.jsx