import { Router } from 'express';
import { loginUser, logout } from '../controllers/authController.js';  // Importa tus controladores
import passport from 'passport';

const router = Router();

// Rutas de autenticación
router.post('/login', loginUser);

// Rutas para Google, Facebook, GitHub
router.get('/google', passport.authenticate('google', { scope: ['profile'] }));
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: 'Autenticación fallida con Google' });
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    return res.status(200).json({ message: 'Autenticación exitosa con Google', token });
  })(req, res, next);
});

export default router;
