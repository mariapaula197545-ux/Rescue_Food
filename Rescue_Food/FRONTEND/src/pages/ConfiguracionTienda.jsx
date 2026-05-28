// ConfiguracionTienda.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Importante importar Link
import axios from 'axios';

function ConfiguracionTienda() {
  const token = localStorage.getItem('token'); // Recupera el token para enviar la petición autenticada al backend

  const [nombre, setNombre] = useState('');
  const [nombreTienda, setNombreTienda] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [horario, setHorario] = useState('');
  const [logo, setLogo] = useState(null); // Estado para el archivo binario del logo seleccionado
  const [preview, setPreview] = useState(''); // Estado para la URL de la previsualización del logo

  // CARGAR DATOS
  useEffect(() => {
    const cargarTienda = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem('usuario')); // Trae el id del usuario logueado desde la sesión local
        if (!usuario) return;

        const response = await axios.get(
          `http://localhost:3000/api/tiendas/usuario/${usuario.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}` // Envía el token Bearer requerido por el middleware de autenticación
            }
          }
        );

        const tienda = response.data.data;

        // Setea los estados con la información comercial y de usuario cruzada de la base de datos
        setNombre(tienda.nombre || '');
        setNombreTienda(tienda.nombre_tienda || '');
        setEmail(tienda.email || '');
        setTelefono(tienda.telefono || '');
        setDireccion(tienda.direccion || '');
        setHorario(tienda.horario || '');

        if (tienda.logo_url) {
          if (tienda.logo_url.startsWith('http')) {
            setPreview(tienda.logo_url);
          } else {
            setPreview(`http://localhost:3000${tienda.logo_url}`); // Mapea la ruta interna estática del servidor de backend
          }
        }

        localStorage.setItem('tienda', JSON.stringify(tienda)); // Actualiza los datos persistidos de la tienda en el cliente
      } catch (error) {
        console.error("Error al cargar los datos de la tienda:", error);
      }
    };

    cargarTienda();
  }, [token]); // Se ejecuta al montar el componente o si el token de sesión cambia

  const handleLogo = (e) => {
    const file = e.target.files[0]; // Captura el archivo binario desde la primera posición del arreglo de archivos del input
    if (!file) return;

    setLogo(file);
    setPreview(URL.createObjectURL(file)); // Crea una URL virtual temporal en memoria para renderizar la imagen de inmediato
  };

  // GUARDAR CONFIGURACIÓN
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));
      if (!usuario) return;

      const formData = new FormData(); // Instancia FormData para codificar la petición en multipart/form-data
      formData.append('nombre', nombre);
      formData.append('nombre_tienda', nombreTienda);
      formData.append('email', email);
      formData.append('telefono', telefono);
      formData.append('direccion', direccion);
      formData.append('horario', horario);

      if (logo) {
        formData.append('logo', logo); // Adjunta el logo binario solo si el comerciante seleccionó un archivo nuevo
      }

      const response = await axios.put(
        `http://localhost:3000/api/tiendas/usuario/${usuario.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data' // Cambia el Content-Type para dar soporte a la subida de archivos
          }
        }
      );

      localStorage.setItem('tienda', JSON.stringify(response.data.data)); // Guarda el registro modificado que retorna la BD

      alert('Configuración guardada correctamente');
    } catch (error) {
      console.error("Error detallado al guardar:", error.response?.data || error);
      alert('Error al guardar configuración');
    }
  };

  return (
    <div className="container my-5">
      <h2 className="fw-bold text-success text-center mb-4">
        Configuración de la Tienda
      </h2> 

      <div className="row">
        {/* MENÚ DE NAVEGACIÓN ACTUALIZADO CON LINKS */}
        <div className="col-md-3 mb-4">
          <div className="list-group shadow-sm">
            <button className="list-group-item list-group-item-action active bg-success border-success text-start">
              Información de la Tienda
            </button>
            <button type="button" className="list-group-item list-group-item-action disabled text-start">Notificaciones</button>
            
            {/* LINK HACIA LA NUEVA PÁGINA */}
            <Link to="/seguridad-tienda" className="list-group-item list-group-item-action text-start">
              Seguridad
            </Link>
            
            <button type="button" className="list-group-item list-group-item-action disabled text-start">Soporte</button>
          </div>
        </div>

        {/* FORMULARIO DE LA TIENDA */}
        <div className="col-md-9">
          <div className="card shadow-sm p-4">
            <form onSubmit={handleSubmit}>
              
              <div className="text-center mb-4">
                <img
                  src={preview || 'https://via.placeholder.com/150'}
                  alt="logo"
                  className="rounded-circle shadow"
                  style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Logo de la tienda</label>
                <input type="file" className="form-control" accept="image/*" onChange={handleLogo} />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Nombre de la cuenta</label>
                <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Nombre de la tienda</label>
                <input type="text" className="form-control" value={nombreTienda} onChange={(e) => setNombreTienda(e.target.value)} required />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Correo electrónico</label>
                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Teléfono</label>
                <input type="text" className="form-control" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Dirección</label>
                <input type="text" className="form-control" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Horario</label>
                <input type="text" className="form-control" value={horario} onChange={(e) => setHorario(e.target.value)} />
              </div>

              <button type="submit" className="btn btn-success w-100 py-2">
                Guardar Configuración
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfiguracionTienda;