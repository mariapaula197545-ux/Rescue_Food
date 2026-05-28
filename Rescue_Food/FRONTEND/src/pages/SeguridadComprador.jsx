// SeguridadComprador.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function SeguridadComprador() {
  const token = localStorage.getItem('token'); // Recupera el token para autenticar la solicitud de cambio en el backend

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Inicializa estados para validar la coincidencia en el cliente

  const handleSubmitPassword = async (e) => {
    e.preventDefault();

    // Validación en el lado del cliente (Frontend)
    if (newPassword !== confirmPassword) {
      alert('La nueva contraseña y la confirmación no coinciden'); // Bloquea el envío si las cadenas de texto difieren
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
            Authorization: `Bearer ${token}` // Adjunta el token Bearer para superar el middleware de validación del backend
          }
        }
      ); // Ejecuta una petición PUT pasando las variables que el controlador del backend espera recibir

      alert('Contraseña cambiada correctamente');
      
      // Limpiar el formulario tras el éxito para evitar la persistencia de datos sensibles en la vista
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error) {
      console.error("Error al cambiar contraseña:", error.response?.data || error);
      alert(error.response?.data?.msg || 'Error al cambiar la contraseña'); // Mapea el error controlado enviado desde el servidor
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-5 text-success">
        Configuración del Perfil
      </h2>

      <div className="row">
        {/* MENÚ DE NAVEGACIÓN LATERAL COMPRADOR */}
        <div className="col-md-3 mb-4">
          <div className="list-group shadow-sm">
            <Link to="/configuracion-comprador" className="list-group-item list-group-item-action text-start">
              Información Personal
            </Link>
            <button type="button" className="list-group-item list-group-item-action disabled text-start">Dirección</button>
            <button type="button" className="list-group-item list-group-item-action disabled text-start">Preferencias</button>
            <button type="button" className="list-group-item list-group-item-action active bg-success border-0 text-start">
              Seguridad
            </button>
          </div>
        </div>

        {/* COLUMNA DEL FORMULARIO DE CONTRASEÑA */}
        <div className="col-md-9">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <form onSubmit={handleSubmitPassword}>
                <h4 className="fw-bold text-success mb-4 border-bottom pb-2">
                  Seguridad de la Cuenta
                </h4>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Contraseña Actual</label>
                  <input 
                    type="password" // Oculta los caracteres en la interfaz por seguridad
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
                    <Link to="/configuracion-comprador" className="btn btn-outline-secondary w-100 py-2">
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
    </div>
  );
}

export default SeguridadComprador;