// routes/authRoutes.js
import { Router } from 'express';
import passport from 'passport';
import { 
    loginUser, 
    logout, 
    googleCallback, 
    facebookCallback, 
    githubCallback, 
    googleSignupOrLogin, 
    facebookSignupOrLogin, 
    githubSignupOrLogin 
} from '../controllers/authController.js';

const router = Router();

// Ruta para iniciar sesión con usuario y contraseña (Estrategia Local)
router.post('/login', loginUser);

// Ruta para cerrar sesión
router.get('/logout', logout);

// Ruta para iniciar sesión con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Callback para Google OAuth
router.get('/google/callback', googleCallback);

// Ruta para iniciar sesión con Facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Callback para Facebook OAuth
router.get('/facebook/callback', facebookCallback);

// Ruta para iniciar sesión con GitHub
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback para GitHub OAuth
router.get('/github/callback', githubCallback);

// Rutas para crear cuenta con redes sociales
router.get('/social/google', googleSignupOrLogin);
router.get('/social/google/callback', googleCallback);

router.get('/social/facebook', facebookSignupOrLogin);
router.get('/social/facebook/callback', facebookCallback);

router.get('/social/github', githubSignupOrLogin);
router.get('/social/github/callback', githubCallback);

export default router;
