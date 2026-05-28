import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; // Importa la instancia configurada de Axios que maneja la URL base e interceptores

function LoginTienda() {

  const navigate = useNavigate();

  // Agrupa los campos de texto en un único objeto de estado para optimizar el manejo de datos
  const [form, setForm] = useState({
    email: '',
    password: ''
  });

  const [mensaje, setMensaje] = useState(''); // Estado para capturar y pintar las alertas de éxito o error en la interfaz

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    }); // Actualiza dinámicamente la propiedad del objeto usando el atributo 'name' del input correspondiente
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const response = await api.post('/auth/login/tienda', form); // Envía los datos estructurados del formulario usando el cliente Axios personalizado

      console.log("RESPUESTA:", response.data);

      if (!response.data.token) {
        throw new Error("No llegó token del backend");
      }

      localStorage.setItem('token', response.data.token); // Persiste el hash JWT de sesión en el almacenamiento local del navegador
      localStorage.setItem('usuario', JSON.stringify(response.data.data)); // Almacena los datos personales y el rol cruzado de la tienda como String

      setMensaje('Login exitoso');

      // Aplica un retraso controlado de 1 segundo para dar tiempo a que el usuario visualice el mensaje de éxito
      setTimeout(() => {
        navigate('/'); // Redirige al comerciante a la pantalla principal
        window.location.reload(); // Recarga el árbol de componentes para limpiar la memoria de React y forzar el renderizado de la sesión viva
      }, 1000);

    } catch (error) {
      console.log(error);

      setMensaje(
        error.response?.data?.msg ||
        error.message
      ); // Mapea el error del catch directo al estado visual para alertar al usuario en la tarjeta
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">

          <div className="card shadow p-4">

            <h3 className="text-center mb-3">Login Tienda</h3>

            {/* IMAGEN DE SOPORTE VISUAL DE LA TIENDA */}
            <div className="text-center">
              <img
                src="/img/Tienda.png"
                alt="Tienda"
                className="img-fluid mb-3"
                style={{ width: '120px' }}
              />
            </div>

            <form onSubmit={handleSubmit}>

              <input
                className="form-control mb-2"
                name="email" // Atributo clave mapeado por el manejador handleChange
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
              />

              <input
                className="form-control mb-2"
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />

              <button className="btn btn-success w-100">
                Iniciar Sesión
              </button>

            </form>

            {/* Renderizado condicional: Muestra el bloque HTML de alerta solo si el String del estado contiene texto */}
            {mensaje && (
              <div className="alert alert-info mt-2">
                {mensaje}
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default LoginTienda;