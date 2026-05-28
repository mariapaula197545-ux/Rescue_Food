// SeguridadTienda.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function SeguridadTienda() {
  const token = localStorage.getItem('token'); // Recupera el token para autenticar la petición de cambio de contraseña en el backend

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Declaración de estados para capturar y validar las claves en la interfaz

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    // Validación preventiva en el cliente (Frontend)
    if (newPassword !== confirmPassword) {
      alert('La nueva contraseña y la confirmación no coinciden'); // Cancela la operación si el usuario cometió un error tipográfico
      return;
    }

    try {
      await axios.put(
        `http://localhost:3000/api/auth/cambiar-password`, 
        {
          passwordActual: currentPassword,
          passwordNuevo: newPassword
        },
        {
          headers: {
            Authorization: `Bearer ${token}` // Acopla el token Bearer en las cabeceras para superar el middleware de autenticación de la API
          }
        }
      ); // Ejecuta la petición PUT pasando las variables que el controlador necesita para verificar el hash en MySQL

      alert('Contraseña cambiada correctamente');
      
      // Limpiar el formulario tras el éxito para asegurar que los datos sensibles no queden en la memoria de la vista
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error) {
      console.error("Error al cambiar contraseña:", error.response?.data || error);
      alert(error.response?.data?.msg || 'Error al cambiar la contraseña'); // Mapea la alerta controlada que devuelve el backend
    }
  };

  return (
    <div className="container my-5">
      <h2 className="fw-bold text-success text-center mb-4">
        Configuración de la Tienda
      </h2>

      <div className="row">
        {/* MENÚ DE NAVEGACIÓN LATERAL */}
        <div className="col-md-3 mb-4">
          <div className="list-group shadow-sm">
            <Link to="/configuracion-tienda" className="list-group-item list-group-item-action">
              Información de la Tienda
            </Link>
            <button type="button" className="list-group-item list-group-item-action disabled text-start">Notificaciones</button>
            <button type="button" className="list-group-item list-group-item-action active bg-success border-success text-start">
              Seguridad
            </button>
            <button type="button" className="list-group-item list-group-item-action disabled text-start">Soporte</button>
          </div>
        </div>

        {/* COLUMNA DEL FORMULARIO NUEVO */}
        <div className="col-md-9">
          <div className="card shadow-sm p-4 border-0">
            <form onSubmit={handleSubmitPassword}>
              <h4 className="fw-bold text-success mb-4 border-bottom pb-2">
                Seguridad de la Cuenta
              </h4>

              <div className="mb-3">
                <label className="form-label fw-semibold">Contraseña Actual</label>
                <input 
                  type="password" // Garantiza que los caracteres no se muestren en texto plano por seguridad física
                  className="form-control" 
                  placeholder="Escribe tu contraseña actual"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Nueva Contraseña</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Mínimo 6 caracteres"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required 
                />
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Confirmar Nueva Contraseña</label>
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="Repite la nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required 
                />
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <Link to="/configuracion-tienda" className="btn btn-outline-secondary w-100 py-2">
                    Volver
                  </Link>
                </div>
                <div className="col-6">
                  <button type="submit" className="btn btn-success w-100 py-2 fw-semibold">
                    Actualizar Contraseña
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SeguridadTienda;