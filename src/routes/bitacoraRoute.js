import { Router } from 'express';
import {
  crearBitacora,
  obtenerBitacoras,
  obtenerBitacoraPorId,
  actualizarBitacora,
  eliminarBitacora,
  agregarNotaAdicional,
  obtenerNotasAdicionales,
  agregarComentario,
  obtenerComentarios
} from '../controllers/bitacoraController.js'; 
import upload from '../middlewares/multerMiddleware.js';

const router = Router();

// Rutas para el CRUD de bitácoras
router.post('/', upload.array('fotos'), crearBitacora);
router.get('/', obtenerBitacoras);
router.get('/:id', obtenerBitacoraPorId);
router.put('/:id', upload.array('fotos'), actualizarBitacora);
router.delete('/:id', eliminarBitacora);

// Rutas para notas adicionales y comentarios
router.post('/:id/notas', agregarNotaAdicional);
router.get('/:id/notas', obtenerNotasAdicionales);
router.post('/:id/comentarios', agregarComentario);
router.get('/:id/comentarios', obtenerComentarios);

export default router;
