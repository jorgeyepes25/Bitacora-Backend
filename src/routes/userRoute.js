import { Router } from 'express';
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController.js';

const routerUser = Router();

// Crear un nuevo usuario
routerUser.post('/', createUser);

// Obtener todos los usuarios
routerUser.get('/', getUsers);

// Obtener un usuario por ID
routerUser.get('/:id', getUserById);

// Actualizar un usuario por ID
routerUser.put('/:id', updateUser);

// Eliminar un usuario por ID
routerUser.delete('/:id', deleteUser);

export default routerUser;
