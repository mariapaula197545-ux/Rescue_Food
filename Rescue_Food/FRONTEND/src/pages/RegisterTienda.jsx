import { useState } from 'react';
import api from '../api/axiosConfig'; // Importa la instancia centralizada de Axios que ya contiene la URL base de la API

function RegistroTienda() {

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [horario, setHorario] = useState('');
  const [password, setPassword] = useState(''); // Inicializa los estados locales individuales para capturar los datos requeridos por el comercio

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita la recarga automática de la pestaña al disparar el evento de envío del formulario

    try {
      await api.post(
        '/auth/register/tienda',
        {
          nombre,
          email,
          telefono,
          direccion,
          horario,
          password
        }
      ); // Transmite el objeto estructurado en formato JSON hacia el endpoint transaccional del backend

      alert('Tienda registrada correctamente');

      window.location.href = '/login-tienda'; // Redirección nativa para forzar la limpieza de memoria y navegar a la pantalla de login comercial

    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.msg ||
        'Error al registrar tienda'
      ); // Muestra el texto de rechazo controlado de la base de datos o una alerta genérica en su defecto
    }
  };

  return (
    <div className="container py-5">

      <div className="row justify-content-center">

        <div className="col-md-6 col-lg-4">

          <div className="card shadow-lg border-0 rounded-4 p-4">

            <h2 className="text-center mb-4 text-success">
              Registro Tienda
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">
                <label className="form-label">
                  Nombre de la Tienda
                </label>
                <input
                  type="text"
                  className="form-control"
                  required // Validación nativa del navegador para garantizar que el campo no viaje vacío
                  value={nombre}
                  onChange={(e) =>
                    setNombre(e.target.value)
                  } // Sincroniza la entrada de texto plano con el estado local de React
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  className="form-control"
                  required
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Teléfono
                </label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={telefono}
                  onChange={(e) =>
                    setTelefono(e.target.value)
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Dirección
                </label>
                <input
                  type="text"
                  className="form-control"
                  required
                  value={direccion}
                  onChange={(e) =>
                    setDireccion(e.target.value)
                  }
                />
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Horario de Atención
                </label>
                <select
                  className="form-control"
                  required
                  value={horario}
                  onChange={(e) =>
                    setHorario(e.target.value)
                  } // Vincula la opción seleccionada del menú desplegable con el estado horario
                >
                  <option value="">
                    Selecciona un horario
                  </option>
                  <option value="6:00 AM - 12:00 PM">
                    6:00 AM - 12:00 PM
                  </option>
                  <option value="6:00 AM - 6:00 PM">
                    6:00 AM - 6:00 PM
                  </option>
                  <option value="7:00 AM - 5:00 PM">
                    7:00 AM - 5:00 PM
                  </option>
                  <option value="8:00 AM - 8:00 PM">
                    8:00 AM - 8:00 PM
                  </option>
                  <option value="9:00 AM - 9:00 PM">
                    9:00 AM - 9:00 PM
                  </option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">
                  Contraseña
                </label>
                <input
                  type="password"
                  className="form-control"
                  required
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />
              </div>

              <button
                type="submit"
                className="btn btn-success w-100"
              >
                Registrarse
              </button>

            </form>

            <div className="text-center mt-3">
              <p className="text-muted">
                ¿Ya tienes cuenta?
              </p>
              <a
                href="/login-tienda"
                className="btn btn-outline-success w-100"
              >
                Iniciar Sesión
              </a>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default RegistroTienda;