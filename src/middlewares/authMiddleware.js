import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No se ha proporcionado un token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Almacenar la información del usuario en req.user
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token no válido' });
  }
};
