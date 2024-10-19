import { Router } from 'express';
import { createRole, getRoles, getRoleById, updateRole, deleteRole } from '../controllers/roleController.js';

const routerRole = Router();

routerRole.post('/', createRole);       // Crear un nuevo rol
routerRole.get('/', getRoles);          // Obtener todos los roles
routerRole.get('/:id', getRoleById);    // Obtener un rol por ID
routerRole.put('/:id', updateRole);     // Actualizar un rol por ID
routerRole.delete('/:id', deleteRole);  // Eliminar un rol por ID

export default routerRole;
