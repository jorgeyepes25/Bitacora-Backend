import { Router } from 'express';
import {
  crearCategoriaMuestreo,
  obtenerCategoriasMuestreo,
  obtenerCategoriaMuestreoPorId,
  actualizarCategoriaMuestreo,
  eliminarCategoriaMuestreo
} from '../controllers/CategoriaMuestreoController.js';

const router = Router();

// Rutas para el CRUD de categorías de muestreo
router.post('/', crearCategoriaMuestreo);             // Crear una nueva categoría de muestreo
router.get('/', obtenerCategoriasMuestreo);           // Obtener todas las categorías de muestreo
router.get('/:id', obtenerCategoriaMuestreoPorId);    // Obtener una categoría de muestreo por ID
router.put('/:id', actualizarCategoriaMuestreo);      // Actualizar una categoría de muestreo por ID
router.delete('/:id', eliminarCategoriaMuestreo);     // Eliminar una categoría de muestreo por ID

export default router;
