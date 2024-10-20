//authController.js
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { authConfig } from '../config/index.js';

// Función para generar el token JWT
export const generateToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role }, authConfig.jwtSecret, {
    expiresIn: authConfig.jwtExpiresIn,
  });
};


// Controlador para iniciar sesión con usuario y contraseña
export const loginUser = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ message: 'Autenticación fallida' });
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error al iniciar sesión' });
      }
      const token = generateToken(user);
      return res.status(200).json({ message: 'Autenticación exitosa', token });
    });
  })(req, res, next);
};

// Controlador para cerrar sesión
export const logout = (req, res) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(400).json({ message: 'No se proporcionó token' });
  }

  res.status(200).json({ message: 'Sesión cerrada con éxito. El token debe eliminarse en el frontend.' });
};
