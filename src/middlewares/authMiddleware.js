import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  // Obtener el token del encabezado de autorización
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No se ha proporcionado un token, acceso denegado' });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Adjuntar el usuario al request
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token no válido, acceso denegado' });
  }
};
