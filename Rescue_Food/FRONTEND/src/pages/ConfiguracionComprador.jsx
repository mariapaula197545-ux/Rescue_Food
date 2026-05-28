// ConfiguracionComprador.jsx

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ConfiguracionComprador() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [fotoPerfil, setFotoPerfil] = useState(null); // Almacena el archivo binario binario cargado desde el input file
  const [preview, setPreview] = useState(''); // Almacena la URL en String de la imagen para renderizar la miniatura visual

  // CARGAR USUARIO
  useEffect(() => {
    const usuario = JSON.parse(localStorage.getItem('usuario')); // Carga el estado inicial recuperando el perfil del almacenamiento local

    if (usuario) {
      setNombre(usuario.nombre || '');
      setEmail(usuario.email || '');
      setDireccion(usuario.direccion || '');

      // Verificación de persistencia al levantar el componente
      if (usuario.foto_perfil) {
        if (usuario.foto_perfil.startsWith('http')) {
          setPreview(usuario.foto_perfil);
        } else {
          setPreview(`http://localhost:3000${usuario.foto_perfil}`); // Valida si es ruta interna para concatenar el host del servidor
        }
      }
    }
  }, []);

  // GUARDAR
  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene la recarga por defecto de la página al procesar el formulario

    try {
      const usuario = JSON.parse(localStorage.getItem('usuario'));

      const formData = new FormData(); // Instancia FormData para estructurar la petición en bloques multiparte, requerida para subir imágenes
      formData.append('nombre', nombre);
      formData.append('email', email);
      formData.append('direccion', direccion);

      if (fotoPerfil) {
        formData.append('foto', fotoPerfil); // Adjunta el archivo binario real solo si el usuario seleccionó una imagen nueva
      }

      const response = await axios.put(
        `http://localhost:3000/api/usuarios/${usuario.id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data' // Cambia el header para indicarle al backend que viaja un archivo adjunto
          }
        }
      );

      // 1. Guardamos los datos frescos devueltos por el Backend en el LocalStorage
      const usuarioActualizado = response.data.data;
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado)); // Reemplaza la sesión local con el registro fresco de la BD

      // 2. 🔥 SOLUCIÓN CRÍTICA: Forzamos la actualización de la miniatura con la ruta real de la BD
      if (usuarioActualizado.foto_perfil) {
        if (usuarioActualizado.foto_perfil.startsWith('http')) {
          setPreview(usuarioActualizado.foto_perfil);
        } else {
          setPreview(`http://localhost:3000${usuarioActualizado.foto_perfil}`);
        }
      }

      // Limpiamos el archivo temporal cargado en memoria
      setFotoPerfil(null);

      alert('Perfil actualizado correctamente');
    } catch (error) {
      console.log(error);
      alert('Error al actualizar perfil');
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center fw-bold mb-5 text-success">
        Configuración del Perfil
      </h2>

      <div className="row">
        {/* MENU */}
        <div className="col-md-3 mb-4">
          <div className="list-group shadow-sm">
            <button type="button" className="list-group-item list-group-item-action active bg-success border-0 text-start">
              Información Personal
            </button>

            <button type="button" className="list-group-item list-group-item-action text-start disabled">
              Dirección
            </button>

            <button type="button" className="list-group-item list-group-item-action text-start disabled">
              Preferencias
            </button>

            <Link to="/seguridad-comprador" className="list-group-item list-group-item-action text-start">
              Security
            </Link>
          </div>
        </div>

        {/* FORM */}
        <div className="col-md-9">
          <div className="card shadow-lg border-0">
            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                
                {/* FOTO */}
                <div className="text-center mb-4">
                  <img
                    src={
                      fotoPerfil instanceof File
                        ? URL.createObjectURL(fotoPerfil) // Crea un enlace blob temporal de memoria para previsualizar la foto cargada al instante
                        : preview
                        ? preview
                        : 'https://via.placeholder.com/150'
                    }
                    alt="perfil"
                    className="rounded-circle shadow-sm"
                    style={{
                      width: '150px',
                      height: '150px',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                {/* INPUT FOTO */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Foto Perfil
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setFotoPerfil(e.target.files[0]); // Captura el primer archivo de la lista binaria del input
                      }
                    }}
                  />
                </div>

                {/* NOMBRE */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Nombre
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>

                {/* EMAIL */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* DIRECCION */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Dirección
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100 py-2 fw-semibold"
                >
                  Guardar Cambios
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfiguracionComprador;