import { Router } from 'express';
import { loginUser } from '../controllers/authController.js';
import { body } from 'express-validator';

const router = Router();

// Ruta de inicio de sesión
router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('El nombre de usuario es obligatorio'),
    body('password').notEmpty().withMessage('La contraseña es obligatoria')
  ],
  loginUser
);

export default router;
