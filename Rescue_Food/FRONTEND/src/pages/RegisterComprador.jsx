import { useState } from 'react';
import api from '../api/axiosConfig'; // Importa la instancia centralizada de Axios con la URL base preconfigurada

function RegisterComprador() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Declaración de estados locales individuales para capturar los datos del nuevo usuario

  const handleSubmit = async (e) => {
    e.preventDefault(); // Cancela el comportamiento nativo de envío del formulario para procesarlo mediante JavaScript asíncrono

    try {
      const response = await api.post('/auth/register/comprador', {
        nombre,
        email,
        password
      }); // Realiza una petición POST enviando un objeto JSON plano con las credenciales capturadas hacia el backend

      console.log("RESPUESTA:", response.data);

      alert('Usuario registrado correctamente');

      window.location.href = '/login-comprador'; // Redirección fuerte mediante la API nativa del navegador para forzar la navegación al Login

    } catch (error) {
      console.log("FULL ERROR:", error);
      console.log("RESPONSE:", error.response);
      console.log("DATA:", error.response?.data); // Trazas de depuración detalladas en consola para facilitar el rastreo de fallas en la API

      alert(error.response?.data?.msg || "Error al registrar"); // Mapeo de errores encadenado para mostrar la alerta enviada por el backend o un texto genérico de respaldo
    }
  };

  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-md-6 col-lg-4">

          <div className="card shadow-lg border-0 rounded-4 p-4">

            <h2 className="text-center mb-4 text-success">
              Registro Comprador
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label">Nombre completo</label>
                <input
                  type="text"
                  className="form-control"
                  required // Validación del lado del cliente nativa del navegador para bloquear campos vacíos
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)} // Vincula la entrada del input con el estado dinámico de React
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-success w-100">
                Registrarse
              </button>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RegisterComprador;