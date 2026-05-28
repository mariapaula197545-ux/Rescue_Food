import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginComprador } from '../services/auth.service';

function LoginComprador() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook de React Router para redirigir al usuario de forma programática a otra pestaña

  const handleSubmit = async (e) => {
    e.preventDefault(); // Detiene la recarga automática de la página al enviar el formulario

    try {

      const response = await loginComprador({ email, password }); // Invoca al servicio de autenticación enviando las credenciales ingresadas

      console.log("RESPUESTA:", response);

      if (!response.token) {
        throw new Error("No llegó token del backend"); // Validación defensiva: fuerza el flujo al bloque catch si la API no devuelve la firma digital
      }

      localStorage.setItem('token', response.token); // Almacena el token JWT de forma persistente en el almacenamiento local del navegador
      localStorage.setItem('usuario', JSON.stringify(response.data)); // Convierte el objeto de datos del usuario a un String JSON para persistir su sesión

      alert('Login exitoso');

      navigate('/'); // Redirige al comprador a la página de inicio o home del aplicativo
      window.location.reload(); // Recarga la pestaña para obligar al Navbar y otros componentes a leer el nuevo estado de sesión

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.msg ||
        error.message
      ); // Muestra el mensaje de error controlado que devuelve el backend, o en su defecto, el de la excepción local
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">

          <div className="card shadow p-4">

            <h3 className="text-center mb-3">Login Comprador</h3>

            {/* IMAGEN DE SOPORTE VISUAL DEL COMPRADOR */}
            <div className="text-center">
              <img
                src="/img/Usuario.png"
                alt="Comprador"
                className="img-fluid mb-3"
                style={{ width: '120px' }}
              />
            </div>

            <form onSubmit={handleSubmit}>

              <input
                className="form-control mb-2"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Vinculación bidireccional (Double Data Binding) para actualizar el estado del email en vivo
              />

              <input
                className="form-control mb-2"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Captura el texto de la clave ocultando los caracteres por seguridad del input
              />

              <button className="btn btn-success w-100">
                Iniciar Sesión
              </button>

            </form>

          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginComprador;