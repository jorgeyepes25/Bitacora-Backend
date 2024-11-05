import { Router } from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const routerUser = Router();

// Crear un nuevo usuario
routerUser.post('/', createUser);

// Obtener todos los usuarios
routerUser.get('/', protect, getUsers);

// Obtener un usuario por ID
routerUser.get('/:id', protect, getUserById);

// Actualizar un usuario por ID
routerUser.put('/:id', protect, updateUser);

// Eliminar un usuario por ID
routerUser.delete('/:id', protect, deleteUser);

export default routerUser;
