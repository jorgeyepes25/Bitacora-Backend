// routes/authRoutes.js
import { Router } from 'express';
import passport from 'passport';
import { loginUser, logout } from '../controllers/authController.js';
import { generateToken } from '../controllers/authController.js'; // Reutilizar la función para generar tokens

const router = Router();

// Ruta para iniciar sesión con usuario y contraseña (Estrategia Local)
router.post('/login', loginUser);

// Ruta para cerrar sesión
router.get('/logout', logout);

// Ruta para iniciar sesión con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback para Google OAuth
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: 'Autenticación fallida con Google' });
    }
    const token = generateToken(user);
    return res.status(200).json({ message: 'Autenticación exitosa con Google', token, userId: user.id });
  })(req, res, next);
});

// Ruta para iniciar sesión con Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Callback para Facebook OAuth
router.get('/facebook/callback', (req, res, next) => {
  passport.authenticate('facebook', (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: 'Autenticación fallida con Facebook' });
    }
    const token = generateToken(user);
    return res.status(200).json({ message: 'Autenticación exitosa con Facebook', token, userId: user.id });
  })(req, res, next);
});

// Ruta para iniciar sesión con GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback para GitHub OAuth
router.get('/github/callback', (req, res, next) => {
  passport.authenticate('github', (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: 'Autenticación fallida con GitHub' });
    }
    const token = generateToken(user);
    return res.status(200).json({ message: 'Autenticación exitosa con GitHub', token, userId: user.id });
  })(req, res, next);
});

export default router;
