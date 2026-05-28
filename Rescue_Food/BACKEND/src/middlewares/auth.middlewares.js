const jwt = require('jsonwebtoken'); // Importa la librería para manejar tokens JWT

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Lee el encabezado de autorización HTTP
  const token = authHeader?.split(' ')[1]; // Extrae el token limpio sin la palabra 'Bearer'

  if (!token) {
    return res.status(401).json({ ok: false, msg: 'Token requerido' }); // Bloquea si no hay token
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Descifra y valida el token con la clave secreta
    req.usuario = decoded; // Guarda los datos del usuario en la petición
    next(); // Pasa a la siguiente función o controlador
  } catch (error) {
    // Captura fallas de autenticación cuando el token fue manipulado, es incorrecto o ya caducó
    return res.status(403).json({ ok: false, msg: 'Token inválido o expirado' });
  }
};

module.exports = { verificarToken }; // Exporta el middleware para usarlo en las rutas