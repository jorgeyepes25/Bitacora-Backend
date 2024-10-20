import { Router } from 'express';
import { loginUser, logout } from '../controllers/authController.js';
import passport from 'passport';
import { generateToken } from '../controllers/authController.js'; // Reutilizar la función para generar tokens

const router = Router();

// Rutas de autenticación
router.post('/login', loginUser);

// Rutas para autenticación Google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));

// Callback para Google OAuth
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: 'Autenticación fallida con Google' });
    }
    // Generar el token JWT
    const token = generateToken(user);
    return res.status(200).json({ message: 'Autenticación exitosa con Google', token });
  })(req, res, next);
});

export default router;
