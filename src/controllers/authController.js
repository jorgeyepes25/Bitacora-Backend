import jwt from 'jsonwebtoken';
import passport from 'passport';

// Función para generar el token JWT
const generateToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
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
  req.logout();
  res.status(200).json({ message: 'Sesión cerrada con éxito' });
};
